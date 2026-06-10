import AsyncStorage from "@react-native-async-storage/async-storage";
import type { HistoryEntry } from "../types";

const HISTORY_KEY = "@unified_toolkit_history";

export async function loadHistory(): Promise<HistoryEntry[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
}

export async function saveEntry(entry: HistoryEntry): Promise<void> {
  const existing = await loadHistory();
  const updated = [entry, ...existing].slice(0, 200);
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

export async function deleteEntry(id: string): Promise<void> {
  const existing = await loadHistory();
  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(existing.filter((e) => e.id !== id))
  );
}

export async function clearHistory(): Promise<void> {
  await AsyncStorage.removeItem(HISTORY_KEY);
}
