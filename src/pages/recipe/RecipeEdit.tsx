import { useNavigate, useParams } from "react-router-dom";
import { RecipeForm, type RecipeFormValues } from "../../components/RecipeForm";
import { useRecipes } from "../../hooks/useRecipes";

export default function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipes, updateRecipe } = useRecipes();
  const recipe = recipes.find((r) => r.id === id);

  if (!recipe) return null;

  const defaultValues: RecipeFormValues = {
    title: recipe.title,
    brewMethod: recipe.brewMethod,
    filterType: recipe.filterType,
    grindSize: String(recipe.grindSize),
    waterTemp: String(recipe.waterTemp),
    coffeeWeight: String(recipe.coffeeWeight),
    waterWeight: String(recipe.waterWeight),
    steps: recipe.steps.map((s) => ({
      waterAmount: String(s.waterAmount),
      duration: String(s.duration ?? 0),
      waitTime: String(s.waitTime ?? 0),
      pourMethod: s.pourMethod ?? "",
      tip: s.tip ?? "",
    })),
  };

  const handleSubmit = async (data: RecipeFormValues) => {
    await updateRecipe(id!, {
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
    });
    navigate(-1);
  };

  return (
    <RecipeForm
      title="레시피 수정"
      defaultValues={defaultValues}
      onBack={() => navigate(-1)}
      onSubmit={handleSubmit}
      submitLabel="수정 완료"
    />
  );
}
