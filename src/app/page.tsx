import Link from 'next/link';

const dimensions = [
  { label: 'Strategic Clarity', color: '#2563EB' },
  { label: 'Financial Visibility', color: '#059669' },
  { label: 'Operations & Execution', color: '#7C3AED' },
  { label: 'People & Leadership', color: '#D97706' },
  { label: 'Sales & Growth Engine', color: '#DC2626' },
];

const deliverables = [
  {
    icon: '🎯',
    title: 'Your Primary Constraint',
    desc: 'The single biggest blocker across 5 dimensions, identified clearly in plain language.',
  },
  {
    icon: '📊',
    title: 'Full Dimension Scores',
    desc: 'Visual breakdown across Strategy, Finance, Operations, People, and Sales.',
  },
  {
    icon: '📋',
    title: '3 Prioritised Actions',
    desc: 'Concrete next steps specific to your constraint — not generic advice.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="w-full px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="font-extrabold text-[#1e3a5f] text-sm tracking-widest uppercase">
            Muhammed Ajmal
          </p>
          <p className="text-xs text-gray-400 tracking-wide">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e3a5f] leading-tight mb-5">
              Find the One Thing Stopping Your Business Growth
            </h1>
        <Link
          href="/diagnostic"
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors hidden sm:block"
        >
          Start Diagnostic →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-2xl mx-auto">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
            Free Business Diagnostic
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e3a5f] leading-tight mb-5">
            Find the One Thing Stopping Your Business Growth
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-xl mx-auto">
            Feeling like your business is stuck? Let's fix that. Take this 2-minute diagnostic to pinpoint exactly what is blocking your progress and get a clear plan in your inbox. 
          </p>

          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center bg-[#1e3a5f] text-white font-bold py-4 px-10 rounded-xl text-lg hover:bg-blue-800 transition-colors shadow-lg"
          >
            Start the Free Diagnostic →
          </Link>

          <div className="flex items-center justify-center gap-6 mt-5 flex-wrap">
            <span className="text-xs text-gray-400">⏱ 4 minutes</span>
            <span className="text-xs text-gray-400">📧 Report emailed instantly</span>
            <span className="text-xs text-gray-400">🔒 No signup required</span>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="bg-white px-6 py-14">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
            What You Will Receive
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {deliverables.map(item => (
              <div
                key={item.title}
                className="bg-slate-50 rounded-2xl p-6 border border-gray-100 text-center"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dimensions */}
      <section className="bg-slate-50 px-6 py-14">
        <div className="max-w-xl mx-auto">
          <p className="text-center text-xs font-bold tracking-widest text-gray-400 uppercase mb-8">
            The 5 Diagnostic Dimensions
          </p>
          <div className="space-y-3">
            {dimensions.map(dim => (
              <div
                key={dim.label}
                className="flex items-center gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100"
              >
                <div
                  className="w-1.5 h-8 rounded-full flex-shrink-0"
                  style={{ backgroundColor: dim.color }}
                />
                <span className="font-semibold text-gray-800 text-sm">{dim.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#1e3a5f] px-6 py-14 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to name your constraint?
          </h2>
          <p className="text-blue-300 text-sm mb-7 leading-relaxed">
            Built for founder-led SMEs in the UAE and GCC.
            Takes 4 minutes. Completely free.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center bg-white text-[#1e3a5f] font-bold py-4 px-10 rounded-xl text-base hover:bg-blue-50 transition-colors"
          >
            Start the Free Diagnostic →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#152d4a] px-6 py-5 text-center">
        <p className="text-blue-400 text-xs">
          Muhammed Ajmal Consulting · Dubai, UAE ·
          Strategic Management | Operational Excellence | AI-Driven Systems
        </p>
      </footer>

    </main>
  );
}