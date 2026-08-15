describe("DiagnosticReportEmail", () => {
  it("resolves the renderer from the application dependency boundary", () => {
    // Resend dynamically loads this package while preparing a `react` email.
    // It must resolve from the app root, not only as a nested dependency of
    // @react-email/components.
    expect(require.resolve("@react-email/render")).toContain("@react-email");
  });
});
