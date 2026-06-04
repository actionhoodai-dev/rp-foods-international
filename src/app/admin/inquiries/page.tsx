"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Globe, 
  User, 
  Building, 
  Phone, 
  Eye, 
  Tag 
} from "lucide-react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { getInquiries, updateInquiryStatus, deleteInquiry, logActivity } from "@/lib/firebase/db";
import { Inquiry } from "@/types";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminInquiriesPage() {
  const { user } = useAdminAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selected Inquiry for Modal
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error("Error loading inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleOpenInquiry = async (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setViewDialogOpen(true);

    if (inq.status === "new") {
      try {
        await updateInquiryStatus(inq.id, "read");
        
        // Log Activity
        if (user?.email) {
          await logActivity(user.email, `Read inquiry from ${inq.name} (${inq.companyName})`);
        }
        
        // Refresh local list
        const updatedData = inquiries.map((item) => 
          item.id === inq.id ? { ...item, status: "read" as const } : item
        );
        setInquiries(updatedData);
      } catch (err) {
        console.error("Error marking inquiry read:", err);
      }
    }
  };

  const handleDelete = async (inq: Inquiry, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent modal opening
    if (!confirm(`Are you sure you want to delete the inquiry from: "${inq.name}"? This is permanent.`)) {
      return;
    }
    try {
      await deleteInquiry(inq.id);
      
      if (user?.email) {
        await logActivity(user.email, `Deleted inquiry record from ${inq.name}`);
      }

      loadInquiries();
      if (selectedInquiry?.id === inq.id) {
        setViewDialogOpen(false);
      }
    } catch (err) {
      console.error("Error deleting inquiry:", err);
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

  const unreadCount = inquiries.filter(i => i.status === "new").length;

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-charcoal">Inquiry Inbox</h1>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Review incoming bulk export requests. Unread requests are marked with blue tags.
        </p>
      </div>

      {/* Table grid */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-none overflow-hidden">
        
        {/* Table Toolbar */}
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Received inquiries ({inquiries.length})
          </span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold text-white bg-maroon px-2 py-0.5 uppercase tracking-wider animate-pulse">
              {unreadCount} Unread
            </span>
          )}
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-16 text-xs text-gray-400 font-semibold">
            No inquiries received. Form submissions on contact/details pages will show up here.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 pl-6 w-12">Status</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Buyer / Company</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Destination</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Inquiry Area</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Received</TableHead>
                <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inq) => {
                const isNew = inq.status === "new";
                return (
                  <TableRow 
                    key={inq.id} 
                    onClick={() => handleOpenInquiry(inq)}
                    className={`hover:bg-gray-50/40 border-b border-gray-200 cursor-pointer ${isNew ? "bg-blue-50/10 font-medium" : ""}`}
                  >
                    <TableCell className="py-4 pl-6">
                      <div className="flex justify-center">
                        {isNew ? (
                          <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" title="New message" />
                        ) : (
                          <span title="Read">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs ${isNew ? "font-bold text-charcoal" : "text-gray-700"}`}>{inq.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{inq.companyName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-semibold text-gray-600">{inq.country}</span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 ${inq.type === "product" ? "bg-maroon/5 text-maroon border border-maroon/10" : "bg-gold/10 text-gold-dark border border-gold/25"}`}>
                        {inq.type === "product" ? inq.productName : "General Inquiry"}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 shrink-0 text-gray-400" /> 
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleOpenInquiry(inq)}
                          className="rounded-none border-gray-200 h-8 w-8 text-charcoal hover:bg-gray-100"
                          title="Open Message"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={(e) => handleDelete(inq, e)}
                          className="rounded-none border-red-100 h-8 w-8 text-red-600 hover:bg-red-50"
                          title="Delete Record"
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

      {/* dialog view detail Modal */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        {selectedInquiry && (
          <DialogContent className="sm:max-w-xl w-full rounded-none border-gray-200 shadow-2xl">
            <DialogHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 border ${
                  selectedInquiry.type === "product" 
                    ? "bg-maroon/5 text-maroon border-maroon/10" 
                    : "bg-gold/10 text-gold-dark border-gold/25"
                }`}>
                  {selectedInquiry.type === "product" ? "Product Specific Quote" : "General Exporter Inquiry"}
                </span>
                {selectedInquiry.productSlug && (
                  <Link href={`/products/${selectedInquiry.productSlug}`} target="_blank" className="text-[10px] font-bold text-gray-400 hover:text-maroon flex items-center gap-0.5 hover:underline">
                    View Product Page
                  </Link>
                )}
              </div>
              <DialogTitle className="text-xl font-bold font-heading text-maroon">
                Inquiry from {selectedInquiry.name}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-gray-400">
                Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              {/* Buyer Contact details blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 border border-gray-200/60 text-xs">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-semibold">Buyer Name:</span>
                  <span className="font-bold text-gray-700">{selectedInquiry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-semibold">Company:</span>
                  <span className="font-bold text-gray-700">{selectedInquiry.companyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-semibold">Phone:</span>
                  <span className="font-bold text-gray-700">{selectedInquiry.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-semibold">Email:</span>
                  <a href={`mailto:${selectedInquiry.email}`} className="font-bold text-maroon hover:underline">{selectedInquiry.email}</a>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-gray-500 font-semibold">Discharge Country:</span>
                  <span className="font-bold text-gray-700">{selectedInquiry.country}</span>
                </div>
              </div>

              {/* Message block */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Specifications & message</span>
                <div className="bg-white border border-gray-200 p-5 text-sm leading-relaxed text-gray-700 whitespace-pre-line min-h-[120px]">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <DialogFooter className="border-t border-gray-100 pt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => handleDelete(selectedInquiry, e)}
                className="rounded-none border-red-100 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider h-11"
              >
                Delete Message
              </Button>
              <Button
                type="button"
                onClick={() => setViewDialogOpen(false)}
                className="bg-maroon hover:bg-maroon-dark text-white rounded-none uppercase font-semibold text-xs tracking-wider h-11 px-6 shadow-md"
              >
                Close View
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
