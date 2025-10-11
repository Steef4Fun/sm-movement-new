import * as React from "react";
import { formatInTimeZone } from 'date-fns-tz';

interface AppointmentConfirmationEmailProps {
  firstName: string | null;
  serviceType: string;
  requestedDate: string;
  notes: string | null;
  isGuest: boolean;
  activationToken: string | null;
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #f0f0f0",
  borderRadius: "4px",
};

const box = {
  padding: "0 48px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
};

const p = {
  color: "#555",
  fontSize: "16px",
  lineHeight: "24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const button = {
  backgroundColor: "#D6AF52",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const AppointmentConfirmationEmail: React.FC<AppointmentConfirmationEmailProps> = ({
  firstName,
  serviceType,
  requestedDate,
  notes,
  isGuest,
  activationToken,
}) => {
  const formattedDate = formatInTimeZone(
    new Date(requestedDate),
    'Europe/Amsterdam',
    "eeee d MMMM yyyy 'om' HH:mm 'uur'",
    { locale: require('date-fns/locale/nl') }
  );

  return (
    <div style={main}>
      <div style={container}>
        <div style={box}>
          <h1 style={h1}>Afspraak Bevestigd</h1>
          <p style={p}>Beste {firstName || "klant"},</p>
          <p style={p}>
            Bedankt voor uw aanvraag. Hierbij de bevestiging van uw afspraak:
          </p>
          <hr style={hr} />
          <p style={p}>
            <strong>Service:</strong> {serviceType}
            <br />
            <strong>Datum & Tijd:</strong> {formattedDate}
            <br />
            <strong>Opmerkingen:</strong> {notes || "Geen"}
          </p>
          <hr style={hr} />
          {isGuest && activationToken && (
            <>
              <p style={p}>
                Er is een account voor u aangemaakt. Klik op de onderstaande knop om uw account te activeren door uw gegevens in te vullen en een wachtwoord te kiezen.
              </p>
              <a href={`${baseUrl}/activeer-account?token=${activationToken}`} style={button}>
                Account Activeren
              </a>
              <p style={{ ...p, fontSize: "12px", color: "#888" }}>
                Deze link is 24 uur geldig.
              </p>
            </>
          )}
          {!isGuest && (
            <p style={p}>
              U kunt de details van deze afspraak en uw andere gegevens bekijken
              in uw account op onze website.
            </p>
          )}
          <p style={p}>Met vriendelijke groet,</p>
          <p style={p}>Het team van SM Movement</p>
        </div>
        <div style={box}>
          <hr style={hr} />
          <p style={footer}>
            SM Movement, Woudmeer 16, Houten
          </p>
        </div>
      </div>
    </div>
  );
};