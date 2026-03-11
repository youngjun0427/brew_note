import { useNavigate } from "react-router-dom";
import { BeanForm, beanFormToData, type BeanFormValues } from "../../components/BeanForm";
import { useBeans } from "../../hooks/useBeans";

export default function BeanNewPage() {
  const navigate = useNavigate();
  const { addBean } = useBeans();

  const handleSubmit = async (data: BeanFormValues) => {
    await addBean(beanFormToData(data));
    navigate(-1);
  };

  return <BeanForm title="원두 추가" onBack={() => navigate(-1)} onSubmit={handleSubmit} />;
}
