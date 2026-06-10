import { TouchableOpacity, View, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { SecurityTool } from "../types";

interface Props {
  tool: SecurityTool;
  accentColor: string;
  onPress: () => void;
}

export function ToolCard({ tool, accentColor, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#2a2a2a",
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          backgroundColor: accentColor + "18",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <MaterialCommunityIcons
          name="console-line"
          size={18}
          color={accentColor}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ color: "#e0e0e0", fontSize: 14, fontWeight: "600", marginBottom: 2 }}
        >
          {tool.name}
        </Text>
        <Text
          style={{ color: "#888888", fontSize: 12 }}
          numberOfLines={1}
        >
          {tool.description}
        </Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color="#555555" />
    </TouchableOpacity>
  );
}
