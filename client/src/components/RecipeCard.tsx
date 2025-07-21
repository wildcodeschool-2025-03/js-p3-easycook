import { FaStar } from "react-icons/fa";
import { FaUtensils } from "react-icons/fa6";

type Recipe = {
  id: number;
  name: string;
  picture?: string;
  description?: string;
  kcal?: number;
  time_preparation?: string | number;
  difficulty?: string;
  diet_name?: string;
  rate?: number;
};
interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

const RecipeCard = ({ recipe, onClick }: RecipeCardProps) => (
  <button
    type="button"
    className="group relative flex flex-col bg-white rounded-3xl border-2 border-[#dd682d] overflow-hidden transition-transform hover:scale-105 hover:shadow-[0_8px_32px_0_rgba(221,104,45,0.25)] w-full max-w-xs h-[480px] mx-auto"

    onClick={onClick}
    tabIndex={onClick ? 0 : undefined}
    role={onClick ? "button" : undefined}
    onKeyDown={
      onClick
        ? (e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClick();
            }
          }
        : undefined
    }
  >
    {/* Image large en haut avec overlay */}
    <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
      <img
        src={recipe.picture}
        alt={recipe.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 border-b-4 border-primary"
      />
      <div className="absolute top-2 left-2 flex gap-2 z-10">
        <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/80">
          {recipe.difficulty}
        </span>
        <span className="bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white/80">
          {recipe.diet_name}
        </span>
      </div>
      {/* Note en haut à droite */}
      <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1 shadow border border-primary">
        <FaStar className="text-yellow-400 drop-shadow" />
        <span className="text-primary font-bold text-sm">
          {recipe.rate !== undefined ? Number(recipe.rate).toFixed(1) : "-"}/5
        </span>
      </div>
    </div>
    {/* Contenu principal */}
    <div className="flex-1 flex flex-col justify-between p-4">
      <h4 className="font-extrabold text-2xl text-secondary mb-2 text-center line-clamp-2 drop-shadow">
        {recipe.name}
      </h4>
      {recipe.description && (
        <p className="text-base text-secondary/90 mb-3 text-center line-clamp-2 font-medium">
          {recipe.description}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-2 mb-2 mt-auto">
        {recipe.kcal !== undefined && (
          <span className="bg-primary/10 text-primary border border-primary rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-sm">
            🔥 {recipe.kcal} kcal
          </span>
        )}
        {recipe.time_preparation && (
          <span className="bg-primary/10 text-primary border border-primary rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1 shadow-sm">
            ⏱ {recipe.time_preparation} min
          </span>
        )}
      </div>
      <div className="flex-1" />
      {/* Bouton voir la recette aligné en bas */}
      <div className="flex items-end justify-center mt-auto">
        <button
          type="button"
          className="mt-4 mx-auto flex items-center gap-2 bg-primary text-white font-bold px-5 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
        >
          <FaUtensils className="text-lg" /> Voir la recette
        </button>
      </div>
    </div>
    {/* Effet hover : overlay coloré */}
    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl" />
  </button>
);

export default RecipeCard;
