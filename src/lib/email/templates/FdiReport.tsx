import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Hr,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import type { FounderFdiReport } from '@/lib/fdi/public-report';

interface FdiReportEmailProps {
  readonly name: string;
  readonly companyName: string;
  readonly report: FounderFdiReport;
  readonly calendlyLink: string;
}

/** Deterministic FDI delivery. It deliberately contains no AI or qualification language. */
export function FdiReportEmail({ name, companyName, report, calendlyLink }: FdiReportEmailProps) {
  const firstName = name.split(' ')[0];
  const concentration = report.concentration.labels.join(' and ');
  const alerted = report.alerts.flatMap((tier) => tier.components.map((component) => component.label));

  return (
    <Html>
      <Head />
      <Preview>{report.index.presentation}</Preview>
      <Body style={{ backgroundColor: '#FFFFFF', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Text style={{ color: '#FF6535', fontSize: '11px', fontWeight: 'bold', letterSpacing: '3px', margin: '0 0 8px' }}>
            MUHAMMED AJMAL CONSULTING
          </Text>
          <Heading style={{ color: '#1A1A2E', fontSize: '24px', margin: '0 0 4px' }}>
            {firstName}, your Founder Dependency Index
          </Heading>
          <Text style={{ color: '#6B7280', fontSize: '14px', margin: '0 0 24px' }}>
            Prepared for {companyName}
          </Text>
          <Section style={{ backgroundColor: '#1A1A2E', borderRadius: '12px', padding: '24px', marginBottom: '16px' }}>
            <Text style={{ color: '#FF6535', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', margin: '0 0 8px' }}>
              FOUNDER DEPENDENCY INDEX
            </Text>
            <Heading style={{ color: '#FFFFFF', fontSize: '34px', margin: 0, lineHeight: '1.2' }}>
              {report.index.display} / {report.index.scaleMax}
            </Heading>
            <Text style={{ color: '#FF8159', fontSize: '16px', fontWeight: 'bold', margin: '8px 0 0' }}>
              {report.index.band.label}
            </Text>
          </Section>
          <Heading style={{ color: '#1A1A2E', fontSize: '18px', margin: '24px 0 12px' }}>
            Component scores
          </Heading>
          {report.components.map((component) => (
            <Text key={component.key} style={{ color: '#1A1A2E', fontSize: '14px', lineHeight: '1.6', margin: '4px 0' }}>
              <strong>{component.label}:</strong> {component.display} / 100
            </Text>
          ))}
          <Text style={{ color: '#1A1A2E', fontSize: '14px', lineHeight: '1.6', margin: '16px 0 0' }}>
            Dependency appears most concentrated in {concentration}.
          </Text>
          {alerted.length > 0 && (
            <Text style={{ color: '#D6450F', fontSize: '14px', lineHeight: '1.6', margin: '8px 0 0' }}>
              Severe component alert: {alerted.join(', ')}.
            </Text>
          )}
          <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0' }} />
          <Heading style={{ color: '#1A1A2E', fontSize: '18px', margin: '0 0 12px' }}>
            What the answers indicate
          </Heading>
          {report.observations.map((finding) => (
            <Text key={finding} style={{ color: '#1A1A2E', fontSize: '14px', lineHeight: '1.6', margin: '8px 0' }}>
              • {finding}
            </Text>
          ))}
          <Text style={{ color: '#6B7280', fontSize: '13px', fontStyle: 'italic', lineHeight: '1.6', margin: '24px 0' }}>
            {report.limitation}
          </Text>
          <Button href={calendlyLink} style={{ backgroundColor: '#FF6535', borderRadius: '8px', color: '#1A1A2E', fontSize: '14px', fontWeight: 'bold', padding: '12px 18px', textDecoration: 'none' }}>
            Discuss an Audit
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
