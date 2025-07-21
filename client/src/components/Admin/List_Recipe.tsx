import type { Recipe } from "@/types/TypeFiles";
import { useEffect, useState } from "react";

function recipeManage() {
  const [recipeList, setrecipeList] = useState<Recipe[]>([]);
  const handleDelete = async (recipeId: number) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/recipe/${recipeId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Si tout est ok, on enlève le membre supprimé de la liste
      setrecipeList((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error("Suppression échouée :", error);
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/recipes`)
      .then((response) => response.json())
      .then((data) => {
        setrecipeList(data);
      });
  }, []);

  return (
    <div className="bg-primary/20 rounded-xl p-10 m-10">
      <h2 className="pb-5">Gestion des recettes</h2>
      <section className="flex justify-center md:justify-start lg:justify-start">
        <button
          type="button"
          className="mb-4 p-2 px-4 cursor-pointer rounded-4xl bg-primary"
        >
          Ajouter une recette
        </button>
      </section>
      <ul>
        {recipeList.map((recipe) => (
          <li
            className="text-secondary py-2 border-t-1 border-primary"
            key={recipe.id}
          >
            <p className="py-1 font-bold">
              <i className="bi bi-egg-fried" /> {recipe.name}
            </p>
            <button
              className="py-1 cursor-pointer text-secondary"
              type="button"
              //onClick={() => handleDelete(recipe.id)}
            >
              Modifier la recette <i className="bi bi-pencil-square" />
            </button>
            <br />
            <button
              className="py-1 cursor-pointer text-red-700"
              type="button"
              onClick={() => handleDelete(recipe.id)}
            >
              Supprimer la recette <i className="bi bi-trash3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default recipeManage;
