"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Globe, Image as ImageIcon, Sparkles } from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getCategories, saveCategory, deleteCategory, logActivity } from "@/lib/firebase/db";
import { uploadToCloudinary, deleteFromCloudinary } from "@/app/actions/cloudinary";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function AdminCategoriesPage() {
  const { user } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Sync Slug Generation
  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleOpenNew = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImageUrl("");
    setEnabled(true);
    setSeoTitle("");
    setSeoDesc("");
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImageUrl(cat.image);
    setEnabled(cat.enabled);
    setSeoTitle(cat.seo.title);
    setSeoDesc(cat.seo.description);
    setImageFile(null);
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = imageUrl;

      // 1. Upload file to Cloudinary if a new one is selected
      if (imageFile) {
        // If editing and we have an old URL, we can delete it from Cloudinary (optional)
        if (editingCategory?.image && editingCategory.image.includes("cloudinary")) {
          await deleteFromCloudinary(editingCategory.image);
        }
        finalImageUrl = await uploadToCloudinary(imageFile, "rp-foods/categories");
      }

      // 2. Prepare Category Doc
      const newCategory: Category = {
        id: editingCategory?.id || `cat_${Date.now()}`,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        image: finalImageUrl,
        enabled,
        seo: {
          title: seoTitle.trim() || name.trim(),
          description: seoDesc.trim() || description.trim()
        },
        createdAt: editingCategory?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // 3. Write to Firestore
      await saveCategory(newCategory);
      
      // 4. Log Admin Activity
      if (user?.email) {
        await logActivity(
          user.email,
          `${editingCategory ? "Updated" : "Created"} product category: ${name}`
        );
      }

      setDialogOpen(false);
      loadCategories();
    } catch (err) {
      console.error("Save category error:", err);
      alert("Failed to save category. Verify configurations.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to delete the category: "${cat.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      // 1. Delete image from Cloudinary
      if (cat.image && cat.image.includes("cloudinary")) {
        await deleteFromCloudinary(cat.image);
      }
      // 2. Delete Firestore doc
      await deleteCategory(cat.id);
      
      // 3. Log activity
      if (user?.email) {
        await logActivity(user.email, `Deleted product category: ${cat.name}`);
      }

      loadCategories();
    } catch (error) {
      console.error("Delete category error:", error);
    }
  };

  const handleToggleEnabled = async (cat: Category) => {
    try {
      const updatedCat: Category = {
        ...cat,
        enabled: !cat.enabled,
        updatedAt: new Date().toISOString()
      };
      await saveCategory(updatedCat);
      
      if (user?.email) {
        await logActivity(user.email, `${updatedCat.enabled ? "Enabled" : "Disabled"} category: ${cat.name}`);
      }

      loadCategories();
    } catch (error) {
      console.error("Toggle category state error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-10 bg-gray-200 w-1/4 mb-4" />
        <div className="h-64 bg-gray-200 border border-gray-100" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Page Title & Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-charcoal">Category Management</h1>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Create, view, edit, or disable product categories displayed on the public catalog site.
          </p>
        </div>
        <Button 
          onClick={handleOpenNew}
          className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider px-5 py-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Create Category
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
        {categories.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-400 font-semibold">
            No categories registered. Click &quot;Create Category&quot; to register your first range.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 pl-6 w-20">Image</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Category Name</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Slug Route</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} className="hover:bg-gray-50/20 border-b border-gray-200">
                  <TableCell className="py-3 pl-6">
                    <div className="h-10 w-10 border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-gray-700">{cat.name}</span>
                      <span className="text-[10px] text-gray-400 line-clamp-1 max-w-sm">{cat.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <code className="text-[10px] bg-gray-100 px-1.5 py-0.5 border border-gray-200/60 rounded text-charcoal">
                      /products?category={cat.slug}
                    </code>
                  </TableCell>
                  <TableCell className="py-3">
                    <button 
                      onClick={() => handleToggleEnabled(cat)}
                      className="focus:outline-none"
                    >
                      {cat.enabled ? (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-0.5 border border-green-200 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Enabled
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-wide bg-red-50 px-2 py-0.5 border border-red-200 flex items-center gap-1.5 w-fit">
                          <XCircle className="h-3 w-3" /> Disabled
                        </span>
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="py-3 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleOpenEdit(cat)}
                        className="rounded-none border-gray-200 h-8 w-8 text-charcoal hover:bg-gray-100"
                        title="Edit Details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleDelete(cat)}
                        className="rounded-none border-red-100 h-8 w-8 text-red-600 hover:bg-red-50"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* dialog Modal Form */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl w-full max-h-[85vh] overflow-y-auto rounded-none border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-maroon">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Product Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Fill out general specifications, upload a cover banner, and configure SEO fields.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-4">
            
            {/* Left Form Settings Column */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Category Name</Label>
                <Input
                  type="text"
                  placeholder="e.g. Spice Powders"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="rounded-none border-gray-300 focus-visible:ring-maroon"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Slug Route (URL)</Label>
                <Input
                  type="text"
                  placeholder="e.g. spice-powders"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="rounded-none border-gray-300 focus-visible:ring-maroon"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Description</Label>
                <Textarea
                  placeholder="Brief summary of this category catalog..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className="rounded-none border-gray-300 focus-visible:ring-maroon text-xs"
                />
              </div>

              {/* Cover Image */}
              <div className="flex flex-col gap-2">
                <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Category Banner Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                    {imageFile ? (
                      <img src={imageFile} alt="Temp" className="w-full h-full object-cover" />
                    ) : imageUrl ? (
                      <img src={imageUrl} alt="Stored" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-grow">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="rounded-none border-gray-300 file:bg-gray-100 file:border-none file:text-xs file:font-semibold text-xs h-9 cursor-pointer"
                    />
                    <span className="text-[9px] text-gray-400">Recommended: Square aspect ratio, under 2MB. Optimized as WebP.</span>
                  </div>
                </div>
              </div>

              {/* Status checkbox */}
              <div className="flex items-center gap-2 border-t border-gray-100 pt-3">
                <Checkbox
                  id="enabled"
                  checked={enabled}
                  onCheckedChange={(checked) => setEnabled(!!checked)}
                  className="border-gray-300 data-[state=checked]:bg-maroon data-[state=checked]:border-maroon rounded-none h-4 w-4"
                />
                <Label htmlFor="enabled" className="text-xs font-bold text-gray-600 cursor-pointer">
                  Publish to Catalog (Visible to public visitors)
                </Label>
              </div>
            </div>

            {/* Right SEO & Live Preview Column */}
            <div className="flex flex-col gap-6 justify-between">
              
              {/* SEO Settings block */}
              <div className="bg-neutral-bg p-5 border border-gray-200 flex flex-col gap-4">
                <h4 className="text-xs font-bold font-heading text-maroon uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <Globe className="h-3.5 w-3.5" /> Search Engine Optimization (SEO)
                </h4>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Meta Page Title</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Pure Spice Powders Supplier - Dindigul"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="rounded-none border-gray-300 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Meta Description</Label>
                  <Textarea
                    placeholder="Add detailed meta description tags..."
                    value={seoDesc}
                    onChange={(e) => setSeoDesc(e.target.value)}
                    rows={3}
                    className="rounded-none border-gray-300 bg-white text-xs"
                  />
                </div>
              </div>

              {/* Live Preview block */}
              <div className="flex flex-col gap-2">
                <Label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-gold-dark" /> Live Design Preview
                </Label>
                
                {/* Category Card mockup */}
                <div className="relative h-48 w-full bg-charcoal overflow-hidden border border-gray-200/80 shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent z-10" />
                  
                  {imageFile ? (
                    <img src={imageFile} alt="Preview" className="w-full h-full object-cover opacity-60" />
                  ) : imageUrl ? (
                    <img src={imageUrl} alt="Current" className="w-full h-full object-cover opacity-60" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-maroon/20 to-charcoal flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-white/20 animate-pulse" />
                    </div>
                  )}

                  <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-gold mb-1">0 Products</span>
                    <h3 className="text-xl font-bold font-heading">{name || "Unnamed Category"}</h3>
                    <p className="text-[10px] text-gray-300 line-clamp-1 leading-normal mt-1">{description || "Category description will go here..."}</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <DialogFooter className="border-t border-gray-100 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                  className="rounded-none border-gray-200 text-xs font-bold uppercase tracking-wider h-11"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={uploading}
                  className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider h-11 px-6 shadow-md"
                >
                  {uploading ? "Saving Category..." : "Save Category"}
                </Button>
              </DialogFooter>
            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
