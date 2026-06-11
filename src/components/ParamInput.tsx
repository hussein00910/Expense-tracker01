import { View, Text, TextInput, TouchableOpacity } from "react-native";
import type { ToolParam } from "../types";

interface Props {
  param: ToolParam;
  value: string;
  onChange: (value: string) => void;
}

export function ParamInput({ param, value, onChange }: Props) {
  if (param.type === "select" && param.options) {
    return (
      <View style={{ marginBottom: 14 }}>
        <Text style={{ color: "#888888", fontSize: 12, marginBottom: 6 }}>
          {param.label}
          {param.required && <Text style={{ color: "#ff3333" }}> *</Text>}
        </Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {param.options.map((opt) => {
            const isActive = (value || param.defaultValue || param.options![0]) === opt;
            return (
              <TouchableOpacity
                key={opt}
                onPress={() => onChange(opt)}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 6,
                  backgroundColor: isActive ? "#00ff4122" : "#1a1a1a",
                  borderWidth: 1,
                  borderColor: isActive ? "#00ff41" : "#2a2a2a",
                }}
              >
                <Text style={{ color: isActive ? "#00ff41" : "#888888", fontSize: 12 }}>
                  {opt}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ color: "#888888", fontSize: 12, marginBottom: 6 }}>
        {param.label}
        {param.required && <Text style={{ color: "#ff3333" }}> *</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={param.placeholder}
        placeholderTextColor="#444444"
        keyboardType={param.type === "number" ? "numeric" : "default"}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          backgroundColor: "#111111",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#2a2a2a",
          padding: 10,
          color: "#e0e0e0",
          fontSize: 13,
          fontFamily: "monospace",
        }}
      />
    </View>
  );
}
