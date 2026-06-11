import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { useEffect } from "react";
import { getModule } from "../../src/data/modules";
import { ToolCard } from "../../src/components/ToolCard";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ModuleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const module = getModule(id);

  useEffect(() => { navigation.setOptions({ title: module?.name ?? "Module" }); }, [module]);

  if (!module) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a0a" }}>
        <Text style={{ color: "#ff3333" }}>Module not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0a0a0a" }} edges={["bottom"]}>
      <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: "#1a1a1a", flexDirection: "row", alignItems: "center" }}>
        <View style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: module.color + "18", alignItems: "center", justifyContent: "center", marginRight: 12, borderWidth: 1, borderColor: module.color + "44" }}>
          <MaterialCommunityIcons name={module.icon as any} size={22} color={module.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#e0e0e0", fontSize: 16, fontWeight: "700" }}>{module.name}</Text>
          <Text style={{ color: "#555555", fontSize: 12, marginTop: 2 }}>{module.tools.length} tools available</Text>
        </View>
      </View>
      <Text style={{ color: "#555555", fontSize: 12, paddingHorizontal: 16, paddingVertical: 12, lineHeight: 18 }}>{module.description}</Text>
      <FlatList
        data={module.tools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <ToolCard tool={item} accentColor={module.color} onPress={() => router.push({ pathname: "/module/tool/[id]", params: { id: item.id, moduleId: module.id } })} />
        )}
      />
    </SafeAreaView>
  );
}
