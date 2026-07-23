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
    "w-full border border-navy/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold bg-white text-navy placeholder-navy/40 text-base";
  const labelClass = "block text-sm font-heading font-semibold text-navy mb-1";

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-navy/5">
      <div className="text-center mb-6">
        <p className="text-gold-ink eyebrow mb-2">
          Diagnostic Complete
        </p>
        <h2 className="text-2xl font-heading font-bold text-navy mb-2">
          Your results are ready.
        </h2>
        <p className="text-navy/70 font-body text-sm">
          Enter your details to receive your personalised report and AI Growth
          Action Plan.
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
            <p role="alert" className="text-crimson text-xs mt-1">{errors.name.message}</p>
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
            <p role="alert" className="text-crimson text-xs mt-1">{errors.email.message}</p>
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
            <p role="alert" className="text-crimson text-xs mt-1">
              {errors.companyName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            Phone Number{" "}
            <span className="text-navy/30 font-normal text-xs">(optional)</span>
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
            <span className="text-navy/30 font-normal text-xs">(optional)</span>
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
            <span className="text-navy/30 font-normal text-xs">(optional)</span>
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
            <span className="text-navy/30 font-normal text-xs">(optional)</span>
          </label>
          <select {...register("revenueRange")}
            id="lead-revenueRange" className={inputClass}>
            <option value="">Select range...</option>
            <option value="under-500k">Under AED 500K</option>
            <option value="500k-2m">AED 500K – 2M</option>
            <option value="2m-5m">AED 2M – 5M</option>
            <option value="5m-15m">AED 5M – 15M</option>
            <option value="over-15m">Over AED 15M</option>
          </select>
        </div>

        <p className="text-xs text-navy/50 text-center font-body">
          By continuing you agree to our{" "}
          <a href="/privacy" className="text-gold-ink underline hover:text-gold transition-colors">Privacy Policy</a>.
          Your report is generated with AI.
        </p>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gold text-navy font-heading font-bold py-4 rounded-xl transition-colors hover:bg-gold-bright disabled:opacity-50 min-h-[52px] shadow-lg"
        >
          {isLoading ? "Generating your report..." : "View My Diagnosis →"}
        </button>

        <p className="text-xs text-navy/40 text-center font-body">
          No spam. Your data is used only to personalise your report.
        </p>
      </form>
    </div>
  );
}
