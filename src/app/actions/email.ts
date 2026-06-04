"use server";

import nodemailer from "nodemailer";
import { Inquiry } from "@/types";

export async function sendInquiryEmail(inquiry: Omit<Inquiry, "id">): Promise<{ success: boolean; error?: string }> {
  try {
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "465");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const emailTo = process.env.EMAIL_TO || "rpfoodspowder@gmail.com";

    // If SMTP details are not configured, log it and return success (dry run fallback)
    if (!smtpUser || !smtpPass) {
      console.warn("SMTP user or password not configured in environment variables. Email notification was skipped, but inquiry is saved in Firestore.");
      return { success: true };
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const isProduct = inquiry.type === "product";
    const subject = isProduct 
      ? `[Product Inquiry] New Quote Request: ${inquiry.productName} - from ${inquiry.name}`
      : `[General Inquiry] New Message from ${inquiry.name}`;

    const textContent = `
New Inquiry Received for RP Foods International

Buyer Name: ${inquiry.name}
Company Name: ${inquiry.companyName}
Email: ${inquiry.email}
Phone: ${inquiry.phone}
Discharge Country: ${inquiry.country}
Inquiry Type: ${isProduct ? `Product Specific (${inquiry.productName})` : "General Exporter Inquiry"}
Received On: ${new Date(inquiry.createdAt).toLocaleString()}

Message Specifications:
---------------------------------------------
${inquiry.message}
---------------------------------------------

Manage this inquiry directly from your admin panel at:
http://localhost:3000/admin
    `;

    const htmlContent = `
      <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #6B0F1A; padding: 20px; text-align: center; color: #ffffff;">
          <h2 style="margin: 0; font-family: 'Playfair Display', serif; letter-spacing: 1px;">RP Foods International</h2>
          <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #D4AF37;">Global Export Notification</p>
        </div>
        
        <!-- Content Body -->
        <div style="padding: 24px; color: #1c1c1c; font-size: 14px; line-height: 1.6;">
          <h3 style="margin-top: 0; color: #6B0F1A; border-b: 1px solid #e2e8f0; padding-bottom: 8px;">New Bulk Inquiry Received</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px; color: #666666;">Buyer Name:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #1c1c1c;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666666;">Company Name:</td>
              <td style="padding: 6px 0; color: #1c1c1c;">${inquiry.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666666;">Email Address:</td>
              <td style="padding: 6px 0;"><a href="mailto:${inquiry.email}" style="color: #6B0F1A; text-decoration: none; font-weight: bold;">${inquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666666;">Phone Number:</td>
              <td style="padding: 6px 0; color: #1c1c1c;">${inquiry.phone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666666;">Target Country:</td>
              <td style="padding: 6px 0; color: #1c1c1c; font-weight: bold;">${inquiry.country}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold; color: #666666;">Inquiry Type:</td>
              <td style="padding: 6px 0;">
                <span style="background-color: ${isProduct ? "#6B0F1A" : "#D4AF37"}; color: #ffffff; padding: 2px 8px; font-size: 11px; text-transform: uppercase; font-weight: bold;">
                  ${isProduct ? inquiry.productName : "General Inquiry"}
                </span>
              </td>
            </tr>
          </table>

          <div style="background-color: #f8f8f8; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <strong style="display: block; font-size: 11px; text-transform: uppercase; color: #666666; margin-bottom: 5px;">Message & Specifications:</strong>
            <p style="margin: 0; white-space: pre-wrap; font-size: 13px; color: #333333;">${inquiry.message}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/admin" style="background-color: #6B0F1A; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
              Open Admin Dashboard
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f8f8; border-top: 1px solid #e2e8f0; padding: 15px; text-align: center; font-size: 10px; color: #999999;">
          <p style="margin: 0;">This is an automated notification from RP Foods International Export Portal.</p>
          <p style="margin: 5px 0 0 0;">Developed by Actionhood AI</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"RP Foods Export Portal" <${smtpUser}>`,
      to: emailTo,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(`Inquiry email notification successfully sent to ${emailTo}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error sending inquiry email notification:", error);
    return { success: false, error: error.message || "Failed to send email notification." };
  }
}
