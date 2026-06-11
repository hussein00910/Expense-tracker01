import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { loadHistory, saveEntry, deleteEntry, clearHistory } from "../services/history";
import type { HistoryEntry } from "../types";

const QUERY_KEY = ["history"];

export function useHistory() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: loadHistory });
}

export function useSaveEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveEntry,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useDeleteEntry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function useClearHistory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: clearHistory,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  });
}

export function buildHistoryEntry(
  toolId: string,
  toolName: string,
  moduleId: string,
  moduleName: string,
  params: Record<string, string>,
  result: HistoryEntry["result"]
): HistoryEntry {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    toolId,
    toolName,
    moduleId,
    moduleName,
    params,
    result,
    createdAt: new Date().toISOString(),
  };
}
