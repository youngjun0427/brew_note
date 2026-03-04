import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRecipes } from "../../hooks/useRecipes";
import { useAuthStore } from "../../store/useAuthStore";
import { shareRecipe } from "../../lib/share";

function ParamRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-medium text-gray-900">{value}</Text>
    </View>
  );
}

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { recipes, deleteRecipe } = useRecipes();
  const { user } = useAuthStore();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">레시피를 찾을 수 없어요</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="mt-2 text-blue-500">← 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert("삭제", "이 레시피를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteRecipe(id);
          router.back();
        },
      },
    ]);
  };

  const handleShare = async () => {
    if (!user) return;
    if (recipe.shareId) {
      Alert.alert("공유 링크", `${recipe.shareId}`);
      return;
    }
    const shareId = await shareRecipe(recipe, user.uid);
    Alert.alert("공유 링크 생성됨", `share/${shareId}`);
  };

  const ratio =
    recipe.coffeeWeight > 0 ? (recipe.waterWeight / recipe.coffeeWeight).toFixed(1) : "-";

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 24, paddingTop: 56 }}>
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">← 뒤로</Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => router.push(`/recipe/edit/${id}`)}>
            <Text className="text-blue-500">수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-red-400">삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mb-6 text-2xl font-bold text-gray-900">{recipe.title}</Text>

      <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <Text className="mb-3 text-base font-semibold text-gray-800">파라미터</Text>
        <ParamRow label="추출 방식" value={recipe.brewMethod} />
        <ParamRow label="필터 종류" value={recipe.filterType} />
        <ParamRow label="분쇄도" value={String(recipe.grindSize)} />
        <ParamRow label="물 온도" value={`${recipe.waterTemp}°C`} />
        <ParamRow label="원두량" value={`${recipe.coffeeWeight}g`} />
        <ParamRow label="물량" value={`${recipe.waterWeight}ml`} />
        <ParamRow label="비율" value={`1:${ratio}`} />
      </View>

      {recipe.steps.length > 0 && (
        <View className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
          <Text className="mb-4 text-base font-semibold text-gray-800">추출 단계</Text>
          {recipe.steps.map((step) => (
            <View key={step.order} className="mb-3 flex-row items-start gap-3">
              <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                <Text className="text-xs font-bold text-blue-600">{step.order}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-800">{step.waterAmount}ml</Text>
                {step.tip ? (
                  <Text className="mt-0.5 text-sm text-gray-500">{step.tip}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity
        className="mb-3 rounded-xl bg-blue-500 py-4"
        onPress={() =>
          router.push({ pathname: "/(tabs)/brew", params: { recipeId: recipe.id } })
        }
      >
        <Text className="text-center font-semibold text-white">추출 시작</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="rounded-xl border border-gray-200 bg-white py-4"
        onPress={handleShare}
      >
        <Text className="text-center font-semibold text-gray-700">
          {recipe.isPublic ? "공유 링크 보기" : "공유 링크 생성"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
