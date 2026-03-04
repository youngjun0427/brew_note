import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useBrewLogs } from "../hooks/useBrewLogs";
import type { SensoryNote } from "../types";

const CRITERIA: { key: keyof SensoryNote; label: string }[] = [
  { key: "acidity", label: "산미" },
  { key: "bitterness", label: "쓴맛" },
  { key: "body", label: "바디" },
  { key: "aroma", label: "향" },
  { key: "overall", label: "전체 만족도" },
];

function RatingRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View className="mb-5">
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-sm font-medium text-gray-700">{label}</Text>
        <Text className="text-sm text-gray-400">{value} / 5</Text>
      </View>
      <View className="flex-row gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity
            key={n}
            onPress={() => onChange(n)}
            className={`flex-1 rounded-xl py-3 ${value >= n ? "bg-blue-500" : "bg-gray-100"}`}
          >
            <Text
              className={`text-center text-sm font-medium ${value >= n ? "text-white" : "text-gray-400"}`}
            >
              {n}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default function SensoryScreen() {
  const { recipeId, beanId, usedCoffeeWeight } = useLocalSearchParams<{
    recipeId: string;
    beanId: string;
    usedCoffeeWeight: string;
  }>();
  const router = useRouter();
  const { addBrewLog } = useBrewLogs();

  const [ratings, setRatings] = useState<SensoryNote>({
    acidity: 3,
    bitterness: 3,
    body: 3,
    aroma: 3,
    overall: 3,
  });

  const handleSave = async () => {
    await addBrewLog({
      recipeId,
      beanId: beanId || null,
      usedCoffeeWeight: Number(usedCoffeeWeight) || 0,
      sensoryNote: ratings,
      aiSuggestion: null,
    });
    router.replace("/(tabs)");
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 24, paddingTop: 56 }}
    >
      <Text className="mb-2 text-2xl font-bold text-gray-900">관능 평가</Text>
      <Text className="mb-8 text-sm text-gray-500">이번 추출은 어땠나요?</Text>

      {CRITERIA.map(({ key, label }) => (
        <RatingRow
          key={key}
          label={label}
          value={ratings[key]}
          onChange={(v) => setRatings((prev) => ({ ...prev, [key]: v }))}
        />
      ))}

      <TouchableOpacity className="mt-4 rounded-xl bg-blue-500 py-4" onPress={handleSave}>
        <Text className="text-center font-semibold text-white">저장하기</Text>
      </TouchableOpacity>

      <TouchableOpacity className="mt-3 py-3" onPress={() => router.replace("/(tabs)")}>
        <Text className="text-center text-gray-400">건너뛰기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
