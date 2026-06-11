import { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getModule, getTool } from "../../../src/data/modules";
import { ParamInput } from "../../../src/components/ParamInput";
import { CommandOutput } from "../../../src/components/CommandOutput";
import { executeCommand } from "../../../src/services/executor";
import { useSaveEntry, buildHistoryEntry } from "../../../src/hooks/useHistory";
import type { ExecutionResult } from "../../../src/types";

export default function ToolScreen() {
  const { id, moduleId } = useLocalSearchParams<{ id: string; moduleId: string }>();
  const navigation = useNavigation();
  const module = getModule(moduleId);
  const tool = getTool(moduleId, id);
  const [params, setParams] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const saveEntry = useSaveEntry();

  useEffect(() => {
    navigation.setOptions({ title: tool?.name ?? "Tool" });
    if (tool) {
      const defaults: Record<string, string> = {};
      tool.params.forEach((p) => { if (p.defaultValue) defaults[p.name] = p.defaultValue; });
      setParams(defaults);
    }
  }, [tool]);

  if (!tool || !module) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0a0a0a", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#ff3333" }}>Tool not found</Text>
      </View>
    );
  }

  const visibleParams = tool.params.filter((p) => p.required);
  const advancedParams = tool.params.filter((p) => !p.required);

  function updateParam(name: string, value: string) {
    setParams((prev) => ({ ...prev, [name]: value }));
  }

  function validateParams(): boolean {
    for (const p of tool!.params) {
      if (p.required && !params[p.name]?.trim()) {
        Alert.alert("Missing Parameter", `"${p.label}" is required.`);
        return false;
      }
    }
    return true;
  }

  async function handleExecute() {
    if (!validateParams()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await executeCommand(tool!, params);
      setResult(res);
      saveEntry.mutate(buildHistoryEntry(tool!.id, tool!.name, module!.id, module!.name, params, res));
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }} edges={["bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <View style={{ backgroundColor: "#1a1a1a", borderRadius: 10, padding: 14, marginBottom: 20, borderWidth: 1, borderLeftWidth: 3, borderColor: "#2a2a2a", borderLeftColor: module.color }}>
            <Text style={{ color: "#e0e0e0", fontSize: 15, fontWeight: "600", marginBottom: 4 }}>{tool.name}</Text>
            <Text style={{ color: "#888888", fontSize: 12, lineHeight: 18 }}>{tool.description}</Text>
            <Text style={{ color: "#444444", fontSize: 10, fontFamily: "monospace", marginTop: 8 }} numberOfLines={1}>$ {tool.commandTemplate}</Text>
          </View>

          {visibleParams.length > 0 && (
            <>
              <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>PARAMETERS</Text>
              {visibleParams.map((param) => (
                <ParamInput key={param.name} param={param} value={params[param.name] ?? ""} onChange={(v) => updateParam(param.name, v)} />
              ))}
            </>
          )}

          {advancedParams.length > 0 && (
            <TouchableOpacity
              onPress={() => setShowAdvanced(!showAdvanced)}
              style={{ flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 6, paddingVertical: 4 }}
            >
              <MaterialCommunityIcons name={showAdvanced ? "chevron-up" : "chevron-down"} size={16} color="#444444" />
              <Text style={{ color: "#444444", fontSize: 12 }}>
                {showAdvanced ? "Hide" : "Show"} advanced options ({advancedParams.length})
              </Text>
            </TouchableOpacity>
          )}

          {showAdvanced && advancedParams.map((param) => (
            <ParamInput key={param.name} param={param} value={params[param.name] ?? ""} onChange={(v) => updateParam(param.name, v)} />
          ))}

          <TouchableOpacity
            onPress={handleExecute}
            disabled={loading}
            style={{ backgroundColor: loading ? "#1a2a1a" : "#00ff41", borderRadius: 10, padding: 14, alignItems: "center", flexDirection: "row", justifyContent: "center", marginTop: 8, marginBottom: 20, gap: 8 }}
          >
            {loading ? (
              <>
                <ActivityIndicator color="#00ff41" size="small" />
                <Text style={{ color: "#00ff41", fontSize: 15, fontWeight: "700" }}>Executing...</Text>
              </>
            ) : (
              <>
                <MaterialCommunityIcons name="play" size={18} color="#0a0a0a" />
                <Text style={{ color: "#0a0a0a", fontSize: 15, fontWeight: "700" }}>Execute</Text>
              </>
            )}
          </TouchableOpacity>

          {result && (
            <>
              <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginBottom: 12 }}>OUTPUT</Text>
              <CommandOutput result={result} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
