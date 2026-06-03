"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Sprout, 
  FolderHeart, 
  MailOpen, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Clock 
} from "lucide-react";
import { 
  getCategories, 
  getProducts, 
  getInquiries, 
  getActivityLogs, 
  updateInquiryStatus 
} from "@/lib/firebase/db";
import { Category, Product, Inquiry, ActivityLog } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [cats, prods, inqs, activity] = await Promise.all([
        getCategories(),
        getProducts(),
        getInquiries(),
        getActivityLogs()
      ]);
      setCategories(cats);
      setProducts(prods);
      setInquiries(inqs);
      setLogs(activity);
    } catch (error) {
      console.error("Error loading dashboard metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateInquiryStatus(id, "read");
      // Refresh list
      const updatedInqs = await getInquiries();
      setInquiries(updatedInqs);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 w-full animate-pulse">
        <div className="h-10 bg-gray-200 w-1/4 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 border border-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div className="h-64 bg-gray-200 border border-gray-100" />
          <div className="h-64 bg-gray-200 border border-gray-100" />
        </div>
      </div>
    );
  }

  const newInquiries = inquiries.filter(i => i.status === "new");
  const recentInquiries = inquiries.slice(0, 5);
  const recentLogs = logs.slice(0, 5);

  const metrics = [
    { name: "Product Catalog", count: products.length, sub: "Total spices & blends", icon: Sprout, color: "text-maroon bg-maroon/5 border-maroon/10" },
    { name: "Categories", count: categories.length, sub: "Active export lines", icon: FolderHeart, color: "text-gold-dark bg-gold/5 border-gold/10" },
    { name: "New Inquiries", count: newInquiries.length, sub: "Requires prompt reply", icon: MailOpen, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { name: "Activity Logs", count: logs.length, sub: "Audit trails logged", icon: Activity, color: "text-green-600 bg-green-50 border-green-100" },
  ];

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-charcoal">Dashboard Summary</h1>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Real-time metrics, recent buyer inquiries, and administrative event auditing.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.name} className="rounded-none border-gray-200/80 shadow-sm relative overflow-hidden">
              <CardContent className="p-6 flex justify-between items-center">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{m.name}</span>
                  <span className="text-3xl font-extrabold text-charcoal leading-none my-1">{m.count}</span>
                  <span className="text-[10px] text-gray-500 font-medium">{m.sub}</span>
                </div>
                <div className={`p-3 border shrink-0 ${m.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Inquiries & Activity Logs (2 columns layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Inquiries Panel */}
        <Card className="rounded-none border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 py-4 px-6">
            <div className="flex flex-col gap-0.5">
              <CardTitle className="text-sm font-bold font-heading text-charcoal uppercase tracking-wider">Recent Inquiries</CardTitle>
            </div>
            <Link href="/admin/inquiries">
              <Button variant="link" className="text-maroon text-xs uppercase font-bold p-0 h-auto hover:no-underline">
                View Inbox <ArrowRight className="ml-1.5 h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentInquiries.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400 font-semibold">No inquiries received.</div>
            ) : (
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 pl-6">Buyer Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3">Product / Area</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-wider text-gray-400 py-3 text-right pr-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentInquiries.map((inq) => (
                    <TableRow key={inq.id} className="hover:bg-gray-50/30 border-b border-gray-100 last:border-none">
                      <TableCell className="py-4 pl-6">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-bold text-gray-700">{inq.name}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">{inq.companyName} ({inq.country})</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 ${inq.type === "product" ? "bg-maroon/5 text-maroon" : "bg-gold/10 text-gold-dark"}`}>
                          {inq.type === "product" ? inq.productName : "General"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 text-right pr-6">
                        {inq.status === "new" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(inq.id)}
                            className="rounded-none border-gray-200 text-maroon hover:bg-maroon hover:text-white text-[10px] font-bold uppercase tracking-wider h-7 px-3"
                          >
                            Mark Read
                          </Button>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-end gap-1.5 py-1">
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> Read
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Admin Activity Log */}
        <Card className="rounded-none border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 py-4 px-6">
            <CardTitle className="text-sm font-bold font-heading text-charcoal uppercase tracking-wider">Activity Logs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentLogs.length === 0 ? (
              <div className="text-center py-12 text-xs text-gray-400 font-semibold">No administrator activities logged.</div>
            ) : (
              <div className="flex flex-col">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex gap-4 p-4 pl-6 border-b border-gray-100 last:border-none hover:bg-gray-50/20">
                    <div className="p-2 bg-gray-100 rounded text-gray-500 shrink-0 h-fit">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col gap-1 flex-grow">
                      <p className="text-xs text-gray-700 leading-normal">
                        <strong className="text-charcoal font-bold">{log.adminEmail}</strong> {log.action}
                      </p>
                      <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
