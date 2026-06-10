import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { HistoryEntry } from "../types";
import { MODULES } from "../data/modules";

interface Props {
  entry: HistoryEntry;
  onDelete: () => void;
  onPress: () => void;
}

export function HistoryItem({ entry, onDelete, onPress }: Props) {
  const mod = MODULES.find((m) => m.id === entry.moduleId);
  const color = mod?.color ?? "#00ff41";
  const date = new Date(entry.createdAt);
  const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = date.toLocaleDateString([], { month: "short", day: "numeric" });
  const preview = entry.result.output.split("\n").slice(0, 2).join(" ").slice(0, 80);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#1a1a1a",
        borderRadius: 10,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        flexDirection: "row",
        alignItems: "flex-start",
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: color + "18",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 10,
          marginTop: 2,
        }}
      >
        <MaterialCommunityIcons
          name={mod?.icon as any ?? "console"}
          size={16}
          color={color}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 3 }}>
          <Text style={{ color: "#e0e0e0", fontSize: 13, fontWeight: "600" }}>
            {entry.toolName}
          </Text>
          <Text style={{ color: "#555555", fontSize: 11 }}>
            {dateStr} {timeStr}
          </Text>
        </View>
        <Text style={{ color: "#555555", fontSize: 11, marginBottom: 4 }}>
          {entry.moduleName}  •  {(entry.result.duration / 1000).toFixed(2)}s
        </Text>
        <Text style={{ color: "#444444", fontSize: 11, fontFamily: "monospace" }} numberOfLines={1}>
          {preview}
        </Text>
      </View>
      <TouchableOpacity onPress={onDelete} style={{ padding: 4, marginLeft: 6 }}>
        <MaterialCommunityIcons name="delete-outline" size={18} color="#444444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
