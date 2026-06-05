import {
  Html, Head, Body, Container, Heading, Text,
  Section, Hr, Button, Preview
} from '@react-email/components';
import { DiagnosticResult } from '@/types';
import { DIMENSION_META } from '@/lib/scoring';

interface DiagnosticReportEmailProps {
  name: string;
  companyName: string;
  results: DiagnosticResult;
  calendlyLink: string;
}

export function DiagnosticReportEmail({
  name, companyName, results, calendlyLink
}: DiagnosticReportEmailProps) {
  const primaryMeta = DIMENSION_META[results.primaryConstraint];
  const firstName = name.split(' ')[0];

  return (
    <Html>
      <Head />
      <Preview>Your Primary Growth Constraint: {results.primaryConstraintLabel}</Preview>
      <Body style={{ backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>

          <Heading style={{ color: '#1e3a5f', fontSize: '24px', marginBottom: '8px' }}>
            {firstName}, here is your business constraint diagnosis.
          </Heading>
          <Text style={{ color: '#6b7280', fontSize: '16px' }}>
            Prepared for {companyName} · Muhammed Ajmal Consulting
          </Text>

          <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />

          <Section style={{ backgroundColor: '#1e3a5f', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
            <Text style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 8px' }}>
              PRIMARY GROWTH CONSTRAINT IDENTIFIED
            </Text>
            <Heading style={{ color: '#ffffff', fontSize: '28px', margin: '0 0 12px' }}>
              {results.primaryConstraintLabel}
            </Heading>
            <Text style={{ color: '#bfdbfe', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
              {primaryMeta.constraintExplanation}
            </Text>
          </Section>

          <Text style={{ color: '#374151', fontSize: '15px', fontStyle: 'italic', lineHeight: '1.6' }}>
            "{primaryMeta.impactStatement}"
          </Text>

          <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />

          <Heading style={{ color: '#1f2937', fontSize: '18px' }}>Your Scores Across All 5 Dimensions</Heading>
          {results.dimensions.map(dim => (
            <Section key={dim.key} style={{ marginBottom: '12px' }}>
              <Text style={{ margin: '0 0 4px', fontWeight: 'bold', color: '#374151' }}>
                {dim.label}: {dim.score}/6 ({dim.percentage}%)
              </Text>
              <div style={{ backgroundColor: '#e5e7eb', borderRadius: '4px', height: '8px' }}>
                <div style={{ backgroundColor: dim.color, width: `${dim.percentage}%`, height: '8px', borderRadius: '4px' }} />
              </div>
            </Section>
          ))}

          <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />

          <Heading style={{ color: '#1f2937', fontSize: '18px' }}>3 Prioritised Directions for {results.primaryConstraintLabel}</Heading>
          {primaryMeta.actionDirections.map((direction, i) => (
            <Text key={i} style={{ color: '#374151', fontSize: '15px', lineHeight: '1.6' }}>
              {i + 1}. {direction}
            </Text>
          ))}

          <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />

          <Section style={{ backgroundColor: '#fef3c7', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <Text style={{ color: '#92400e', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              <strong>Important:</strong> This tool has identified your constraint category — not the root cause within it. Understanding exactly why this constraint exists in your business is what the paid diagnostic is designed to uncover. That distinction matters.
            </Text>
          </Section>

          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Button
              href={calendlyLink}
              style={{
                backgroundColor: '#1e3a5f', color: '#ffffff',
                padding: '16px 32px', borderRadius: '8px',
                fontSize: '16px', fontWeight: 'bold', textDecoration: 'none'
              }}
            >
              Book Your Free 30-Minute Consultation →
            </Button>
            <Text style={{ color: '#9ca3af', fontSize: '13px', marginTop: '12px' }}>
              Walk through your findings with Muhammed Ajmal personally. No pitch. Just clarity.
            </Text>
          </Section>

          <Hr style={{ margin: '24px 0', borderColor: '#e5e7eb' }} />
          <Text style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center' }}>
            Muhammed Ajmal Consulting · Dubai, UAE · Strategic Management | Operational Excellence | AI-Driven Systems
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
