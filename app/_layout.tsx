import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0a0a0a" }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" backgroundColor="#0a0a0a" />
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#0a0a0a" } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="module/[id]"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#111111" },
                headerTintColor: "#e0e0e0",
                headerTitleStyle: { color: "#e0e0e0", fontSize: 16 },
                headerBackTitle: "",
              }}
            />
            <Stack.Screen
              name="module/tool/[id]"
              options={{
                headerShown: true,
                headerStyle: { backgroundColor: "#111111" },
                headerTintColor: "#e0e0e0",
                headerTitleStyle: { color: "#e0e0e0", fontSize: 16 },
                headerBackTitle: "",
              }}
            />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
