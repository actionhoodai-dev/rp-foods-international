"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, Globe, Building, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveInquiry } from "@/lib/firebase/db";
import { sendInquiryEmail } from "@/app/actions/email";

// Inquiry Schema
const inquirySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  phone: z.string().min(6, { message: "Phone number is required." }),
  companyName: z.string().min(2, { message: "Company name is required." }),
  country: z.string().min(2, { message: "Please specify your target country." }),
  message: z.string().min(10, { message: "Message must specify packaging/quantity requirements." })
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface ProductInquiryFormProps {
  productName?: string;
  productSlug?: string;
}

export default function ProductInquiryForm({ productName, productSlug }: ProductInquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      companyName: "",
      country: "",
      message: productName 
        ? `Hello, we are interested in importing ${productName}. Please share your pricing terms (FOB/CIF), packaging standards, and MOQ options.` 
        : ""
    }
  });

  const onSubmit = async (data: InquiryFormValues) => {
    setIsSubmitting(true);
    try {
      const inquiryData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        companyName: data.companyName,
        country: data.country,
        message: data.message,
        type: productName ? ("product" as const) : ("general" as const),
        productSlug: productSlug || "",
        productName: productName || "",
        status: "new" as const,
        createdAt: new Date().toISOString()
      };

      await saveInquiry(inquiryData);

      // Send direct email notification to administrator desk
      try {
        await sendInquiryEmail(inquiryData);
      } catch (emailError) {
        console.error("Email send failed:", emailError);
      }

      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("Failed to submit inquiry. Please try again or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-maroon/5 border border-maroon/20 p-8 text-center flex flex-col items-center gap-4 text-charcoal">
        <CheckCircle2 className="h-12 w-12 text-maroon animate-bounce" />
        <h3 className="text-xl font-bold font-heading">Inquiry Received</h3>
        <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
          Thank you for connecting with RP Foods International. Our export coordinator will review your specifications and contact you with a official quote shortly.
        </p>
        <Button 
          onClick={() => setIsSuccess(false)}
          className="mt-4 bg-maroon text-white hover:bg-maroon-dark rounded-none uppercase text-xs font-bold tracking-wider px-6 py-4"
        >
          Submit Another Inquiry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-bg border border-gray-200 p-8 sm:p-10 flex flex-col gap-6">
      <div>
        <h3 className="text-xl font-bold font-heading text-maroon mb-1">
          {productName ? `Inquire About ${productName}` : "Bulk Export Inquiry"}
        </h3>
        <p className="text-xs text-gray-500 font-semibold leading-relaxed">
          Fill out this form to request specification certificates, quotation files, packaging catalog, or customized samples.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Input
              type="text"
              placeholder="Your Full Name"
              {...register("name")}
              className="rounded-none border-gray-300 focus-visible:ring-maroon bg-white text-sm"
            />
            {errors.name && <span className="text-[10px] font-bold text-red-600">{errors.name.message}</span>}
          </div>
          
          <div className="flex flex-col gap-1">
            <Input
              type="email"
              placeholder="Business Email Address"
              {...register("email")}
              className="rounded-none border-gray-300 focus-visible:ring-maroon bg-white text-sm"
            />
            {errors.email && <span className="text-[10px] font-bold text-red-600">{errors.email.message}</span>}
          </div>
        </div>

        {/* Phone & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="tel"
                placeholder="Phone Number (with Country Code)"
                {...register("phone")}
                className="pl-10 rounded-none border-gray-300 focus-visible:ring-maroon bg-white text-sm"
              />
            </div>
            {errors.phone && <span className="text-[10px] font-bold text-red-600">{errors.phone.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Company Name"
                {...register("companyName")}
                className="pl-10 rounded-none border-gray-300 focus-visible:ring-maroon bg-white text-sm"
              />
            </div>
            {errors.companyName && <span className="text-[10px] font-bold text-red-600">{errors.companyName.message}</span>}
          </div>
        </div>

        {/* Target Country */}
        <div className="flex flex-col gap-1">
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Target Export Country / Port of Discharge"
              {...register("country")}
              className="pl-10 rounded-none border-gray-300 focus-visible:ring-maroon bg-white text-sm"
            />
          </div>
          {errors.country && <span className="text-[10px] font-bold text-red-600">{errors.country.message}</span>}
        </div>

        {/* Inquiry Message */}
        <div className="flex flex-col gap-1">
          <Textarea
            placeholder="Describe your specifications, quantity (e.g. 5 Tons, Full Container), packaging choice, and shipping details..."
            rows={5}
            {...register("message")}
            className="rounded-none border-gray-300 focus-visible:ring-maroon bg-white text-sm"
          />
          {errors.message && <span className="text-[10px] font-bold text-red-600">{errors.message.message}</span>}
        </div>

        {/* Submit */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-maroon hover:bg-maroon-dark text-white rounded-none py-6 font-semibold uppercase tracking-wider text-xs shadow-lg mt-2 flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Submitting Inquiry..." : "Submit Export Request"} 
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}
