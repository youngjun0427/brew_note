import type { Timestamp } from "firebase/firestore";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BeanForm, beanFormToData, type BeanFormValues } from "../../components/BeanForm";
import { useBeans } from "../../hooks/useBeans";

function toDateStr(ts: Timestamp) {
  return ts.toDate().toISOString().split("T")[0];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-2">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text className="text-sm font-medium text-gray-900">{value}</Text>
    </View>
  );
}

export default function BeanDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { beans, updateBean, deleteBean } = useBeans();
  const [isEditing, setIsEditing] = useState(false);
  const bean = beans.find((b) => b.id === id);

  if (!bean) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400">원두를 찾을 수 없어요</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="mt-2 text-blue-500">← 돌아가기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isEditing) {
    const defaultValues: BeanFormValues = {
      name: bean.name,
      roastery: bean.roastery,
      origin: bean.origin,
      variety: bean.variety,
      roastedAt: toDateStr(bean.roastedAt),
      purchasedAt: toDateStr(bean.purchasedAt),
      price: String(bean.price),
      totalWeight: String(bean.totalWeight),
      remainingWeight: String(bean.remainingWeight),
    };

    const handleSubmit = async (data: BeanFormValues) => {
      await updateBean(id, beanFormToData(data));
      setIsEditing(false);
    };

    return (
      <BeanForm
        title="원두 수정"
        defaultValues={defaultValues}
        onBack={() => setIsEditing(false)}
        onSubmit={handleSubmit}
        submitLabel="수정 완료"
      />
    );
  }

  const handleDelete = () => {
    Alert.alert("삭제", "이 원두를 삭제할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          await deleteBean(id);
          router.back();
        },
      },
    ]);
  };

  const pct =
    bean.totalWeight > 0 ? Math.round((bean.remainingWeight / bean.totalWeight) * 100) : 0;

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 24, paddingTop: 56 }}
    >
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-blue-500">← 뒤로</Text>
        </TouchableOpacity>
        <View className="flex-row gap-4">
          <TouchableOpacity onPress={() => setIsEditing(true)}>
            <Text className="text-blue-500">수정</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete}>
            <Text className="text-red-400">삭제</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mb-1 text-2xl font-bold text-gray-900">{bean.name}</Text>
      <Text className="mb-6 text-base text-gray-500">{bean.roastery}</Text>

      <View className="rounded-2xl bg-white p-5 shadow-sm">
        <InfoRow label="원산지" value={bean.origin} />
        <InfoRow label="품종" value={bean.variety} />
        <InfoRow label="로스팅 날짜" value={toDateStr(bean.roastedAt)} />
        <InfoRow label="구매일" value={toDateStr(bean.purchasedAt)} />
        <InfoRow label="구매 가격" value={`₩${bean.price.toLocaleString()}`} />
        <InfoRow label="전체 용량" value={`${bean.totalWeight}g`} />
        <InfoRow label="잔여 용량" value={`${bean.remainingWeight}g (${pct}%)`} />
        <View className="mt-4 h-2 rounded-full bg-gray-100">
          <View className="h-2 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
        </View>
      </View>
    </ScrollView>
  );
}
