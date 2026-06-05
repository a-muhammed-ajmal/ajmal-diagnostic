'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  companyName: z.string().min(2, 'Please enter your company name'),
  revenueRange: z.string().min(1, 'Please select a revenue range'),
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

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your results are ready.</h2>
        <p className="text-gray-600">
          So we can personalise your report to your business context, we need a few details.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            {...register('name')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="First and last name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
          <input
            {...register('email')}
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@company.com"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <input
            {...register('companyName')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your business name"
          />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Revenue Range</label>
          <select
            {...register('revenueRange')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select range...</option>
            <option value="under-500k">Under AED 500K</option>
            <option value="500k-2m">AED 500K – 2M</option>
            <option value="2m-5m">AED 2M – 5M</option>
            <option value="5m-15m">AED 5M – 15M</option>
            <option value="over-15m">Over AED 15M</option>
          </select>
          {errors.revenueRange && <p className="text-red-500 text-sm mt-1">{errors.revenueRange.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Generating your report...' : 'View My Diagnosis →'}
        </button>
        <p className="text-xs text-gray-500 text-center">
          No spam. Your data is used only to personalise and deliver your report.
        </p>
      </form>
    </div>
  );
}
