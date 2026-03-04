import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useBeans } from "../../hooks/useBeans";
import { useRecipes } from "../../hooks/useRecipes";

type Phase = "select" | "config" | "countdown" | "brewing" | "done";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function BrewScreen() {
  const params = useLocalSearchParams<{ recipeId?: string }>();
  const router = useRouter();
  const { recipes } = useRecipes();
  const { beans } = useBeans();

  const [phase, setPhase] = useState<Phase>(params.recipeId ? "config" : "select");
  const [recipeId, setRecipeId] = useState(params.recipeId ?? "");
  const [beanId, setBeanId] = useState("");
  const [coffeeWeight, setCoffeeWeight] = useState("");
  const [stepIndex, setStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const elapsedRef = useRef(0);

  const recipe = recipes.find((r) => r.id === recipeId);

  useEffect(() => {
    if (recipe) setCoffeeWeight(String(recipe.coffeeWeight));
  }, [recipe?.id]);

  // Countdown timer
  useEffect(() => {
    if (phase !== "countdown") return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setStepIndex(0);
          setElapsed(0);
          elapsedRef.current = 0;
          setPhase("brewing");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Elapsed timer
  useEffect(() => {
    if (phase !== "brewing") return;
    const interval = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // ── Select phase ─────────────────────────────
  if (phase === "select") {
    return (
      <View className="flex-1 bg-gray-50">
        <View className="px-6 pb-4 pt-16">
          <Text className="text-2xl font-bold text-gray-900">추출 도우미</Text>
          <Text className="mt-1 text-sm text-gray-500">레시피를 선택해주세요</Text>
        </View>
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-3 rounded-2xl bg-white p-4 shadow-sm"
              onPress={() => {
                setRecipeId(item.id);
                setPhase("config");
              }}
            >
              <Text className="font-semibold text-gray-900">{item.title}</Text>
              <Text className="mt-1 text-sm text-gray-500">
                {item.brewMethod} · {item.coffeeWeight}g / {item.waterWeight}ml
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="mt-12 items-center">
              <Text className="text-gray-400">레시피가 없어요</Text>
              <TouchableOpacity onPress={() => router.push("/recipe/new")}>
                <Text className="mt-2 text-blue-500">레시피 만들기 →</Text>
              </TouchableOpacity>
            </View>
          }
        />
      </View>
    );
  }

  if (!recipe) return null;

  // ── Config phase ──────────────────────────────
  if (phase === "config") {
    return (
      <View className="flex-1 bg-gray-50 px-6 pt-16">
        <TouchableOpacity onPress={() => setPhase("select")} className="mb-6">
          <Text className="text-blue-500">← 레시피 변경</Text>
        </TouchableOpacity>
        <Text className="mb-1 text-2xl font-bold text-gray-900">{recipe.title}</Text>
        <Text className="mb-8 text-sm text-gray-500">
          {recipe.brewMethod} · {recipe.waterTemp}°C · 분쇄도 {recipe.grindSize}
        </Text>

        <Text className="mb-2 text-sm font-medium text-gray-700">원두 선택 (선택)</Text>
        <View className="mb-6 flex-row flex-wrap gap-2">
          {beans.map((b) => (
            <TouchableOpacity
              key={b.id}
              className={`rounded-full border px-4 py-2 ${
                beanId === b.id ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
              }`}
              onPress={() => setBeanId(beanId === b.id ? "" : b.id)}
            >
              <Text
                className={`text-sm ${beanId === b.id ? "font-medium text-blue-600" : "text-gray-700"}`}
              >
                {b.name}
              </Text>
            </TouchableOpacity>
          ))}
          {beans.length === 0 && (
            <Text className="text-sm text-gray-400">등록된 원두 없음</Text>
          )}
        </View>

        <Text className="mb-2 text-sm font-medium text-gray-700">실제 원두량 (g)</Text>
        <TextInput
          className="mb-8 rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900"
          value={coffeeWeight}
          onChangeText={setCoffeeWeight}
          keyboardType="numeric"
        />

        <TouchableOpacity
          className="rounded-xl bg-blue-500 py-4"
          onPress={() => setPhase("countdown")}
        >
          <Text className="text-center text-lg font-semibold text-white">추출 시작</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Countdown phase ───────────────────────────
  if (phase === "countdown") {
    return (
      <View className="flex-1 items-center justify-center bg-gray-900">
        <Text className="text-9xl font-bold text-white">{countdown}</Text>
        <Text className="mt-4 text-lg text-gray-400">준비하세요...</Text>
      </View>
    );
  }

  // ── Brewing phase ─────────────────────────────
  if (phase === "brewing") {
    const steps = recipe.steps;
    const currentStep = steps[stepIndex];
    const isLastStep = stepIndex === steps.length - 1;

    const handleNext = () => {
      if (isLastStep) {
        setPhase("done");
      } else {
        setStepIndex((i) => i + 1);
      }
    };

    return (
      <View className="flex-1 bg-gray-900 px-6 pt-16">
        <View className="mb-8 items-center">
          <Text className="text-5xl font-bold tabular-nums text-white">{formatTime(elapsed)}</Text>
        </View>

        <View className="mb-8 flex-row gap-1.5">
          {steps.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= stepIndex ? "bg-blue-400" : "bg-gray-700"}`}
            />
          ))}
        </View>

        {currentStep && (
          <View className="flex-1 items-center justify-center">
            <Text className="mb-2 text-sm text-gray-400">
              Step {currentStep.order} / {steps.length}
            </Text>
            <Text className="mb-4 text-7xl font-bold text-white">
              {currentStep.waterAmount}
              <Text className="text-4xl text-gray-400">ml</Text>
            </Text>
            {currentStep.tip ? (
              <Text className="text-center text-base text-gray-400">{currentStep.tip}</Text>
            ) : null}
          </View>
        )}

        <TouchableOpacity className="mb-10 rounded-xl bg-blue-500 py-4" onPress={handleNext}>
          <Text className="text-center text-lg font-semibold text-white">
            {isLastStep ? "추출 완료" : "다음 단계 →"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Done phase ────────────────────────────────
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 px-6">
      <Text className="mb-2 text-5xl">☕</Text>
      <Text className="mb-1 text-2xl font-bold text-gray-900">추출 완료!</Text>
      <Text className="mb-10 text-gray-500">총 {formatTime(elapsed)}</Text>

      <TouchableOpacity
        className="mb-3 w-full rounded-xl bg-blue-500 py-4"
        onPress={() =>
          router.push({
            pathname: "/sensory",
            params: { recipeId: recipe.id, beanId, usedCoffeeWeight: coffeeWeight },
          })
        }
      >
        <Text className="text-center font-semibold text-white">관능 평가하기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="w-full rounded-xl border border-gray-200 bg-white py-4"
        onPress={() => {
          setPhase("select");
          setRecipeId("");
          setBeanId("");
          setCoffeeWeight("");
        }}
      >
        <Text className="text-center font-semibold text-gray-700">건너뛰기</Text>
      </TouchableOpacity>
    </View>
  );
}
