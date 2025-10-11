import * as React from "react";

interface QuoteConfirmationEmailProps {
  firstName: string | null;
  subject: string;
  amount: number;
  description: string | null;
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

export const QuoteConfirmationEmail: React.FC<QuoteConfirmationEmailProps> = ({
  firstName,
  subject,
  amount,
  description,
  isGuest,
  activationToken,
}) => (
  <div style={main}>
    <div style={container}>
      <div style={box}>
        <h1 style={h1}>Uw Offerte van SM Movement</h1>
        <p style={p}>Beste {firstName || "klant"},</p>
        <p style={p}>
          Hierbij ontvangt u de offerte zoals besproken:
        </p>
        <hr style={hr} />
        <p style={p}>
          <strong>Onderwerp:</strong> {subject}
          <br />
          <strong>Bedrag:</strong>{" "}
          {new Intl.NumberFormat("nl-NL", {
            style: "currency",
            currency: "EUR",
          }).format(amount)}
          <br />
          <strong>Omschrijving:</strong> {description || "Geen"}
        </p>
        <hr style={hr} />
        {isGuest && activationToken && (
          <>
            <p style={p}>
              Er is een account voor u aangemaakt. Klik op de onderstaande knop om uw account te activeren en deze offerte te beheren.
            </p>
            <a href={`${baseUrl}/activeer-account?token=${activationToken}`} style={button}>
              Account Activeren & Offerte Bekijken
            </a>
            <p style={{ ...p, fontSize: "12px", color: "#888" }}>
              Deze link is 24 uur geldig.
            </p>
          </>
        )}
        {!isGuest && (
          <p style={p}>
            U kunt deze offerte accepteren of weigeren in uw account op onze
            website.
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