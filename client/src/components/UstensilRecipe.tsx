import type { TypeUstensil } from "@/types/TypeFiles";

function UstensilRecipe({ ustensil }: { ustensil: TypeUstensil[] | null }) {
  return (
    <section className="flex p-6 gap-4 flex-wrap justify-around">
      {ustensil?.map((ustensil) => (
        <div
          key={ustensil.ustensil_id}
          className="flex justify-around flex-col items-center "
        >
          <img
            className="w-20 h-20 rounded-full"
            src={ustensil.ustensil_picture}
            alt={ustensil.ustensil_name}
          />
          <h3>{ustensil.ustensil_name}</h3>
        </div>
      ))}
    </section>
  );
}
export default UstensilRecipe;
