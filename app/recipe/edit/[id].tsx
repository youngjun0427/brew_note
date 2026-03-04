import { useLocalSearchParams, useRouter } from "expo-router";
import { RecipeForm, type RecipeFormValues } from "../../../components/RecipeForm";
import { useRecipes } from "../../../hooks/useRecipes";

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
      tip: s.tip,
    })),
  };

  const handleSubmit = async (data: RecipeFormValues) => {
    await updateRecipe(id, {
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
    });
    router.back();
  };

  return (
    <RecipeForm
      title="레시피 수정"
      defaultValues={defaultValues}
      onBack={() => router.back()}
      onSubmit={handleSubmit}
      submitLabel="수정 완료"
    />
  );
}
