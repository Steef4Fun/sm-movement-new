"use server";

import { Resend } from "resend";
import { render } from "@react-email/render";
import * as ics from 'ics';
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';
import { AppointmentConfirmationEmail } from "@/components/emails/AppointmentConfirmationEmail";
import { QuoteConfirmationEmail } from "@/components/emails/QuoteConfirmationEmail";
import { WelcomeEmail } from "@/components/emails/WelcomeEmail";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = "SM Movement <noreply@sm-movement.nl>";
const timeZone = 'Europe/Amsterdam';

interface AppointmentEmailProps {
  email: string;
  firstName: string | null;
  serviceType: string;
  requestedDate: string;
  notes: string | null;
  isGuest: boolean;
  activationToken: string | null;
}

interface QuoteEmailProps {
  email: string;
  firstName: string | null;
  subject: string;
  amount: number;
  description: string | null;
  isGuest: boolean;
  activationToken: string | null;
}

interface WelcomeEmailProps {
  email: string;
  firstName: string | null;
}

export const sendAppointmentConfirmation = async (params: AppointmentEmailProps) => {
  try {
    const html = await render(AppointmentConfirmationEmail(params));

    // Create ICS file
    const zonedDate = utcToZonedTime(new Date(params.requestedDate), timeZone);
    const event: ics.EventAttributes = {
      start: [
        zonedDate.getFullYear(),
        zonedDate.getMonth() + 1,
        zonedDate.getDate(),
        zonedDate.getHours(),
        zonedDate.getMinutes(),
      ],
      duration: { hours: 1 },
      title: `Afspraak: ${params.serviceType}`,
      description: params.notes || `Afspraak voor ${params.serviceType}`,
      location: 'Woudmeer 16, Houten',
      status: 'CONFIRMED',
      organizer: { name: 'SM Movement', email: 'info@sm-movement.nl' },
      attendees: [{ name: params.firstName || 'Klant', email: params.email }],
    };

    const { error, value } = ics.createEvent(event);
    if (error) {
      throw error;
    }

    await resend.emails.send({
      from: fromEmail,
      to: params.email,
      subject: "Uw afspraak is ingepland!",
      html,
      attachments: [
        {
          filename: 'invite.ics',
          content: Buffer.from(value || '').toString('base64'),
        },
      ],
    });
  } catch (error) {
    console.error("Failed to send appointment confirmation email:", error);
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