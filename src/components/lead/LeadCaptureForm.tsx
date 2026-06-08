'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  companyName: z.string().min(2, 'Please enter your company name'),
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
  const { register, handleSubmit, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema)
  });

  const inputClass = "w-full border border-navy/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold bg-white text-navy placeholder-navy/40 text-base";
  const labelClass = "block text-sm font-heading font-semibold text-navy mb-1";

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-navy/5">
      <div className="text-center mb-6">
        <p className="text-gold font-heading font-bold tracking-widest text-xs uppercase mb-2">Diagnostic Complete</p>
        <h2 className="text-2xl font-heading font-bold text-navy mb-2">Your results are ready.</h2>
        <p className="text-navy/70 font-body text-sm">Enter your details to receive your personalised report and AI Growth Action Plan.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className={labelClass}>Full Name</label>
          <input {...register('name')} className={inputClass} placeholder="First and last name" />
          {errors.name && <p className="text-crimson text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Business Email</label>
          <input {...register('email')} type="email" className={inputClass} placeholder="you@company.com" />
          {errors.email && <p className="text-crimson text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Company Name</label>
          <input {...register('companyName')} className={inputClass} placeholder="Your business name" />
          {errors.companyName && <p className="text-crimson text-xs mt-1">{errors.companyName.message}</p>}
        </div>

        <div>
          <label className={labelClass}>
            Phone Number <span className="text-navy/30 font-normal text-xs">(optional)</span>
          </label>
          <input {...register('phone')} type="tel" className={inputClass} placeholder="+971 50 000 0000" />
        </div>

        <div>
          <label className={labelClass}>
            Annual Revenue <span className="text-navy/30 font-normal text-xs">(optional)</span>
          </label>
          <select {...register('revenueRange')} className={inputClass}>
            <option value="">Select range...</option>
            <option value="under-500k">Under AED 500K</option>
            <option value="500k-2m">AED 500K – 2M</option>
            <option value="2m-5m">AED 2M – 5M</option>
            <option value="5m-15m">AED 5M – 15M</option>
            <option value="over-15m">Over AED 15M</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gold text-navy font-heading font-bold py-4 rounded-xl transition-colors hover:bg-gold-bright disabled:opacity-50 min-h-[52px] shadow-lg"
        >
          {isLoading ? 'Generating your report...' : 'View My Diagnosis →'}
        </button>

        <p className="text-xs text-navy/40 text-center font-body">
          No spam. Your data is used only to personalise your report.
        </p>

      </form>
    </div>
  );
}
