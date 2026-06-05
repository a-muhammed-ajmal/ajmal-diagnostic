import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="max-w-3xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Find Your Primary <br className="hidden sm:block"/> Growth Constraint
        </h1>
        <p className="text-xl text-slate-600">
          Take this 2-minute diagnostic to identify the #1 bottleneck holding your business back and get a customized, actionable report.
        </p>
        <div className="pt-4">
          <Link 
            href="/diagnostic"
            className="inline-block bg-blue-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
          >
            Start the Free Diagnostic
          </Link>
        </div>
      </div>
    </main>
  );
}