import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../lib/firebase";
import { useRecipes } from "../../hooks/useRecipes";
import { useAuthStore } from "../../store/useAuthStore";
import type { PublicRecipe } from "../../types";

export default function ShareScreen() {
  const { shareId } = useLocalSearchParams<{ shareId: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { addRecipe } = useRecipes();
  const [publicRecipe, setPublicRecipe] = useState<PublicRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [imported, setImported] = useState(false);

  useEffect(() => {
    getDoc(doc(db, "publicRecipes", shareId))
      .then((snap) => {
        if (snap.exists()) setPublicRecipe(snap.data() as PublicRecipe);
      })
      .finally(() => setLoading(false));
  }, [shareId]);

  const handleImport = async () => {
    if (!publicRecipe || !user) return;
    const r = publicRecipe.recipeData;
    await addRecipe({
      title: `${r.title} (가져옴)`,
      brewMethod: r.brewMethod,
      filterType: r.filterType,
      grindSize: r.grindSize,
      waterTemp: r.waterTemp,
      coffeeWeight: r.coffeeWeight,
      waterWeight: r.waterWeight,
      steps: r.steps,
      baseRecipeId: null,
      equipmentId: null,
      isPublic: false,
      shareId: null,
    });
    setImported(true);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">불러오는 중...</Text>
      </View>
    );
  }

  if (!publicRecipe) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">레시피를 찾을 수 없어요</Text>
      </View>
    );
  }

  const r = publicRecipe.recipeData;
  const ratio = r.coffeeWeight > 0 ? (r.waterWeight / r.coffeeWeight).toFixed(1) : "-";

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 24, paddingTop: 56 }}
    >
      <Text className="mb-1 text-sm text-gray-400">공유된 레시피</Text>
      <Text className="mb-6 text-2xl font-bold text-gray-900">{r.title}</Text>

      <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        {(
          [
            ["추출 방식", r.brewMethod],
            ["필터", r.filterType],
            ["분쇄도", String(r.grindSize)],
            ["물 온도", `${r.waterTemp}°C`],
            ["원두", `${r.coffeeWeight}g`],
            ["물", `${r.waterWeight}ml`],
            ["비율", `1:${ratio}`],
          ] as [string, string][]
        ).map(([label, value]) => (
          <View key={label} className="flex-row items-center justify-between py-2">
            <Text className="text-sm text-gray-500">{label}</Text>
            <Text className="text-sm font-medium text-gray-900">{value}</Text>
          </View>
        ))}
      </View>

      {r.steps.length > 0 && (
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="mb-4 font-semibold text-gray-800">추출 단계</Text>
          {r.steps.map((step) => (
            <View key={step.order} className="mb-3 flex-row gap-3">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-xs font-bold text-blue-600">{step.order}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800">{step.waterAmount}ml</Text>
                {step.tip ? (
                  <Text className="text-sm text-gray-500">{step.tip}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}

      {user ? (
        imported ? (
          <View className="rounded-xl bg-green-50 py-4">
            <Text className="text-center font-semibold text-green-600">
              내 레시피에 추가되었어요!
            </Text>
          </View>
        ) : (
          <TouchableOpacity className="rounded-xl bg-blue-500 py-4" onPress={handleImport}>
            <Text className="text-center font-semibold text-white">내 레시피로 가져오기</Text>
          </TouchableOpacity>
        )
      ) : (
        <TouchableOpacity
          className="rounded-xl bg-blue-500 py-4"
          onPress={() => router.push("/login")}
        >
          <Text className="text-center font-semibold text-white">로그인하여 가져오기</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
