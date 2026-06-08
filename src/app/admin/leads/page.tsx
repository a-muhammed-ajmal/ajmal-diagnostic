import { requireAdminAuth } from '@/lib/adminAuth';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import type { Lead } from '@/types';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export default async function AdminLeadsPage() {
  await requireAdminAuth();
  const { data: leads } = await supabase
    .from('diagnostic_leads')
    .select('*')
    .order('created_at', { ascending: false });

  const severityColors: Record<string, string> = {
    Critical: 'bg-crimson/10 text-crimson',
    Developing: 'bg-amber-100 text-amber-700',
    Progressing: 'bg-emerald/10 text-emerald',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-navy text-ivory px-6 py-4 flex justify-between items-center">
        <div className="font-heading font-bold text-sm">M<span className="text-gold">A</span> · Consultant Workspace</div>
        <div className="flex items-center gap-4">
          <span className="font-body text-xs text-ivory/50">{leads?.length || 0} leads</span>
          <a href="/api/admin/logout" className="text-xs text-ivory/50 hover:text-gold transition-colors">Sign Out</a>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-heading font-extrabold text-navy text-2xl mb-6">All Leads</h1>
        <div className="bg-white rounded-xl shadow-sm border border-navy/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-navy text-ivory">
                <tr>
                  {['Date', 'Name', 'Company', 'Industry', 'Team', 'Revenue', 'Health', 'Primary Constraint', 'Email', 'AI Plan', 'Booked'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-heading font-semibold text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {(leads as Lead[] | null)?.map(lead => (
                  <tr key={lead.id} className="hover:bg-ivory/50 transition-colors">
                    <td className="px-4 py-3 font-body text-xs text-navy/50 whitespace-nowrap">
                      {new Date(lead.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/leads/${lead.id}`} className="font-heading font-semibold text-navy hover:text-gold transition-colors whitespace-nowrap">{lead.name}</Link>
                      <div className="font-body text-xs text-navy/40">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-navy whitespace-nowrap">{lead.company_name}</td>
                    <td className="px-4 py-3 font-body text-xs text-navy/60 whitespace-nowrap">{lead.industry || '—'}</td>
                    <td className="px-4 py-3 font-body text-xs text-navy/60 whitespace-nowrap">{lead.team_size || '—'}</td>
                    <td className="px-4 py-3 font-body text-xs text-navy/60 whitespace-nowrap">{lead.revenue_range}</td>
                    <td className="px-4 py-3">
                      {lead.health_score !== null && (
                        <div>
                          <div className="font-heading font-bold text-navy text-sm">{lead.health_score}%</div>
                          {lead.severity_label && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityColors[lead.severity_label] || ''}`}>
                              {lead.severity_label}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-navy whitespace-nowrap">
                      {lead.primary_constraint?.replace(/_/g, ' ') || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lead.email_sent ? 'bg-emerald/10 text-emerald' : 'bg-crimson/10 text-crimson'}`}>
                        {lead.email_sent ? '✔ Sent' : '✗ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lead.ai_plan_generated ? 'bg-emerald/10 text-emerald' : 'bg-gray-100 text-gray-500'}`}>
                        {lead.ai_plan_generated ? '✔ Ready' : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lead.booked_call ? 'bg-emerald/10 text-emerald' : 'bg-gray-100 text-gray-500'}`}>
                        {lead.booked_call ? '✔ Booked' : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
