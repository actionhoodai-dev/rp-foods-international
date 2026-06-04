"use client";

import { useEffect, useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ImageIcon, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  PlusCircle, 
  MinusCircle, 
  Globe, 
  SlidersHorizontal,
  FolderOpen
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getCategories, getProducts, saveProduct, deleteProduct, logActivity } from "@/lib/firebase/db";
import { uploadToCloudinary, deleteFromCloudinary } from "@/app/actions/cloudinary";
import { Product, Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AdminProductsPage() {
  const { user } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filters State
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Product Form Fields State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  
  // Custom Arrays State
  const [specifications, setSpecifications] = useState<{ label: string; value: string }[]>([]);
  const [packagingDetails, setPackagingDetails] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  
  // SEO State
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  // Image Upload Substates
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, prods] = await Promise.all([getCategories(), getProducts()]);
      setCategories(cats);
      setProducts(prods);
    } catch (err) {
      console.error("Error loading product management data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingProduct) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleOpenNew = () => {
    setEditingProduct(null);
    setName("");
    setSlug("");
    setCategoryId(categories[0]?.id || "");
    setShortDescription("");
    setFullDescription("");
    setStatus("draft");
    setSpecifications([{ label: "Origin", value: "Dindigul, Tamil Nadu, India" }, { label: "Form", value: "Powder" }]);
    setPackagingDetails(["100g Pouch", "Bulk Carton / PP Bags"]);
    setBenefits(["100% natural, no added fillers"]);
    setApplications(["Curries and savory dishes"]);
    setImages([]);
    setSeoTitle("");
    setSeoDesc("");
    setDialogOpen(true);
  };

  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    setCategoryId(prod.categoryId);
    setShortDescription(prod.shortDescription);
    setFullDescription(prod.fullDescription);
    setStatus(prod.status);
    setSpecifications(prod.specifications || []);
    setPackagingDetails(prod.packagingDetails || []);
    setBenefits(prod.benefits || []);
    setApplications(prod.applications || []);
    setImages(prod.images || []);
    setSeoTitle(prod.seo?.title || "");
    setSeoDesc(prod.seo?.description || "");
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        const uploadedUrl = await uploadToCloudinary(base64Data, "rp-foods/products");
        setImages((prev) => [...prev, uploadedUrl]);
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Cloudinary image upload error:", error);
      alert("Failed to upload image.");
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async (urlIndex: number, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    try {
      // Trigger Cloudinary deletion in background
      if (url.includes("cloudinary")) {
        await deleteFromCloudinary(url);
      }
      setImages((prev) => prev.filter((_, idx) => idx !== urlIndex));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  // Image sorting functions
  const handleMoveImageUp = (idx: number) => {
    if (idx === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[idx - 1];
      copy[idx - 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  const handleMoveImageDown = (idx: number) => {
    if (idx === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[idx + 1];
      copy[idx + 1] = copy[idx];
      copy[idx] = temp;
      return copy;
    });
  };

  // Specifications Dynamic rows
  const handleAddSpecRow = () => {
    setSpecifications((prev) => [...prev, { label: "", value: "" }]);
  };

  const handleUpdateSpecRow = (idx: number, field: "label" | "value", val: string) => {
    setSpecifications((prev) => {
      const copy = [...prev];
      copy[idx][field] = val;
      return copy;
    });
  };

  const handleRemoveSpecRow = (idx: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== idx));
  };

  // Text lists dynamic rows
  const handleAddTextRow = (listType: "pkg" | "ben" | "app") => {
    if (listType === "pkg") setPackagingDetails((prev) => [...prev, ""]);
    if (listType === "ben") setBenefits((prev) => [...prev, ""]);
    if (listType === "app") setApplications((prev) => [...prev, ""]);
  };

  const handleUpdateTextRow = (listType: "pkg" | "ben" | "app", idx: number, val: string) => {
    const setter = listType === "pkg" 
      ? setPackagingDetails 
      : listType === "ben" 
        ? setBenefits 
        : setApplications;
    setter((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleRemoveTextRow = (listType: "pkg" | "ben" | "app", idx: number) => {
    const setter = listType === "pkg" 
      ? setPackagingDetails 
      : listType === "ben" 
        ? setBenefits 
        : setApplications;
    setter((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadingImage(true); // use upload lock as action lock
    try {
      const newProduct: Product = {
        id: editingProduct?.id || `prod_${Date.now()}`,
        name: name.trim(),
        slug: slug.trim(),
        categoryId,
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription.trim(),
        status,
        specifications: specifications.filter(s => s.label.trim() !== ""),
        packagingDetails: packagingDetails.filter(p => p.trim() !== ""),
        benefits: benefits.filter(b => b.trim() !== ""),
        applications: applications.filter(a => a.trim() !== ""),
        images,
        seo: {
          title: seoTitle.trim() || name.trim(),
          description: seoDesc.trim() || shortDescription.trim()
        },
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveProduct(newProduct);
      
      if (user?.email) {
        await logActivity(
          user.email,
          `${editingProduct ? "Updated" : "Created"} product: ${name}`
        );
      }

      setDialogOpen(false);
      loadData();
    } catch (err) {
      console.error("Save product error:", err);
      alert("Failed to save product.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDuplicate = async (prod: Product) => {
    try {
      const duplicated: Product = {
        ...prod,
        id: `prod_${Date.now()}`,
        name: `${prod.name} (Copy)`,
        slug: `${prod.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await saveProduct(duplicated);
      
      if (user?.email) {
        await logActivity(user.email, `Duplicated product: ${prod.name}`);
      }

      loadData();
    } catch (err) {
      console.error("Duplicate product error:", err);
    }
  };

  const handleDelete = async (prod: Product) => {
    if (!confirm(`Are you sure you want to delete product: "${prod.name}"? This deletes all associated media assets.`)) {
      return;
    }
    try {
      // 1. Delete associated Cloudinary images
      if (prod.images) {
        for (const url of prod.images) {
          if (url.includes("cloudinary")) {
            await deleteFromCloudinary(url);
          }
        }
      }
      // 2. Delete Firestore doc
      await deleteProduct(prod.id);
      
      if (user?.email) {
        await logActivity(user.email, `Deleted product: ${prod.name}`);
      }

      loadData();
    } catch (error) {
      console.error("Delete product error:", error);
    }
  };

  // Filter products locally
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = filterCategory === "all" || prod.categoryId === filterCategory;
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* Top action block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-charcoal">Product Registry</h1>
          <p className="text-xs text-gray-500 font-semibold leading-relaxed">
            Manage your export spice directory, edit technical datasheets, and upload optimized product images.
          </p>
        </div>
        <Button 
          onClick={handleOpenNew}
          className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider px-5 py-4"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Filters bar */}
      <div className="bg-white p-4 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-1/3 flex flex-col gap-1">
          <Label className="text-[9px] uppercase font-bold text-gray-400">Search Products</Label>
          <Input 
            placeholder="Search name, ingredients..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-none border-gray-300 h-9 text-xs"
          />
        </div>

        <div className="w-full sm:w-1/4 flex flex-col gap-1">
          <Label className="text-[9px] uppercase font-bold text-gray-400">Filter Category</Label>
          <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val || "all")}>
            <SelectTrigger className="rounded-none border-gray-300 h-9 text-xs">
              <SelectValue placeholder="All Categories">
                {filterCategory === "all" ? "All Categories" : categories.find(c => c.id === filterCategory)?.name || "Select Category"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="rounded-none">
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-400 font-semibold">
            No products registered matching your criteria.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 pl-6 w-20">Preview</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Product Name</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Category</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((prod) => {
                const imageSrc = prod.images?.[0] || "";
                const categoryName = categories.find(c => c.id === prod.categoryId)?.name || "Spice Blend";
                
                return (
                  <TableRow key={prod.id} className="hover:bg-gray-50/20 border-b border-gray-200">
                    <TableCell className="py-3 pl-6">
                      <div className="h-10 w-10 border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center shrink-0">
                        {imageSrc ? (
                          <img src={imageSrc} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-bold text-gray-700">{prod.name}</span>
                        <span className="text-[10px] text-gray-400 line-clamp-1 max-w-sm">{prod.shortDescription}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <span className="text-xs font-bold text-gray-500">{categoryName}</span>
                    </TableCell>
                    <TableCell className="py-3">
                      {prod.status === "published" ? (
                        <span className="text-[10px] font-bold text-green-600 uppercase tracking-wide bg-green-50 px-2 py-0.5 border border-green-200 flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> Published
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide bg-gray-100 px-2 py-0.5 border border-gray-200 flex items-center gap-1.5 w-fit">
                          <XCircle className="h-3 w-3" /> Draft
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleOpenEdit(prod)}
                          className="rounded-none border-gray-200 h-8 w-8 text-charcoal hover:bg-gray-100"
                          title="Edit Details"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDuplicate(prod)}
                          className="rounded-none border-gray-200 h-8 w-8 text-charcoal hover:bg-gray-100"
                          title="Duplicate Product"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDelete(prod)}
                          className="rounded-none border-red-100 h-8 w-8 text-red-600 hover:bg-red-50"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit/Create Form dialog Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-5xl w-full max-h-[85vh] overflow-y-auto rounded-none border-gray-200 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold font-heading text-maroon">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Export Product"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Configure product details, dynamic datasheets, multi-pack packaging, and SEO.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-4">
            
            {/* Left Main Settings Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Product Name</Label>
                  <Input
                    type="text"
                    placeholder="e.g. Rasam Powder"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    className="rounded-none border-gray-300 h-9"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Slug (URL)</Label>
                  <Input
                    type="text"
                    placeholder="e.g. rasam-powder"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    className="rounded-none border-gray-300 h-9"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Assign Category</Label>
                  <Select value={categoryId} onValueChange={(val) => setCategoryId(val || "")}>
                    <SelectTrigger className="rounded-none border-gray-300 h-9 text-xs">
                      <SelectValue placeholder="Select Category">
                        {categories.find(c => c.id === categoryId)?.name || "Select Category"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[10px] uppercase font-bold text-gray-400">Publish Status</Label>
                  <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                    <SelectTrigger className="rounded-none border-gray-300 h-9 text-xs">
                      <SelectValue>
                        {status === "published" ? "Published" : "Draft"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      <SelectItem value="draft">Draft (Private)</SelectItem>
                      <SelectItem value="published">Published (Public Catalog)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-gray-400">Short Description</Label>
                <Input
                  type="text"
                  placeholder="One sentence summary of the product (visible on cards)..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  required
                  className="rounded-none border-gray-300 h-9"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-[10px] uppercase font-bold text-gray-400">Full Description</Label>
                <Textarea
                  placeholder="Comprehensive detail description detailing taste profiles, quality grades, etc."
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  rows={5}
                  required
                  className="rounded-none border-gray-300 text-xs"
                />
              </div>

              {/* Technical Specifications Datasheet Row Editor */}
              <div className="bg-neutral-bg p-5 border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
                  <h4 className="text-xs font-bold font-heading text-maroon uppercase tracking-wider">
                    Technical Specifications Datasheet
                  </h4>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddSpecRow}
                    className="rounded-none border-gray-300 text-xs font-bold uppercase tracking-wider h-7"
                  >
                    <PlusCircle className="mr-1.5 h-3.5 w-3.5 text-maroon" /> Add Row
                  </Button>
                </div>

                <div className="flex flex-col gap-3">
                  {specifications.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Input
                        placeholder="Spec Label (e.g. Origin)"
                        value={spec.label}
                        onChange={(e) => handleUpdateSpecRow(idx, "label", e.target.value)}
                        className="rounded-none border-gray-300 bg-white h-8 text-xs w-1/3"
                      />
                      <Input
                        placeholder="Spec Value (e.g. India)"
                        value={spec.value}
                        onChange={(e) => handleUpdateSpecRow(idx, "value", e.target.value)}
                        className="rounded-none border-gray-300 bg-white h-8 text-xs flex-grow"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSpecRow(idx)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 shrink-0"
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Media / Lists Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
              
              {/* Multiple Images Upload & Ordering Panel */}
              <div className="bg-neutral-bg p-5 border border-gray-200 flex flex-col gap-4">
                <h4 className="text-xs font-bold font-heading text-maroon uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-200 pb-2">
                  <ImageIcon className="h-3.5 w-3.5 text-gold-dark" /> Product Image Gallery
                </h4>

                {/* Upload Action */}
                <div className="flex flex-col gap-1.5">
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="rounded-none border-gray-300 file:bg-gray-100 file:border-none file:text-xs file:font-bold text-xs h-9 cursor-pointer"
                  />
                  <span className="text-[9px] text-gray-400">Upload multiple images. The first image serves as catalog thumbnail.</span>
                </div>

                {/* Image List Preview with Sorting and Deletion */}
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {images.map((img, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white border border-gray-200/80 gap-3">
                        <div className="flex items-center gap-2">
                          <img src={img} alt="" className="h-8 w-8 object-cover border border-gray-100 shrink-0" />
                          <span className="text-[9px] font-bold text-gray-400 truncate max-w-[150px]">
                            {idx === 0 ? "★ Main Cover" : `Image #${idx}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button type="button" size="icon" variant="ghost" onClick={() => handleMoveImageUp(idx)} className="h-6 w-6 text-gray-400 hover:text-charcoal" title="Move Up">
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <Button type="button" size="icon" variant="ghost" onClick={() => handleMoveImageDown(idx)} className="h-6 w-6 text-gray-400 hover:text-charcoal" title="Move Down">
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                          <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveImage(idx, img)} className="h-6 w-6 text-red-500 hover:text-red-700" title="Delete">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-gray-200 text-[10px] text-gray-400 font-semibold bg-white">
                    No images uploaded yet.
                  </div>
                )}
              </div>

              {/* Dynamic Lists (Packaging, Applications, Benefits) */}
              <div className="flex flex-col gap-4 bg-neutral-bg p-5 border border-gray-200">
                
                {/* Packaging Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal">Packaging Details</span>
                    <button type="button" onClick={() => handleAddTextRow("pkg")} className="text-xs font-bold text-maroon hover:underline flex items-center gap-0.5">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {packagingDetails.map((pkg, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={pkg} onChange={(e) => handleUpdateTextRow("pkg", idx, e.target.value)} placeholder="e.g. 500g Stand-up pouch" className="h-7 text-xs rounded-none border-gray-300 bg-white" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTextRow("pkg", idx)} className="h-7 w-7 text-red-500"><MinusCircle className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal">Applications</span>
                    <button type="button" onClick={() => handleAddTextRow("app")} className="text-xs font-bold text-maroon hover:underline flex items-center gap-0.5">
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {applications.map((app, idx) => (
                      <div key={idx} className="flex gap-2">
                        <Input value={app} onChange={(e) => handleUpdateTextRow("app", idx, e.target.value)} placeholder="e.g. Base flavor for curries" className="h-7 text-xs rounded-none border-gray-300 bg-white" />
                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveTextRow("app", idx)} className="h-7 w-7 text-red-500"><MinusCircle className="h-3.5 w-3.5" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Block */}
              <div className="bg-neutral-bg p-5 border border-gray-200 flex flex-col gap-3">
                <h4 className="text-xs font-bold font-heading text-maroon uppercase tracking-wider flex items-center gap-1 border-b border-gray-200 pb-2">
                  <Globe className="h-3.5 w-3.5" /> SEO Metatags
                </h4>
                <div className="flex flex-col gap-1">
                  <Label className="text-[9px] uppercase font-bold text-gray-400">Meta Title</Label>
                  <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="e.g. Buy Wholesale Sambar Powder - RP Foods" className="h-8 text-xs rounded-none border-gray-300 bg-white" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[9px] uppercase font-bold text-gray-400">Meta Description</Label>
                  <Textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} placeholder="Add description metatags..." rows={2} className="text-xs rounded-none border-gray-300 bg-white" />
                </div>
              </div>

              {/* Dialog Footer Actions */}
              <DialogFooter className="border-t border-gray-100 pt-4 flex gap-2">
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
                  disabled={uploadingImage}
                  className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider h-11 px-6 shadow-md"
                >
                  {uploadingImage ? "Processing..." : "Save Product"}
                </Button>
              </DialogFooter>

            </div>

          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
