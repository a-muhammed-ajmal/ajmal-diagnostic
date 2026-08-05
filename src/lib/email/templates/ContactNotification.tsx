import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Preview,
} from "@react-email/components";

/**
 * Internal notification for a new contact enquiry.
 *
 * Rendered as React rather than an HTML template literal: every value below is
 * attacker-controlled free text, and React escapes it on render. The previous version
 * interpolated these straight into an HTML string.
 */

export interface ContactNotificationEmailProps {
  name: string;
  email: string;
  phone: string;
  companyName: string;
  inquiryType: string;
  message: string;
}

const labelStyle = {
  color: "#6B7280",
  fontSize: "11px",
  fontWeight: "bold" as const,
  letterSpacing: "2px",
  textTransform: "uppercase" as const,
  margin: "0 0 2px",
};

const valueStyle = {
  color: "#1A1A2E",
  fontSize: "15px",
  margin: "0 0 16px",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Section>
      <Text style={labelStyle}>{label}</Text>
      <Text style={valueStyle}>{value}</Text>
    </Section>
  );
}

export function ContactNotificationEmail({
  name,
  email,
  phone,
  companyName,
  inquiryType,
  message,
}: ContactNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`New enquiry from ${name} at ${companyName}`}</Preview>
      <Body style={{ backgroundColor: "#FFFFFF", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          <Text
            style={{
              color: "#FF6535",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            MUHAMMED AJMAL CONSULTING
          </Text>
          <Heading style={{ color: "#1A1A2E", fontSize: "22px", margin: "0 0 4px" }}>
            New contact enquiry
          </Heading>
          <Text style={{ color: "#6B7280", fontSize: "14px", margin: "0 0 24px" }}>
            Submitted through the website contact form.
          </Text>
          <Hr style={{ borderColor: "#E5E7EB", margin: "0 0 24px" }} />

          <Field label="Name" value={name} />
          <Field label="Email" value={email} />
          <Field label="Phone" value={phone} />
          <Field label="Company" value={companyName} />
          <Field label="Enquiry type" value={inquiryType} />

          <Section
            style={{
              backgroundColor: "#F9FAFB",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "20px",
              marginTop: "8px",
            }}
          >
            <Text style={labelStyle}>Message</Text>
            <Text
              style={{
                color: "#1A1A2E",
                fontSize: "14px",
                lineHeight: "1.7",
                margin: 0,
                whiteSpace: "pre-wrap",
              }}
            >
              {message}
            </Text>
          </Section>

          <Hr style={{ borderColor: "#E5E7EB", margin: "24px 0 16px" }} />
          <Text style={{ color: "#6B7280", fontSize: "11px", textAlign: "center" }}>
            Muhammed Ajmal Consulting · Dubai, UAE · Strategic Growth Architecture
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
