// Composant modernisé : Recettes par catégories
import type { TypeRecipe } from "@/types/TypeFiles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function AccueilCategory() {
  const [categoryRecipe, setCategoryRecipe] = useState<TypeRecipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/accueil/category`)
      .then((response) => response.json())
      .then((data) => {
        setCategoryRecipe(data);
      });
  }, []);

  const handleCategoryChoosed = (categoryName: string) => {
    localStorage.setItem("selectedCategory", categoryName);
    navigate("/Recettes");
  };

  return (
    <section className="relative min-h-90 bg-gradient-to-br from-primary/10 to-secondary/10 mx-4 md:mx-9 rounded-4xl shadow-2xl border-4 border-white/20 overflow-hidden animate-fade-in mb-10 pb-8 pt-5">
      {/* Titre principal */}
      <h2 className="text-center text-3xl md:text-4xl font-extrabold text-primary mb-10 drop-shadow">
        Recettes par catégories
      </h2>
      {/* Grille de catégories */}
      <div className="flex flex-wrap justify-center gap-10 md:gap-16">
        {categoryRecipe.map((recipe) => (
          <button
            type="button"
            key={recipe.id}
            onClick={() => handleCategoryChoosed(recipe.name)}
            className="relative w-72 h-56 bg-white/90 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center justify-end transition-transform hover:scale-105 hover:shadow-2xl group animate-fade-in-up"
          >
            {/* Image de fond floutée */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xs scale-110 group-hover:blur-sm transition-all duration-300"
              style={{ backgroundImage: `url(${recipe.picture})` }}
            />
            {/* Overlay coloré */}
            <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-all duration-300" />

            {/* Nom de la catégorie */}
            <div className="relative z-10 w-full flex flex-col items-center justify-end pb-6">
              <h4 className="text-white text-2xl font-semibold text-center bg-primary/60 w-full py-2  shadow-lg mb-2 drop-shadow-lg">
                {recipe.name}
              </h4>
              {/* Description courte (exemple générique) */}
              <span className="text-sec font-semibold text-center px-2 pb-2">
                Découvrez toutes les recettes de la catégorie{" "}
                {recipe.name.toLowerCase()} !
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default AccueilCategory;
