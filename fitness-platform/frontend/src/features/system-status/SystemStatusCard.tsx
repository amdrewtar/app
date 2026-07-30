import { useHealthCheck } from "./api";

function StatusDot({ ok }: { ok: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${ok ? "bg-brand-500" : "bg-red-500"}`}
    />
  );
}

export function SystemStatusCard() {
  const { data, isLoading, isError } = useHealthCheck();

  return (
    <div className="rounded-2xl border border-gray-800 bg-gray-900/60 p-6 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-gray-100">Статус системы</h2>

      {isLoading && <p className="text-gray-400">Проверка подключения к backend…</p>}

      {isError && (
        <p className="text-red-400">
          Не удалось связаться с backend. Проверьте, что контейнер `backend` запущен.
        </p>
      )}

      {data && (
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <StatusDot ok={data.status === "ok"} />
            API: {data.status}
          </li>
          <li className="flex items-center gap-2">
            <StatusDot ok={data.database} />
            PostgreSQL: {data.database ? "подключено" : "недоступно"}
          </li>
          <li className="flex items-center gap-2">
            <StatusDot ok={data.redis} />
            Redis: {data.redis ? "подключено" : "недоступно"}
          </li>
        </ul>
      )}
    </div>
  );
}
