import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Create transporter using Gmail
    // Note: You'll need to set up environment variables for production
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "infomnt01@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "", // App password needed
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER || "infomnt01@gmail.com",
      to: "infomnt01@gmail.com",
      replyTo: email,
      subject: `New Contact Form Message: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #374151;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #374151;">Email:</strong> <a href="mailto:${email}" style="color: #3b82f6;">${email}</a></p>
            <p style="margin: 10px 0;"><strong style="color: #374151;">Phone:</strong> ${phone}</p>
            <p style="margin: 10px 0;"><strong style="color: #374151;">Subject:</strong> ${subject}</p>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #374151;">Message:</h3>
            <div style="background-color: #ffffff; padding: 15px; border-left: 4px solid #3b82f6; border-radius: 4px;">
              ${message.replace(/\n/g, "<br>")}
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This email was sent from the Jobstm contact form
          </p>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}

Message:
${message}

---
This email was sent from the Jobstm contact form
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        error: "Failed to send email. Please try again later or contact us directly at infomnt01@gmail.com",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
