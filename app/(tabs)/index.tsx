import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { MODULES } from "../../src/data/modules";
import { ModuleCard } from "../../src/components/ModuleCard";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#1a1a1a",
        }}
      >
        <Text style={{ color: "#00ff41", fontSize: 10, letterSpacing: 3, marginBottom: 4 }}>
          UNIFIED TOOLKIT v1.0.0
        </Text>
        <Text style={{ color: "#e0e0e0", fontSize: 22, fontWeight: "700" }}>
          Security Modules
        </Text>
        <Text style={{ color: "#555555", fontSize: 13, marginTop: 2 }}>
          {MODULES.length} modules  •  {MODULES.reduce((a, m) => a + m.tools.length, 0)} tools
        </Text>
      </View>
      <FlatList
        data={MODULES}
        numColumns={3}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <ModuleCard
            module={item}
            onPress={() =>
              router.push({ pathname: "/module/[id]", params: { id: item.id } })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}
