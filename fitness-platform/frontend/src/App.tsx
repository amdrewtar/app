import { SystemStatusCard } from "@/features/system-status/SystemStatusCard";

export function App() {
  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-50">Fitness Platform</h1>
          <p className="text-gray-400">Этап 0 — bootstrap. Здесь появится Dashboard.</p>
        </header>

        <SystemStatusCard />
      </div>
    </div>
  );
}
