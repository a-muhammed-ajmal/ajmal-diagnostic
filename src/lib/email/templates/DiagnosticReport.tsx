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
    Critical: "#C0281D",
    Developing: "#B45309",
    Progressing: "#0B6B43",
  };
  const severityColor = severityColors[results.severityLabel] || "#B45309";

  return (
    <Html>
      <Head />
      <Preview>{`Your diagnostic score: ${results.healthScore}% (${results.severityLabel}) — lowest-scoring area: ${results.primaryConstraintLabel}`}</Preview>
      <Body
        style={{ backgroundColor: "#FFFFFF", fontFamily: "Arial, sans-serif" }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 20px" }}
        >
          <Text
            style={{
              color: "#0037A5",
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
            style={{ color: "#0F172A", fontSize: "24px", margin: "0 0 4px" }}
          >
            {firstName}, here is your diagnostic result.
          </Heading>
          <Text
            style={{ color: "#475569", fontSize: "14px", margin: "0 0 24px" }}
          >
            Prepared for {companyName} · Muhammed Ajmal Consulting
          </Text>
          <Hr style={{ borderColor: "#E2E8F0", margin: "0 0 24px" }} />

          <Section
            style={{
              backgroundColor: "#E6F0FF",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{
                color: "#0037A5",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "3px",
                margin: "0 0 8px",
              }}
            >
              DIAGNOSTIC SCORE
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
              style={{ color: "#475569", fontSize: "11px", margin: "8px 0 0" }}
            >
              Critical: 0–39% · Developing: 40–69% · Progressing: 70–100%
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#E6F0FF",
              borderRadius: "12px",
              padding: "24px",
              marginBottom: "16px",
            }}
          >
            <Text
              style={{
                color: "#0037A5",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "2px",
                margin: "0 0 8px",
              }}
            >
              LOWEST-SCORING AREA
            </Text>
            <Heading
              style={{ color: "#ffffff", fontSize: "24px", margin: "0 0 12px" }}
            >
              {results.primaryConstraintLabel}
            </Heading>
            <Text
              style={{
                color: "#475569",
                fontSize: "14px",
                lineHeight: "1.7",
                margin: 0,
              }}
            >
              {primaryMeta.description}
            </Text>
          </Section>

          <Section
            style={{
              backgroundColor: "#E6F0FF",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                color: "#0037A5",
                fontSize: "10px",
                fontWeight: "bold",
                letterSpacing: "2px",
                margin: "0 0 8px",
              }}
            >
              NEXT LOWEST-SCORING AREA
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
                color: "#475569",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              {secondaryMeta.description}
            </Text>
          </Section>

          <Text
            style={{
              color: "#0F172A",
              fontSize: "14px",
              fontStyle: "italic",
              lineHeight: "1.7",
            }}
          >
            This score compares self-reported answers across five operating areas. It can highlight patterns for further review, but it does not establish root cause.
          </Text>
          <Hr style={{ borderColor: "#E2E8F0", margin: "24px 0" }} />

          <Heading
            style={{ color: "#0F172A", fontSize: "18px", margin: "0 0 16px" }}
          >
            Scores Across All 5 Dimensions
          </Heading>
          {results.dimensions.map((dim) => (
            <Section key={dim.key} style={{ marginBottom: "10px" }}>
              <Text
                style={{
                  margin: "0 0 4px",
                  fontWeight: "bold",
                  color: "#0F172A",
                  fontSize: "13px",
                }}
              >
                {dim.label}: {dim.score}/6 ({dim.percentage}%)
                {dim.key === results.primaryConstraint &&
                  " ← Lowest score"}
                {dim.key === results.secondaryConstraint &&
                  " ← Next score"}
              </Text>
            </Section>
          ))}
          <Hr style={{ borderColor: "#E2E8F0", margin: "24px 0" }} />

          {results.aiPlan && (
            <>
              <Section
                style={{
                  backgroundColor: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "16px",
                }}
              >
                <Text
                  style={{
                    color: "#0B6B43",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    margin: "0 0 8px",
                  }}
                >
                  AI-ASSISTED: YOUR 30-DAY REFLECTION PLAN
                </Text>
                <Heading
                  style={{
                    color: "#0F172A",
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
                      color: "#0F172A",
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
                  backgroundColor: "#EFF6FF",
                  border: "1px solid #DBEAFE",
                  borderRadius: "12px",
                  padding: "20px",
                  marginBottom: "24px",
                }}
              >
                <Text
                  style={{
                    color: "#0037A5",
                    fontSize: "10px",
                    fontWeight: "bold",
                    letterSpacing: "2px",
                    margin: "0 0 8px",
                  }}
                >
                  AI-ASSISTED: 90-DAY DIRECTION
                </Text>
                <Heading
                  style={{
                    color: "#0F172A",
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
                      color: "#0F172A",
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
              backgroundColor: "#FEF3C7",
              border: "1px solid #FDE68A",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "24px",
            }}
          >
            <Text
              style={{
                color: "#92400E",
                fontSize: "13px",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              <strong>An important distinction:</strong> This diagnostic
              reflects self-reported answers and does not establish root
              cause. An Audit is the evidence-led next step when you need to
              verify why a pattern exists and identify the binding constraint.
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginBottom: "32px" }}>
            <Button
              href={calendlyLink}
              style={{
                backgroundColor: "#0052FF",
                color: "#FFFFFF",
                padding: "16px 32px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "bold",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Discuss an Audit →
            </Button>
            <Text
              style={{ color: "#475569", fontSize: "12px", marginTop: "12px" }}
            >
              With Muhammed Ajmal personally. No pitch. Just clarity.
            </Text>
          </Section>

          <Hr style={{ borderColor: "#E2E8F0", margin: "0 0 16px" }} />
          <Text
            style={{ color: "#475569", fontSize: "11px", textAlign: "center" }}
          >
            Muhammed Ajmal Consulting · Dubai, United Arab Emirates · Strategic Growth
            Architecture
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
