'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  companyName: z.string().min(2),
  inquiryType: z.string().min(1),
  message: z.string().min(20),
});
type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const inputClass = "w-full border border-navy/20 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold bg-white text-navy text-base";
  const labelClass = "block text-sm font-heading font-semibold text-navy mb-1";

  const onSubmit = async (data: ContactFormData) => {
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setSubmitted(true);
      else setError('Something went wrong. Please try again.');
    } catch { setError('Something went wrong. Please try again.'); }
  };

  if (submitted) return (
    <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-8 text-center">
      <div className="text-emerald-ink text-3xl mb-3">✔</div>
      <h3 className="font-heading font-bold text-navy text-xl mb-2">Enquiry Received</h3>
      <p className="font-body text-navy/70 text-sm">You will receive a response within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>Full Name</label>
        <input {...register('name')} id="name" className={inputClass} placeholder="First and last name" />
        {errors.name && <p role="alert" className="text-crimson text-xs mt-1">Please enter your name</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className={labelClass}>Business Email</label>
          <input {...register('email')} id="email" type="email" className={inputClass} placeholder="you@company.com" />
          {errors.email && <p role="alert" className="text-crimson text-xs mt-1">Valid email required</p>}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Phone Number</label>
          <input {...register('phone')} id="phone" type="tel" className={inputClass} placeholder="+971 50 000 0000" />
          {errors.phone && <p role="alert" className="text-crimson text-xs mt-1">Phone number required</p>}
        </div>
      </div>
      <div>
        <label htmlFor="companyName" className={labelClass}>Company Name</label>
        <input {...register('companyName')} id="companyName" className={inputClass} placeholder="Your business name" />
        {errors.companyName && <p role="alert" className="text-crimson text-xs mt-1">Company name required</p>}
      </div>
      <div>
        <label htmlFor="inquiryType" className={labelClass}>Inquiry Type</label>
        <select {...register('inquiryType')} id="inquiryType" className={inputClass}>
          <option value="">Select...</option>
          <option value="diagnostic-followup">Follow-up on Diagnostic Results</option>
          <option value="strategic-planning">Strategic Planning</option>
          <option value="systems-development">Business Systems Development</option>
          <option value="process-optimization">Process Optimization</option>
          <option value="performance-management">Performance Management</option>
          <option value="ai-automation">AI &amp; Automation Advisory</option>
          <option value="general">General Enquiry</option>
        </select>
        {errors.inquiryType && <p role="alert" className="text-crimson text-xs mt-1">Please select an inquiry type</p>}
      </div>
      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea {...register('message')} id="message" rows={4} className={inputClass} placeholder="Brief description of your situation and what you are looking to address..." />
        {errors.message && <p role="alert" className="text-crimson text-xs mt-1">Please provide a brief message (min 20 characters)</p>}
      </div>
      {error && <p role="alert" className="text-crimson text-sm">{error}</p>}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-navy text-ivory font-heading font-bold py-4 rounded-xl hover:bg-navy/90 transition-colors disabled:opacity-50 min-h-[52px]"
      >
        {isSubmitting ? 'Sending...' : 'Send Enquiry →'}
      </button>
    </form>
  );
}
