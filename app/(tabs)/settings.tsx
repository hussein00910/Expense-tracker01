import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../src/hooks/useTheme";
import { useClearHistory, useHistory } from "../../src/hooks/useHistory";
import { MODULES } from "../../src/data/modules";

function SettingRow({ icon, label, subtitle, right }: { icon: string; label: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#1a1a1a", borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: "#2a2a2a" }}>
      <MaterialCommunityIcons name={icon as any} size={20} color="#888888" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#e0e0e0", fontSize: 14 }}>{label}</Text>
        {subtitle && <Text style={{ color: "#555555", fontSize: 12, marginTop: 2 }}>{subtitle}</Text>}
      </View>
      {right}
    </View>
  );
}

type TestStatus = "idle" | "testing" | "ok" | "fail";

export default function SettingsScreen() {
  const { isDark, setTheme } = useTheme();
  const { data: history = [] } = useHistory();
  const clearHistory = useClearHistory();
  const totalTools = MODULES.reduce((a, m) => a + m.tools.length, 0);
  const [serverUrl, setServerUrl] = useState("");
  const [testStatus, setTestStatus] = useState<TestStatus>("idle");

  useEffect(() => {
    AsyncStorage.getItem("@toolkit_server_url").then((v) => { if (v) setServerUrl(v); });
  }, []);

  async function handleServerUrlChange(url: string) {
    setServerUrl(url);
    await AsyncStorage.setItem("@toolkit_server_url", url.trim());
  }

  async function testConnection() {
    if (!serverUrl.trim()) {
      Alert.alert("No Server", "Please enter a server URL first.");
      return;
    }
    setTestStatus("testing");
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`${serverUrl.trim()}/ping`, { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      setTestStatus(data.status === "ok" ? "ok" : "fail");
    } catch {
      setTestStatus("fail");
    }
    setTimeout(() => setTestStatus("idle"), 3000);
  }

  function handleClearHistory() {
    Alert.alert("Clear History", "Delete all command history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => clearHistory.mutate() },
    ]);
  }

  const testColor = testStatus === "ok" ? "#00ff41" : testStatus === "fail" ? "#ff3333" : "#555555";
  const testLabel = testStatus === "testing" ? "Testing..." : testStatus === "ok" ? "✓ Connected" : testStatus === "fail" ? "✗ Failed" : "Test Connection";
  const isConnected = !!serverUrl.trim();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#1a1a1a" }}>
        <Text style={{ color: "#00ff41", fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>CONFIGURATION</Text>
        <Text style={{ color: "#e0e0e0", fontSize: 22, fontWeight: "700" }}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>

        <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>BACKEND SERVER</Text>
        <View style={{ backgroundColor: "#1a1a1a", borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: isConnected ? "#00ff4133" : "#2a2a2a" }}>
          <Text style={{ color: "#888888", fontSize: 12, marginBottom: 8 }}>Kali Linux server URL</Text>
          <TextInput
            value={serverUrl}
            onChangeText={handleServerUrlChange}
            placeholder="http://192.168.1.x:5000"
            placeholderTextColor="#333333"
            style={{ color: "#e0e0e0", fontSize: 13, borderBottomWidth: 1, borderBottomColor: "#2a2a2a", paddingVertical: 6, fontFamily: "monospace" }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
          <TouchableOpacity onPress={testConnection} style={{ marginTop: 12, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6 }}>
            <MaterialCommunityIcons name="lan-connect" size={14} color={testColor} />
            <Text style={{ color: testColor, fontSize: 12 }}>{testLabel}</Text>
          </TouchableOpacity>
        </View>
        <SettingRow
          icon={isConnected ? "server" : "server-off"}
          label="Execution Mode"
          subtitle={isConnected ? "Real execution via backend" : "Demo mode — simulated output"}
        />

        <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginTop: 16, marginBottom: 10 }}>APPEARANCE</Text>
        <SettingRow icon="theme-light-dark" label="Dark Mode" subtitle={isDark ? "Enabled" : "Disabled"}
          right={<Switch value={isDark} onValueChange={(v) => setTheme(v ? "dark" : "light")} trackColor={{ false: "#2a2a2a", true: "#00ff4144" }} thumbColor={isDark ? "#00ff41" : "#555555"} />}
        />

        <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginTop: 16, marginBottom: 10 }}>DATA</Text>
        <SettingRow icon="history" label="Command History" subtitle={`${history.length} entries stored`} />
        <TouchableOpacity onPress={handleClearHistory}>
          <SettingRow icon="delete-sweep-outline" label="Clear History" subtitle="Remove all saved commands" right={<MaterialCommunityIcons name="chevron-right" size={18} color="#555555" />} />
        </TouchableOpacity>

        <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginTop: 16, marginBottom: 10 }}>ABOUT</Text>
        <SettingRow icon="information-outline" label="Version" subtitle="1.0.0" />
        <SettingRow icon="shield-check-outline" label="Security Modules" subtitle={`${MODULES.length} modules, ${totalTools} tools`} />
        <SettingRow icon="wifi-off" label="Offline Mode" subtitle="All tools work without internet" />
        <SettingRow icon="lock-outline" label="Privacy" subtitle="No data sent to external servers" />

        <View style={{ marginTop: 24, alignItems: "center" }}>
          <Text style={{ color: "#2a2a2a", fontSize: 12 }}>For authorized security testing only</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
