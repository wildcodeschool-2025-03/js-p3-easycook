import type { TypeRecipe } from "@/types/TypeFiles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function OurSelection() {
  const [randomRecipe, setRandomRecipe] = useState<TypeRecipe[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipe/random`)
      .then((response) => response.json())
      .then((data) => {
        setRandomRecipe(data);
      });
  }, []);

  const renderStars = (rate: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        stars.push(<span key={i}>⭐</span>);
      }
    }
    return stars;
  };

  const handleRecipeChoosed = (id: number) => {
    localStorage.setItem("recipeId", id.toString());
    navigate("/Details");
  };

  return (
    <>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 lg:pt-5 pb-12 mt-18 md:mt-22 rounded-4xl shadow-2xl border-4 border-white/20 mx-5 md:mx-10">
        <section className="flex flex-row justify-center items-center gap-2 py-2 ">
          <img className="h-20 w-20" src="/cook-pointeur.png" alt="" />
          <h2>Notre sélection</h2>
        </section>
        <section className="flex max-sm:flex-wrap sm:gap-2 justify-center gap-4 ">
          {randomRecipe.map((recipe) => (
            <button
              onClick={() => handleRecipeChoosed(recipe.id)}
              type="button"
              key={recipe.id}
              className="text-secondary flex-shrink-0 w-64 mx-5 bg-background shadow-md shadow-secondary/20 border-4 border-white/10 rounded-3xl cursor-pointer"
            >
              <img
                src={recipe.picture}
                alt=""
                className="h-40  w-40 lg:h-50 lg:w-50 m-auto "
              />
              <div className="my-2 ">{recipe.name}</div>
              <div className="flex flex-row my-2 justify-center">
                <div className="mr-10 ">{recipe.time_preparation} min</div>
                <div>{renderStars(recipe.rate)}</div>
              </div>
            </button>
          ))}
        </section>
      </div>
    </>
  );
}

export default OurSelection;
