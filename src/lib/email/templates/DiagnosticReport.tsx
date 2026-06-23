import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Hr,
  Button,
  Preview,
} from "@react-email/components";
import { DiagnosticResult } from "@/types";
import { DIMENSION_META } from "@/lib/scoring";

interface DiagnosticReportEmailProps {
  name: string;
  companyName: string;
  results: DiagnosticResult;
  calendlyLink: string;
}

export function DiagnosticReportEmail({
  name,
  companyName,
  results,
  calendlyLink,
}: DiagnosticReportEmailProps) {
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const secondaryMeta = DIMENSION_META[results.secondaryConstraint];
  const firstName = name.split(" ")[0];
  const severityColors: Record<string, string> = {
    Critical: "#E11D48",
    Developing: "#D97706",
    Progressing: "#10B981",
  };
  const severityColor = severityColors[results.severityLabel] || "#D97706";

  return (
    <Html>
      <Head />
      <Preview>{`Your Business Health Score: ${results.healthScore}% (${results.severityLabel}) — Primary Constraint: ${results.primaryConstraintLabel}`}</Preview>
      <Body
        style={{ backgroundColor: "#FFFFFF", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Text
            style={{
              color: "#C8A24A",
              fontSize: "11px",
              fontWeight: "bold",
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: "0 0 8px",
            }}
          >
            MUHAMMED AJMAL CONSULTING
          </Text>
          <Heading
            style={{ color: "#0B2545", fontSize: "24px", margin: "0 0 4px" }}
          >
            {firstName}, here is your business constraint diagnosis.
          </Heading>
          <Text
            style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 24px" }}
          >
            Prepared for {companyName} · Strategic Growth Architecture™
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 24px" }} />

          <Section
            style={{
              backgroundColor: "#0B2545",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{
                color: "#C8A24A",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "3px",
                margin: "0 0 8px",
              }}
            >
              BUSINESS HEALTH SCORE
            </Text>
            <Heading
              style={{
                color: "#ffffff",
                fontSize: "52px",
                margin: "0",
                lineHeight: "1",
              }}
            >
              {results.healthScore}%
            </Heading>
            <Text
              style={{
                color: severityColor,
                fontSize: "16px",
                fontWeight: "bold",
                margin: "4px 0 0",
              }}
            >
              {results.severityLabel}
            </Text>
            <Text
              style={{ color: "#94a3b8", fontSize: "11px", margin: "8px 0 0" }}
            >
              Critical: 0–39% · Developing: 40–69% · Progressing: 70–100%
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#0B2545",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{
                color: "#93c5fd",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "2px",
                margin: "0 0 8px",
              }}
            >
              PRIMARY GROWTH CONSTRAINT
            </Text>
            <Heading
              style={{ color: "#ffffff", fontSize: "24px", margin: "0 0 12px" }}
            >
              {results.primaryConstraintLabel}
            </Heading>
            <Text
              style={{
                color: "#bfdbfe",
                fontSize: "14px",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {primaryMeta.constraintExplanation}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                color: "#94a3b8",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "2px",
                margin: "0 0 8px",
              }}
            >
              SECONDARY CONSTRAINT
            </Text>
            <Text
              style={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: "bold",
                margin: "0 0 8px",
              }}
            >
              {results.secondaryConstraintLabel}
            </Text>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {secondaryMeta.secondaryExplanation}
            </Text>
          </Section>

          <Text
            style={{
              color: "#374151",
              fontSize: "14px",
              fontStyle: "italic",
              lineHeight: "1.7",
            }}
          >
            "{primaryMeta.impactStatement}"
          </Text>
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          <Heading
            style={{ color: "#0B2545", fontSize: "18px", margin: "0 0 16px" }}
          >
            Scores Across All 5 Dimensions
          </Heading>
          {results.dimensions.map((dim) => (
            <Section key={dim.key} style={{ marginBottom: "10px" }}>
              <Text
                style={{
                  margin: "0 0 4px",
                  fontWeight: "bold",
                  color: "#374151",
                  fontSize: "13px",
                }}
              >
                {dim.label}: {dim.score}/6 ({dim.percentage}%)
                {dim.key === results.primaryConstraint &&
                  " ← Primary Constraint"}
                {dim.key === results.secondaryConstraint &&
                  " ← Secondary Constraint"}
              </Text>
            </Section>
          ))}
          <Hr style={{ borderColor: "#e5e7eb", margin: "24px 0" }} />

          {results.aiPlan && (
            <>
              <Section
                style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "16px",
                }}
              >
                <Text
                  style={{
                    color: "#10B981",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    margin: "0 0 8px",
                  }}
                >
                  AI-GENERATED: YOUR 30-DAY PRIORITY PLAN
                </Text>
                <Heading
                  style={{
                    color: "#0B2545",
                    fontSize: "16px",
                    margin: "0 0 12px",
                  }}
                >
                  Your First 30 Days
                </Heading>
                {results.aiPlan.thirtyDayPriorities.map((p, i) => (
                  <Text
                    key={i}
                    style={{
                      color: "#1f2937",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      margin: "0 0 8px",
                    }}
                  >
                    {i + 1}. {p}
                  </Text>
                ))}
              </Section>
              <Section
                style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <Text
                  style={{
                    color: "#2563EB",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    margin: "0 0 8px",
                  }}
                >
                  AI-GENERATED: 90-DAY DIRECTION
                </Text>
                <Heading
                  style={{
                    color: "#0B2545",
                    fontSize: "16px",
                    margin: "0 0 12px",
                  }}
                >
                  Days 31–90
                </Heading>
                {results.aiPlan.ninetyDayDirections.map((d, i) => (
                  <Text
                    key={i}
                    style={{
                      color: "#1f2937",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      margin: "0 0 8px",
                    }}
                  >
                    {i + 1}. {d}
                  </Text>
                ))}
              </Section>
            </>
          )}

          <Section
            style={{
              backgroundColor: "#fef3c7",
              border: "1px solid #fde68a",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                color: "#92400e",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              <strong>An important distinction:</strong> This diagnostic
              identifies your constraint category — not the root cause within
              it. Understanding exactly why this constraint exists in your
              specific business is what the paid diagnostic is designed to
              uncover.
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Button
              href={calendlyLink}
              style={{
                backgroundColor: "#0B2545",
                color: "#ffffff",
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "bold",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Book Your Free 30-Minute Consultation →
            </Button>
            <Text
              style={{ color: "#9ca3af", fontSize: "12px", marginTop: "12px" }}
            >
              With Muhammed Ajmal personally. No pitch. Just clarity.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#e5e7eb", margin: "0 0 16px" }} />
          <Text
            style={{ color: "#9ca3af", fontSize: "11px", textAlign: "center" }}
          >
            Muhammed Ajmal Consulting · Dubai, UAE · Strategic Growth
            Architecture™
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
