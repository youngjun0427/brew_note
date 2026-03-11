import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  buildEquipmentSpecs,
  EquipmentForm,
  type EquipmentFormValues,
} from "../../components/EquipmentForm";
import { useEquipment } from "../../hooks/useEquipment";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function EquipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { equipment, updateEquipment, deleteEquipment } = useEquipment();
  const [isEditing, setIsEditing] = useState(false);
  const item = equipment.find((e) => e.id === id);

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">장비를 찾을 수 없어요</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-amber-400">← 돌아가기</button>
      </div>
    );
  }

  if (isEditing) {
    const defaultValues: Partial<EquipmentFormValues> = {
      brand: item.brand, model: item.model, type: item.type,
      notes: item.notes ?? "",
      clickUnit: item.specs.clickUnit ?? "",
      capacity: item.specs.capacity ? String(item.specs.capacity) : "",
      temperature: item.specs.temperature ? String(item.specs.temperature) : "",
      filterType: item.specs.filterType ?? "", servings: item.specs.servings ?? "",
      precision: item.specs.precision ?? "", hasTimer: item.specs.hasTimer ?? false,
    };
    const handleSubmit = async (data: EquipmentFormValues) => {
      await updateEquipment(id!, {
        name: [data.brand, data.model].filter(Boolean).join(" ") || "장비",
        brand: data.brand, model: data.model, type: data.type,
        specs: buildEquipmentSpecs(data),
        notes: data.notes || null,
      });
      setIsEditing(false);
    };
    return (
      <EquipmentForm
        title="장비 수정" defaultValues={defaultValues}
        onBack={() => setIsEditing(false)} onSubmit={handleSubmit} submitLabel="수정 완료"
      />
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("이 장비를 삭제할까요?")) return;
    await deleteEquipment(id!);
    navigate(-1);
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-zinc-900 p-6 pt-14">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-amber-400">← 뒤로</button>
        <div className="flex gap-4">
          <button onClick={() => setIsEditing(true)} className="text-amber-400">수정</button>
          <button onClick={handleDelete} className="text-red-400">삭제</button>
        </div>
      </div>

      <h1 className="mb-1 text-2xl font-bold text-white">{item.name}</h1>
      <p className="mb-6 text-base text-zinc-400">{item.brand} {item.model}</p>

      <div className="mb-4 rounded-2xl bg-zinc-800 p-5">
        {item.specs.clickUnit ? <InfoRow label="분쇄도 설정" value={item.specs.clickUnit} /> : null}
        {item.specs.temperature ? <InfoRow label="온도" value={`${item.specs.temperature}°C`} /> : null}
        {item.specs.capacity ? <InfoRow label="용량" value={`${item.specs.capacity}L`} /> : null}
        {item.specs.filterType ? <InfoRow label="필터" value={item.specs.filterType} /> : null}
        {item.specs.servings ? <InfoRow label="인원" value={item.specs.servings} /> : null}
        {item.specs.precision ? <InfoRow label="정밀도" value={item.specs.precision} /> : null}
        {item.specs.hasTimer != null ? (
          <InfoRow label="타이머" value={item.specs.hasTimer ? "내장" : "없음"} />
        ) : null}
        {item.notes ? <InfoRow label="메모" value={item.notes} /> : null}
      </div>

    </div>
  );
}
