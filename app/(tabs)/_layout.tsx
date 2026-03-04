import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "대시보드" }} />
      <Tabs.Screen name="recipes" options={{ title: "레시피" }} />
      <Tabs.Screen name="beans" options={{ title: "원두" }} />
      <Tabs.Screen name="brew" options={{ title: "추출" }} />
    </Tabs>
  );
}
