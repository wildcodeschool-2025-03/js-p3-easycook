import type { TypeRecipe } from "@/types/TypeFiles";

function StepsRecipe({ recipe }: { recipe: TypeRecipe | null }) {
  return (
    <section className="flex flex-col p-6 gap-6">
      {recipe?.step1 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 1</h5>
      ) : null}
      <p>{recipe?.step1}</p>
      {recipe?.step2 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 2</h5>
      ) : null}
      <p>{recipe?.step2}</p>
      {recipe?.step3 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 3</h5>
      ) : null}
      <p>{recipe?.step3}</p>
      {recipe?.step4 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 4</h5>
      ) : null}
      <p>{recipe?.step4}</p>
      {recipe?.step5 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 5</h5>
      ) : null}
      <p>{recipe?.step5}</p>
      {recipe?.step6 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 6</h5>
      ) : null}
      <p>{recipe?.step6}</p>
      {recipe?.step7 ? (
        <h5 className="text-secondary font-bold text-2xl">Etape 7</h5>
      ) : null}
      <p>{recipe?.step7}</p>
    </section>
  );
}
export default StepsRecipe;
