"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import { AppointmentConfirmationEmail } from "@/components/emails/AppointmentConfirmationEmail";
import { QuoteConfirmationEmail } from "@/components/emails/QuoteConfirmationEmail";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = "SM Movement <noreply@sm-movement.nl>";

interface AppointmentEmailProps {
  email: string;
  firstName: string | null;
  serviceType: string;
  requestedDate: string;
  notes: string | null;
  isGuest: boolean;
}

interface QuoteEmailProps {
  email: string;
  firstName: string | null;
  subject: string;
  amount: number;
  description: string | null;
  isGuest: boolean;
}

interface WelcomeEmailProps {
  email: string;
  firstName: string | null;
}

export const sendAppointmentConfirmation = async (params: AppointmentEmailProps) => {
  try {
    const html = await render(AppointmentConfirmationEmail(params));
    await resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: "Uw afspraak is ingepland!",
      html,
    });
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
    // We don't re-throw here to avoid the main operation failing if email fails
  }
};

export const sendQuoteConfirmation = async (params: QuoteEmailProps) => {
  try {
    const html = await render(QuoteConfirmationEmail(params));
    await resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: "Uw nieuwe offerte van SM Movement",
      html,
    });
  } catch (error) {
    console.error("Failed to send quote confirmation email:", error);
  }
};

export const sendWelcomeEmail = async (params: WelcomeEmailProps) => {
  try {
    const html = await render(WelcomeEmail(params));
    await resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: "Welkom bij SM Movement!",
      html,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};