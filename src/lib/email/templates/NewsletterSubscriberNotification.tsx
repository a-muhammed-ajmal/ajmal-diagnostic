import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Preview,
} from "@react-email/components";

/**
 * Internal notification, sent only when a genuinely new address is inserted.
 * A reactivated or resubmitted address raises nothing — the point is to signal
 * list growth, not form activity. No subscriber count is included.
 */

export interface NewsletterSubscriberNotificationEmailProps {
  email: string;
  /** Already formatted in US date order (WEB §"US English spelling and date order"). */
  subscribedOn: string;
}

export function NewsletterSubscriberNotificationEmail({
  email,
  subscribedOn,
}: NewsletterSubscriberNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{`${email} subscribed on ${subscribedOn}.`}</Preview>
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
            New newsletter subscriber
          </Heading>
          <Text style={{ color: "#000033", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>
            {`${email} subscribed on ${subscribedOn}.`}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
