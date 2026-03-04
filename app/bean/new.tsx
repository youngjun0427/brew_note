import { useRouter } from "expo-router";
import { BeanForm, beanFormToData, type BeanFormValues } from "../../components/BeanForm";
import { useBeans } from "../../hooks/useBeans";

export default function NewBeanScreen() {
  const router = useRouter();
  const { addBean } = useBeans();

  const handleSubmit = async (data: BeanFormValues) => {
    await addBean(beanFormToData(data));
    router.back();
  };

  return <BeanForm title="원두 추가" onBack={() => router.back()} onSubmit={handleSubmit} />;
}
