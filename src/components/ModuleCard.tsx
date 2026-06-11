import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SecurityModule } from "../types";

interface Props {
  module: SecurityModule;
  onPress: () => void;
}

export function ModuleCard({ module, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flex: 1,
        margin: 6,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        alignItems: "center",
        minHeight: 120,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: module.color + "22",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
          borderWidth: 1,
          borderColor: module.color + "44",
        }}
      >
        <MaterialCommunityIcons
          name={module.icon as any}
          size={24}
          color={module.color}
        />
      </View>
      <Text
        style={{
          color: "#e0e0e0",
          fontSize: 13,
          fontWeight: "600",
          textAlign: "center",
          marginBottom: 4,
        }}
        numberOfLines={1}
      >
        {module.name}
      </Text>
      <Text style={{ color: "#888888", fontSize: 11, textAlign: "center" }}>
        {module.tools.length} tools
      </Text>
    </TouchableOpacity>
  );
}
