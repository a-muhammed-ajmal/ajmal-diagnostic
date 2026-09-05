import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Link,
  Preview,
} from "@react-email/components";

/**
 * Sent to the subscriber when an address is newly added, or when a previously
 * unsubscribed address is reactivated. Not sent when an already-active address
 * is resubmitted — anyone can type any address into the public form, and a
 * confirmation on every submit would let that form be used to mail a stranger.
 *
 * The unsubscribe link carries the row's random token, which the subscribe
 * route reads back after the write. /api/newsletter/unsubscribe already accepts
 * it as ?token=.
 */

export interface NewsletterConfirmationEmailProps {
  unsubscribeUrl: string;
}

const bodyText = {
  color: "#000033",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 16px",
};

export function NewsletterConfirmationEmail({
  unsubscribeUrl,
}: NewsletterConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Thanks for subscribing.</Preview>
      <Body style={{ backgroundColor: "#FFFFFF", fontFamily: "Arial, sans-serif" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}>
          <Text
            style={{
              color: "#003399",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            MUHAMMED AJMAL CONSULTING
          </Text>
          <Heading style={{ color: "#000033", fontSize: "22px", margin: "0 0 24px" }}>
            You are subscribed
          </Heading>

          <Text style={bodyText}>Thanks for subscribing.</Text>

          <Text style={bodyText}>
            You are now on the Muhammed Ajmal Consulting insights list.
          </Text>

          <Text style={bodyText}>
            I share practical notes on reducing founder dependency, strengthening
            operating systems, and keeping execution consistent when there is
            something useful to send.
          </Text>

          <Text style={bodyText}>
            You can unsubscribe at any time using the link below.
          </Text>

          <Hr style={{ borderColor: "#E2E8F0", margin: "24px 0 16px" }} />

          <Text style={{ ...bodyText, margin: "0 0 4px" }}>Muhammed Ajmal</Text>
          <Text style={{ ...bodyText, margin: "0 0 4px" }}>
            Business Operations &amp; Growth Consultant
          </Text>
          <Text style={{ ...bodyText, margin: "0 0 24px" }}>
            Dubai, United Arab Emirates
          </Text>

          <Hr style={{ borderColor: "#E2E8F0", margin: "0 0 16px" }} />
          <Text style={{ color: "#475569", fontSize: "11px", textAlign: "center", margin: 0 }}>
            <Link href={unsubscribeUrl} style={{ color: "#475569", textDecoration: "underline" }}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
