import type { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BeanForm, beanFormToData, type BeanFormValues } from "../../components/BeanForm";
import { useBeans } from "../../hooks/useBeans";

function toDateStr(ts: Timestamp) {
  return ts.toDate().toISOString().split("T")[0];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}

export default function BeanDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { beans, updateBean, deleteBean } = useBeans();
  const [isEditing, setIsEditing] = useState(false);
  const bean = beans.find((b) => b.id === id);

  if (!bean) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-900">
        <p className="text-zinc-400">원두를 찾을 수 없어요</p>
        <button onClick={() => navigate(-1)} className="mt-2 text-amber-400">← 돌아가기</button>
      </div>
    );
  }

  if (isEditing) {
    const defaultValues: BeanFormValues = {
      name: bean.name, roastery: bean.roastery, origin: bean.origin, variety: bean.variety,
      roastedAt: toDateStr(bean.roastedAt), purchasedAt: toDateStr(bean.purchasedAt),
      price: String(bean.price), totalWeight: String(bean.totalWeight),
      remainingWeight: String(bean.remainingWeight),
    };
    const handleSubmit = async (data: BeanFormValues) => {
      await updateBean(id!, beanFormToData(data));
      setIsEditing(false);
    };
    return (
      <BeanForm
        title="원두 수정" defaultValues={defaultValues}
        onBack={() => setIsEditing(false)} onSubmit={handleSubmit} submitLabel="수정 완료"
      />
    );
  }

  const handleDelete = async () => {
    if (!window.confirm("이 원두를 삭제할까요?")) return;
    await deleteBean(id!);
    navigate(-1);
  };

  const pct =
    bean.totalWeight > 0 ? Math.round((bean.remainingWeight / bean.totalWeight) * 100) : 0;

  return (
    <div className="min-h-screen overflow-y-auto bg-zinc-900 p-6 pt-14">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-amber-400">← 뒤로</button>
        <div className="flex gap-4">
          <button onClick={() => setIsEditing(true)} className="text-amber-400">수정</button>
          <button onClick={handleDelete} className="text-red-400">삭제</button>
        </div>
      </div>

      <h1 className="mb-1 text-2xl font-bold text-white">{bean.name}</h1>
      <p className="mb-6 text-base text-zinc-400">{bean.roastery}</p>

      <div className="mb-4 rounded-2xl bg-zinc-800 p-5">
        <InfoRow label="원산지" value={bean.origin} />
        <InfoRow label="품종" value={bean.variety} />
        <InfoRow label="로스팅 날짜" value={toDateStr(bean.roastedAt)} />
        <InfoRow label="구매일" value={toDateStr(bean.purchasedAt)} />
        <InfoRow label="구매 가격" value={`₩${bean.price.toLocaleString()}`} />
        <InfoRow label="전체 용량" value={`${bean.totalWeight}g`} />
        <InfoRow label="잔여 용량" value={`${bean.remainingWeight}g (${pct}%)`} />
        <div className="mt-4 h-2 rounded-full bg-zinc-700">
          <div className="h-2 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
