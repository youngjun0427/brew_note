import { useRouter } from "expo-router";
import { RecipeForm, type RecipeFormValues } from "../../components/RecipeForm";
import { useRecipes } from "../../hooks/useRecipes";

export default function NewRecipeScreen() {
  const router = useRouter();
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
        tip: s.tip,
      })),
      baseRecipeId: null,
      equipmentId: null,
      isPublic: false,
      shareId: null,
    });
    router.back();
  };

  return <RecipeForm title="새 레시피" onBack={() => router.back()} onSubmit={handleSubmit} />;
}
