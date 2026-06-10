import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import * as Clipboard from "expo-clipboard";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ExecutionResult } from "../types";

interface Props {
  result: ExecutionResult;
}

export function CommandOutput({ result }: Props) {
  async function copyToClipboard() {
    await Clipboard.setStringAsync(result.output);
    Alert.alert("Copied", "Output copied to clipboard.");
  }

  return (
    <View
      style={{
        backgroundColor: "#0d0d0d",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#2a2a2a",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#2a2a2a",
          backgroundColor: "#111111",
        }}
      >
        <View style={{ flexDirection: "row", gap: 6, marginRight: 12 }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#ff5f57" }} />
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#febc2e" }} />
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#28c840" }} />
        </View>
        <Text style={{ color: "#555555", fontSize: 11, flex: 1, fontFamily: "monospace" }} numberOfLines={1}>
          $ {result.command}
        </Text>
        <TouchableOpacity onPress={copyToClipboard} style={{ padding: 4 }}>
          <MaterialCommunityIcons name="content-copy" size={16} color="#555555" />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ maxHeight: 320, padding: 12 }}>
        <Text
          style={{ color: "#00ff41", fontSize: 11, fontFamily: "monospace", lineHeight: 18 }}
          selectable
        >
          {result.output}
        </Text>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          padding: 8,
          borderTopWidth: 1,
          borderTopColor: "#2a2a2a",
          backgroundColor: "#111111",
          justifyContent: "flex-end",
          gap: 16,
        }}
      >
        <Text style={{ color: "#555555", fontSize: 10 }}>Exit: {result.exitCode}</Text>
        <Text style={{ color: "#555555", fontSize: 10 }}>{(result.duration / 1000).toFixed(2)}s</Text>
      </View>
    </View>
  );
}
