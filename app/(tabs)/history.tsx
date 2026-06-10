import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { HistoryItem } from "../../src/components/HistoryItem";
import { useHistory, useDeleteEntry, useClearHistory } from "../../src/hooks/useHistory";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HistoryScreen() {
  const router = useRouter();
  const { data: entries = [], isLoading } = useHistory();
  const deleteEntry = useDeleteEntry();
  const clearHistory = useClearHistory();

  function handleClearAll() {
    Alert.alert(
      "Clear History",
      "Delete all command history? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear All", style: "destructive", onPress: () => clearHistory.mutate() },
      ]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#1a1a1a",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#00ff41", fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>COMMAND HISTORY</Text>
          <Text style={{ color: "#e0e0e0", fontSize: 22, fontWeight: "700" }}>History</Text>
        </View>
        {entries.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={{ padding: 8 }}>
            <MaterialCommunityIcons name="delete-sweep-outline" size={22} color="#555555" />
          </TouchableOpacity>
        )}
      </View>
      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#555555" }}>Loading...</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 32 }}>
          <MaterialCommunityIcons name="history" size={56} color="#2a2a2a" />
          <Text style={{ color: "#555555", fontSize: 16, marginTop: 16, textAlign: "center" }}>No commands executed yet</Text>
          <Text style={{ color: "#444444", fontSize: 13, marginTop: 8, textAlign: "center" }}>Run a tool from the Modules tab to see history here.</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12 }}
          renderItem={({ item }) => (
            <HistoryItem
              entry={item}
              onDelete={() => deleteEntry.mutate(item.id)}
              onPress={() =>
                router.push({
                  pathname: "/module/tool/[id]",
                  params: { id: item.toolId, moduleId: item.moduleId },
                })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
