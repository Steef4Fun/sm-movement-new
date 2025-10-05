import * as React from "react";

interface AppointmentConfirmationEmailProps {
  firstName: string | null;
  serviceType: string;
  requestedDate: string;
  notes: string | null;
  isGuest: boolean;
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

export const AppointmentConfirmationEmail: React.FC<AppointmentConfirmationEmailProps> = ({
  firstName,
  serviceType,
  requestedDate,
  notes,
  isGuest,
}) => (
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
          <strong>Datum & Tijd:</strong>{" "}
          {new Date(requestedDate).toLocaleString("nl-NL", {
            dateStyle: "full",
            timeStyle: "short",
          })}
          <br />
          <strong>Opmerkingen:</strong> {notes || "Geen"}
        </p>
        <hr style={hr} />
        {isGuest && (
          <>
            <p style={p}>
              Er is automatisch een account voor u aangemaakt. Om uw afspraak te
              beheren, kunt u het registratieproces voltooien met dit
              e-mailadres.
            </p>
            <p style={p}>
              Ga naar onze website en klik op 'Registreren' om een wachtwoord in
              te stellen.
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