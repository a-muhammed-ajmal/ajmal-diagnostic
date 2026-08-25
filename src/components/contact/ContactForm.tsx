'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Label, Select, Textarea } from '@/components/ui/Field';
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
    <div className="bg-success-soft border border-success/30 rounded-2xl p-8 text-center">
      <div className="text-success text-[length:var(--step-4)] mb-3">✔</div>
      <h3 className="font-heading font-bold text-ink text-[length:var(--step-2)] mb-2">Enquiry Received</h3>
      <p className="font-body text-muted text-[length:var(--step-0)]">You will receive a response within 24 hours.</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input {...register('name')} id="name" invalid={Boolean(errors.name)} placeholder="First and last name" />
        {errors.name && <p role="alert" className="text-danger text-xs mt-1">Please enter your name</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Business Email</Label>
          <Input {...register('email')} id="email" type="email" invalid={Boolean(errors.email)} placeholder="you@company.com" />
          {errors.email && <p role="alert" className="text-danger text-xs mt-1">Valid email required</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input {...register('phone')} id="phone" type="tel" invalid={Boolean(errors.phone)} placeholder="+971 50 000 0000" />
          {errors.phone && <p role="alert" className="text-danger text-xs mt-1">Phone number required</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input {...register('companyName')} id="companyName" invalid={Boolean(errors.companyName)} placeholder="Your business name" />
        {errors.companyName && <p role="alert" className="text-danger text-xs mt-1">Company name required</p>}
      </div>
      <div>
        <Label htmlFor="inquiryType">Inquiry Type</Label>
        <Select {...register('inquiryType')} id="inquiryType" invalid={Boolean(errors.inquiryType)}>
          <option value="">Select...</option>
          <option value="diagnostic-followup">Follow-up on Diagnostic Results</option>
          <option value="strategic-planning">Strategic Planning</option>
          <option value="systems-development">Business Systems Development</option>
          <option value="process-optimization">Process Optimization</option>
          <option value="performance-management">Performance Management</option>
          <option value="ai-automation">AI &amp; Automation Advisory</option>
          <option value="general">General Enquiry</option>
        </Select>
        {errors.inquiryType && <p role="alert" className="text-danger text-xs mt-1">Please select an inquiry type</p>}
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea {...register('message')} id="message" rows={4} invalid={Boolean(errors.message)} placeholder="Brief description of your situation and what you are looking to address..." />
        {errors.message && <p role="alert" className="text-danger text-xs mt-1">Please provide a brief message (min 20 characters)</p>}
      </div>
      {error && <p role="alert" className="text-danger text-[length:var(--step-0)]">{error}</p>}
      <p className="text-xs text-muted font-body">
        By sending this enquiry you agree to our{' '}
        <a href="/privacy" className="text-brand-ink underline hover:text-brand-ink transition-colors">Privacy Policy</a>.
      </p>
      <Button type="submit" disabled={isSubmitting} fullWidth className="min-h-[52px]">
        {isSubmitting ? 'Sending...' : 'Send Enquiry →'}
      </Button>
    </form>
  );
}
