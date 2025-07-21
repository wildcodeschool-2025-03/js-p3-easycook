import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { useNavigate } from "react-router";
import RecipeCard from "../../components/RecipeCard";

function Mixer() {
  const { isEasterEgg, setIsEasterEgg } = useUser();
  const [isInMixer, setIsInMixer] = useState(false);
  const navigate = useNavigate();
  type Ingredient = {
    ingredient_id: number;
    ingredient_name: string;
    type_name: string;
    picture: string;
  };
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [mixing, setMixing] = useState(false);
  type Recipe = {
    id: number;
    name: string;
    picture: string;
    kcal: number;
    difficulty: string;
    diet_name: string;
  };

  const mixerImg =
    selected.length === 0
      ? "/mixeur-vide.png"
      : selected.length === 1
        ? "/mixeur-1.png"
        : selected.length === 2
          ? "/mixeur-2.png"
          : selected.length === 3
            ? "/mixeur-3.png"
            : selected.length === 4
              ? "/mixeur-4.png"
              : selected.length === 5
                ? "/mixeur-5.png"
                : selected.length === 6
                  ? "/mixeur-6.png"
                  : "/mixeur-full.png";

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [openType, setOpenType] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ingredients/by-type`)
      .then((res) => res.json())
      .then(setIngredients);
  }, []);

  // Regroupe les ingré par type_name
  const grouped: { [type: string]: Ingredient[] } = {};
  for (const ing of ingredients) {
    if (!grouped[ing.type_name]) grouped[ing.type_name] = [];
    grouped[ing.type_name].push(ing);
  }

  const toggleIngredient = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name],
    );
  };

  const HandleMix = () => {
    setMixing(true);
    setTimeout(() => {
      //récupère les ID des ingrédients
      const selectedIds = ingredients
        .filter((i) => selected.includes(i.ingredient_name))
        .map((i) => i.ingredient_id);

      fetch(
        `${import.meta.env.VITE_API_URL}/api/recipe/by-ingredients?ings=${selectedIds.join(",")}`,
      )
        .then((res) => res.json())
        .then(setRecipes)
        .finally(() => setMixing(false));
    }, 2200);
  };

  function handleRecipeId(recipeId: number) {
    localStorage.setItem("recipeId", recipeId.toString());
    navigate("/Details");
  }

  function handleMixLogo() {
    if (isEasterEgg) {
      setIsEasterEgg(false);

      setMixing(true);
      document.body.style.cursor = "default";
      setTimeout(() => {
        setMixing(false);
        setIsInMixer(true);
      }, 2000);

      console.log(isInMixer);
    }
  }

  return (
    <div className="flex flex-col items-center mx-4">
      <div className="flex flex-col gap-6 mt-8 w-full max-w-5xl px-2 md:flex-row md:justify-center md:items-start">
        {/* Colonne ingrédients */}
        <div className="w-full max-w-xs bg-[#f9e7cf] rounded-2xl py-4 px-3 shadow flex flex-col border-2 border-[#2d1c0b]/10 mx-auto">
          <h2 className="text-lg font-bold text-[#2d1c0b] mb-2 px-2">
            Ingrédients
          </h2>
          {Object.entries(grouped).map(([type, ings]) => {
            const checkedCount = ings.filter((ing) =>
              selected.includes(ing.ingredient_name),
            ).length;
            return (
              <div key={type} className="mb-1">
                <button
                  type="button"
                  className={`w-full flex justify-between items-center text-left font-bold px-2 py-2 rounded transition-colors border-b border-[#2d1c0b]/20 ${
                    openType === type
                      ? "bg-[#f3d7b7] text-[#2d1c0b]"
                      : "text-[#2d1c0b] hover:bg-[#f3d7b7]"
                  }`}
                  onClick={() => setOpenType(openType === type ? null : type)}
                >
                  <span>{type}</span>
                  <span className="flex items-center gap-2">
                    {checkedCount > 0 && (
                      <span className="inline-flex items-center justify-center bg-primary text-white pl-0.5 pt-0.5  text-sm font-semibold rounded-full w-5 h-5">
                        {checkedCount}
                      </span>
                    )}
                    <span className="text-base">
                      {openType === type ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  </span>
                </button>
                {openType === type && (
                  <ul className="max-h-40 overflow-y-auto mt-1 pr-1 scrollbar-thin scrollbar-thumb-[#e0c9a6] scrollbar-track-[#f9e7cf]">
                    {ings.map((ing) => (
                      <li
                        key={ing.ingredient_id}
                        className="flex items-center py-1 px-2"
                      >
                        <input
                          type="checkbox"
                          className="accent-[#b98a4a] w-4 h-4 mr-2 rounded border border-[#b98a4a] focus:ring-2 focus:ring-[#b98a4a]"
                          checked={selected.includes(ing.ingredient_name)}
                          onChange={() => toggleIngredient(ing.ingredient_name)}
                          id={`ing-${ing.ingredient_id}`}
                        />
                        <label
                          htmlFor={`ing-${ing.ingredient_id}`}
                          className={`cursor-pointer select-none transition-colors text-[15px] ${
                            selected.includes(ing.ingredient_name)
                              ? "text-[#b98a4a] font-semibold"
                              : "text-[#2d1c0b]"
                          }`}
                        >
                          {ing.ingredient_name}
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* mixeur animée */}
        <div className="max-w-md flex flex-col items-center justify-center bg-[#f9e7cf] rounded-2xl px-3 shadow border-2 border-[#2d1c0b]/10 mx-auto mt-6 md:mt-0 pb-5 pt-8">
          <div className="relative w-[320px] h-[420px] flex justify-center items-end">
            <img
              onClick={() => handleMixLogo()}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleMixLogo();
                }
              }}
              src={mixerImg}
              alt="Mixeur"
              className={`absolute left-1/2 -translate-x-1/2 z-10 w-50 md:w-60 bottom-15 ${mixing ? "shake" : ""}`}
            />

            {/* Bouton mixage sous le mixeur */}
            <button
              type="button"
              className={`absolute left-37.5 -bottom-2 -translate-x-1/2 w-[150px] h-[60px] rounded-full bg-[#ffad54] border-2 border-[#b98a4a] flex items-center justify-center font-bold text-[#3a2209] text-xl shadow-md transition active:scale-95 z-50 ${mixing ? "opacity-70 pointer-events-none " : ""}`}
              onClick={HandleMix}
              disabled={mixing || selected.length === 0}
            >
              {mixing ? "MIXAGE" : "MIXER"}
            </button>
          </div>
        </div>
      </div>
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-4 mt-2">
          {selected.map((name) => (
            <span
              key={name}
              className="bg-[#ffe2b8] text-secondary border border-[#b98a4a] rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-2"
            >
              {name}
              <button
                type="button"
                className="ml-1 text-secondary text-xl hover:text-red-600 focus:outline-none"
                aria-label={`Retirer ${name}`}
                onClick={() => toggleIngredient(name)}
              >
                <TiDeleteOutline />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Affichage recettes */}

      <div className="w-full my-10">
        {/* Carrousel mobile */}
        <div className="block sm:hidden overflow-x-auto pb-4">
          <div
            className="flex gap-6"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {recipes.length === 0 ? (
              <p className="text-center w-full">Aucune recette</p>
            ) : (
              recipes.map((recipe) => (
                <button
                  type="button"
                  onClick={() => handleRecipeId(recipe.id)}
                  key={recipe.id}
                  className="snap-center flex-shrink-0"
                  style={{
                    minWidth: "340px",
                    maxWidth: "340px",
                  }}
                >
                  <RecipeCard recipe={recipe} />
                </button>
              ))
            )}
          </div>
        </div>
        {/* Grille tablette/desktop */}
        <div className="hidden sm:grid gap-6 justify-center sm:grid-cols-2 lg:grid-cols-3 px-4">
          {recipes.length === 0 ? (
            <p className="col-span-full text-center">Aucune recette</p>
          ) : (
            recipes.map((recipe) => (
              <RecipeCard
                onClick={() => handleRecipeId(recipe.id)}
                key={recipe.id}
                recipe={recipe}
              />
            ))
          )}
        </div>
      </div>
      {/* Fin de la section recettes */}
    </div>
  );
}

export default Mixer;
