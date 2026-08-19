"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  companyName: z.string().min(2, "Please enter your company name"),
  phone: z.string().optional(),
  industry: z.string().optional(),
  teamSize: z.string().optional(),
  revenueRange: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  onSubmit: (data: LeadFormData) => void;
  isLoading: boolean;
}

export function LeadCaptureForm({ onSubmit, isLoading }: LeadCaptureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const inputClass =
    "w-full border border-line rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand bg-white text-ink placeholder-muted text-[length:var(--step-0)]";
  const labelClass = "block text-[length:var(--step-0)] font-heading font-semibold text-ink mb-1";

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-1 p-8 border border-line">
      <div className="text-center mb-6">
        <p className="text-brand-ink eyebrow mb-2">
          Diagnostic Complete
        </p>
        <h2 className="text-[length:var(--step-3)] font-heading font-bold text-ink mb-2">
          Your results are ready.
        </h2>
        <p className="text-muted font-body text-[length:var(--step-0)]">
          Enter your details to receive your personalized report and AI-assisted
          reflection plan.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="lead-name" className={labelClass}>Full Name</label>
          <input
            {...register("name")}
            id="lead-name"
            className={inputClass}
            placeholder="First and last name"
          />
          {errors.name && (
            <p role="alert" className="text-danger text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lead-email" className={labelClass}>Business Email</label>
          <input
            {...register("email")}
            id="lead-email"
            type="email"
            className={inputClass}
            placeholder="you@company.com"
          />
          {errors.email && (
            <p role="alert" className="text-danger text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lead-companyName" className={labelClass}>Company Name</label>
          <input
            {...register("companyName")}
            id="lead-companyName"
            className={inputClass}
            placeholder="Your business name"
          />
          {errors.companyName && (
            <p role="alert" className="text-danger text-xs mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            Phone Number{" "}
            <span className="text-muted font-normal text-xs">(optional)</span>
          </label>
          <input
            {...register("phone")}
            id="lead-phone"
            type="tel"
            className={inputClass}
            placeholder="+971 50 000 0000"
          />
        </div>

        <div>
          <label htmlFor="lead-industry" className={labelClass}>
            Industry{" "}
            <span className="text-muted font-normal text-xs">(optional)</span>
          </label>
          <select {...register("industry")}
            id="lead-industry" className={inputClass}>
            <option value="">Select industry...</option>
            <option value="retail-ecommerce">Retail & E-Commerce</option>
            <option value="professional-services">Professional Services</option>
            <option value="construction-real-estate">
              Construction & Real Estate
            </option>
            <option value="hospitality-fnb">Hospitality & F&B</option>
            <option value="healthcare">Healthcare</option>
            <option value="technology">Technology</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="trading">Trading & Distribution</option>
            <option value="education">Education</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="lead-teamSize" className={labelClass}>
            Team Size{" "}
            <span className="text-muted font-normal text-xs">(optional)</span>
          </label>
          <select {...register("teamSize")}
            id="lead-teamSize" className={inputClass}>
            <option value="">Select size...</option>
            <option value="1-5">1–5</option>
            <option value="6-15">6–15</option>
            <option value="16-50">16–50</option>
            <option value="51-200">51–200</option>
            <option value="200+">200+</option>
          </select>
        </div>

        <div>
          <label htmlFor="lead-revenueRange" className={labelClass}>
            Annual Revenue{" "}
            <span className="text-muted font-normal text-xs">(optional)</span>
          </label>
          <select {...register("revenueRange")}
            id="lead-revenueRange" className={inputClass}>
            <option value="">Select range...</option>
            <option value="under-1m">Under AED 1,000,000</option>
            <option value="1m-5m">AED 1,000,000 – 5,000,000</option>
            <option value="5m-10m">AED 5,000,000 – 10,000,000</option>
            <option value="over-10m">Over AED 10,000,000</option>
          </select>
        </div>

        <p className="text-xs text-muted text-center font-body">
          By continuing you agree to our{" "}
          <a href="/privacy" className="text-brand-ink underline hover:text-brand-ink transition-colors">Privacy Policy</a>.
          Your report is generated with AI.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand text-white font-heading font-bold py-4 rounded-xl transition-colors hover:bg-brand-hover disabled:opacity-50 min-h-[52px] shadow-1"
        >
          {isLoading ? "Generating your report..." : "View My Diagnosis →"}
        </button>

        <p className="text-xs text-muted text-center font-body">
          No spam. Your data is used only to personalize your report.
        </p>
      </form>
    </div>
  );
}
