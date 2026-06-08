'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  companyName: z.string().min(2, 'Please enter your company name'),
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
    resolver: zodResolver(leadSchema),
  });

  const inputClass = "w-full border border-navy/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold bg-white text-navy placeholder-navy/40 text-base";
  const labelClass = "block text-sm font-heading font-semibold text-navy mb-1";

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-navy/5">
      <div className="text-center mb-6">
        <p className="text-gold font-heading font-bold tracking-widest text-xs uppercase mb-2">Diagnostic Complete</p>
        <h2 className="text-2xl font-heading font-bold text-navy mb-2">Your results are ready.</h2>
        <p className="text-navy/70 font-body text-sm">Enter your details to personalise your report and receive your AI Growth Action Plan.</p>
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
          <label className={labelClass}>Phone Number</label>
          <input {...register('phone')} type="tel" className={inputClass} placeholder="+971 50 000 0000" />
          {errors.phone && <p className="text-crimson text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Company Name</label>
          <input {...register('companyName')} className={inputClass} placeholder="Your business name" />
          {errors.companyName && <p className="text-crimson text-xs mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Industry <span className="font-normal text-navy/40">(optional)</span></label>
          <select {...register('industry')} className={inputClass}>
            <option value="">Select industry...</option>
            <option value="professional-services">Professional Services</option>
            <option value="food-beverage">Food &amp; Beverage</option>
            <option value="retail-ecommerce">Retail / E-Commerce</option>
            <option value="construction-real-estate">Construction / Real Estate</option>
            <option value="healthcare-wellness">Healthcare / Wellness</option>
            <option value="technology">Technology</option>
            <option value="trading-distribution">Trading / Distribution</option>
            <option value="education-training">Education / Training</option>
            <option value="marketing-media">Marketing / Media</option>
            <option value="other">Other</option>
          </select>
          {errors.industry && <p className="text-crimson text-xs mt-1">{errors.industry.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Team Size <span className="font-normal text-navy/40">(optional)</span></label>
          <select {...register('teamSize')} className={inputClass}>
            <option value="">Select team size...</option>
            <option value="solo">Solo / Just me</option>
            <option value="2-5">2–5 employees</option>
            <option value="6-15">6–15 employees</option>
            <option value="16-50">16–50 employees</option>
            <option value="51-plus">51+ employees</option>
          </select>
          {errors.teamSize && <p className="text-crimson text-xs mt-1">{errors.teamSize.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Annual Revenue (AED) <span className="font-normal text-navy/40">(optional)</span></label>
          <select {...register('revenueRange')} className={inputClass}>
            <option value="">Select range...</option>
            <option value="under-500k">Under AED 500K</option>
            <option value="500k-2m">AED 500K – 2M</option>
            <option value="2m-5m">AED 2M – 5M</option>
            <option value="5m-15m">AED 5M – 15M</option>
            <option value="over-15m">Over AED 15M</option>
          </select>
          {errors.revenueRange && <p className="text-crimson text-xs mt-1">{errors.revenueRange.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gold text-navy font-heading font-bold py-4 rounded-xl transition-colors hover:bg-gold-bright disabled:opacity-50 min-h-[52px] shadow-lg"
        >
          {isLoading ? 'Generating your AI Action Plan...' : 'View My Diagnosis & Action Plan →'}
        </button>
        <p className="text-xs text-navy/40 text-center font-body">No spam. Your data is used only to personalise your report.</p>
      </form>
    </div>
  );
}
