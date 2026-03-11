import { useNavigate } from "react-router-dom";
import { ErrorView } from "../../components/ErrorView";
import { LoadingView } from "../../components/LoadingView";
import { useEquipment } from "../../hooks/useEquipment";
import type { Equipment } from "../../types";

const TYPE_ICONS: Record<Equipment["type"], string> = {
  grinder: "⚙️", kettle: "🫖", dripper: "☕", scale: "⚖️", other: "🔧",
};
const TYPE_LABELS: Record<Equipment["type"], string> = {
  grinder: "그라인더", kettle: "케틀", dripper: "드리퍼", scale: "저울", other: "기타",
};

function EquipmentCard({ item, onPress }: { item: Equipment; onPress: () => void }) {
  return (
    <button className="mb-3 flex w-full items-center rounded-2xl bg-zinc-800 p-4 text-left" onClick={onPress}>
      <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-700">
        <span className="text-2xl">{TYPE_ICONS[item.type]}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs text-zinc-400">{TYPE_LABELS[item.type]}</p>
        <p className="text-base font-semibold text-white">{item.name}</p>
        {item.brand ? <p className="text-sm text-zinc-400">{item.brand}</p> : null}
      </div>
      {item.isInCurrentSetup && (
        <div className="rounded-lg bg-amber-400/20 px-2 py-1">
          <span className="text-xs font-medium text-amber-400">현재 세팅</span>
        </div>
      )}
    </button>
  );
}

export default function EquipmentListPage() {
  const { equipment, isLoading, error } = useEquipment();
  const navigate = useNavigate();

  if (isLoading) return <LoadingView />;
  if (error) return <ErrorView message={error} />;

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="flex items-center justify-between px-5 pb-4 pt-14">
        <button onClick={() => navigate(-1)} className="text-amber-400">← 뒤로</button>
        <h1 className="text-lg font-bold text-white">장비 관리</h1>
        <button onClick={() => navigate("/equipment/new")} className="text-amber-400">+ 추가</button>
      </div>

      {equipment.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <p className="text-zinc-400">등록된 장비가 없어요</p>
          <button className="mt-4 text-amber-400" onClick={() => navigate("/equipment/new")}>
            + 장비 추가하기
          </button>
        </div>
      ) : (
        <div className="px-5 pb-8">
          {equipment.map((item) => (
            <EquipmentCard key={item.id} item={item} onPress={() => navigate(`/equipment/${item.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
