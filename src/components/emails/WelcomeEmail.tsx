import * as React from "react";

interface WelcomeEmailProps {
  firstName: string | null;
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

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  firstName,
}) => (
  <div style={main}>
    <div style={container}>
      <div style={box}>
        <h1 style={h1}>Welkom bij SM Movement</h1>
        <p style={p}>Beste {firstName || "klant"},</p>
        <p style={p}>
          Bedankt voor uw registratie! Uw account is succesvol aangemaakt.
        </p>
        <p style={p}>
          U kunt nu inloggen op onze website om uw gegevens te beheren, afspraken in te zien en offertes te bekijken.
        </p>
        <hr style={hr} />
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