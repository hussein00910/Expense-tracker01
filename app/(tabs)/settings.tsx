import { View, Text, TouchableOpacity, Switch, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function SettingsScreen() {
  const { isDark, setTheme } = useTheme();
  const { data: history = [] } = useHistory();
  const clearHistory = useClearHistory();
  const totalTools = MODULES.reduce((a, m) => a + m.tools.length, 0);

  function handleClearHistory() {
    Alert.alert("Clear History", "Delete all command history?", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear All", style: "destructive", onPress: () => clearHistory.mutate() },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#1a1a1a" }}>
        <Text style={{ color: "#00ff41", fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>CONFIGURATION</Text>
        <Text style={{ color: "#e0e0e0", fontSize: 22, fontWeight: "700" }}>Settings</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: "#555555", fontSize: 11, letterSpacing: 2, marginBottom: 10 }}>APPEARANCE</Text>
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
