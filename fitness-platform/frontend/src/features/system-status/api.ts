import { useQuery } from "@tanstack/react-query";

import { apiFetch } from "@/shared/lib/api-client";

interface HealthResponse {
  status: "ok" | "degraded";
  database: boolean;
  redis: boolean;
}

export function useHealthCheck() {
  return useQuery({
    queryKey: ["healthz"],
    queryFn: () => apiFetch<HealthResponse>("/healthz"),
    refetchInterval: 15_000,
  });
}
