import { useNavigate } from "react-router-dom";
import { RecipeForm, type RecipeFormValues } from "../../components/RecipeForm";
import { useRecipes } from "../../hooks/useRecipes";

export default function RecipeNewPage() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();

  const handleSubmit = async (data: RecipeFormValues) => {
    await addRecipe({
      title: data.title,
      brewMethod: data.brewMethod,
      filterType: data.filterType,
      grindSize: Number(data.grindSize),
      waterTemp: Number(data.waterTemp),
      coffeeWeight: Number(data.coffeeWeight),
      waterWeight: Number(data.waterWeight),
      steps: data.steps.map((s, i) => ({
        order: i + 1,
        waterAmount: Number(s.waterAmount),
        duration: Number(s.duration) || 0,
        waitTime: Number(s.waitTime) || 0,
        pourMethod: s.pourMethod,
        tip: s.tip || null,
      })),
      isPublic: false,
      shareId: null,
    });
    navigate(-1);
  };

  return <RecipeForm title="새 레시피" onBack={() => navigate(-1)} onSubmit={handleSubmit} />;
}
