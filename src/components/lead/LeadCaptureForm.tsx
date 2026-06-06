'use client';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LeadData } from '@/types';

const leadSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  companyName: z.string().min(2, 'Please enter your company name'),
  revenueRange: z.string().optional().default(''),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadCaptureFormProps {
  onSubmit: (data: LeadData) => void;
  isLoading: boolean;
}

export function LeadCaptureForm({ onSubmit, isLoading }: LeadCaptureFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema) as unknown as Resolver<LeadFormData>,
  });

  const handleFormSubmit = (data: LeadFormData) => {
    const leadData: LeadData = {
      name: data.name,
      email: data.email,
      companyName: data.companyName,
      revenueRange: data.revenueRange ?? '',
    };
    onSubmit(leadData);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your results are ready.</h2>
        <p className="text-gray-600 text-sm">
          So we can personalise your report to your business context, we need a few details.
        </p>
      </div>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            {...register('name')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="First and last name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="you@company.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            {...register('companyName')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            placeholder="Your business name"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Annual Revenue Range{' '}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <select
            {...register('revenueRange')}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-base"
          >
            <option value="">Prefer not to say</option>
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 text-base"
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