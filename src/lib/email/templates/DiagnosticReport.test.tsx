import { renderToStaticMarkup } from "react-dom/server";
import { QUESTIONS } from "@/lib/questions";
import { calculateResults } from "@/lib/scoring";
import { DiagnosticReportEmail } from "./DiagnosticReport";

describe("DiagnosticReportEmail", () => {
  it("resolves the renderer from the application dependency boundary", () => {
    // Resend dynamically loads this package while preparing a `react` email.
    // It must resolve from the app root, not only as a nested dependency of
    // @react-email/components.
    expect(require.resolve("@react-email/render")).toContain("@react-email");
  });

  it("renders the approved Business Clarity Audit CTA and its Calendly link", () => {
    const answers: Record<number, string> = {};
    for (const question of QUESTIONS) answers[question.id] = question.options[0].id;
    const calendlyLink = "https://calendly.com/ajmalconsults/free-business-clarity-consultation";
    const whatsappLink = "https://wa.me/971501234567?text=Business%20Clarity%20Audit";
    const html = renderToStaticMarkup(
      DiagnosticReportEmail({
        name: "Ajmal Test",
        companyName: "Test Co",
        results: calculateResults(answers),
        calendlyLink,
        whatsappLink,
      }),
    );

    expect(html).toContain("Discuss a Business Clarity Audit");
    expect(html).toContain(calendlyLink);
    expect(html).toContain("Message on WhatsApp");
    expect(html).toContain(whatsappLink);
    expect(html).not.toContain("Discuss an Audit");
  });
});
