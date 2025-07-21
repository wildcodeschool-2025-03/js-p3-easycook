// =======================
// Imports
// =======================
import Edit_Recipe from "@/components/Admin/Edit_Recipe";
import CommentRecipe from "@/components/CommentRecipe";
import RatingStars from "@/components/RatingStars";
import StepsRecipe from "@/components/StepsRecipe";
import UstensilRecipe from "@/components/UstensilRecipe";
import { useUser } from "@/context/UserContext";
import { useHandleFavorite } from "@/hooks/useHandleFavorite";
import type {
  TypeIngredient,
  TypeRecipe,
  TypeUstensil,
} from "@/types/TypeFiles";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaMinus } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// =======================
// Composant principal
// =======================
function DetailsRecipe() {
  // -----------------------
  // Hooks & constantes
  // -----------------------
  const recipeId = Number(localStorage.getItem("recipeId"));
  const { isFavorite, toggleFavorite } = useHandleFavorite(recipeId, false);
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<TypeRecipe | null>(null);
  const [ingredients, setIngredients] = useState<TypeIngredient[]>([]);
  const [ustensils, setUstensils] = useState<TypeUstensil[]>([]);
  const [numberPersons, setNumberPersons] = useState<number>(1);
  const [rate, setRate] = useState<number>(0);
  const [comments, setComments] = useState<{ text: string; member: string }[]>(
    [],
  );
  const { isConnected, idUserOnline, isAdmin } = useUser();
  const [showEdit, setShowEdit] = useState(false);

  // -----------------------
  // Effets de chargement
  // -----------------------
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/recipe/detail/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        setRecipe(data);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/ingredient/recipe/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        setIngredients(data);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/ustensil/recipe/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        setUstensils(data);
      });
    fetch(`${import.meta.env.VITE_API_URL}/api/rate/recipe/${recipeId}`)
      .then((response) => response.json())
      .then((data) => {
        setRate(data.rate);
        setComments(data.comments);
      });
  }, [recipeId]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  // -----------------------
  // Fonctions utilitaires
  // -----------------------
  function handleLess() {
    if (numberPersons > 1) {
      setNumberPersons(numberPersons - 1);
    } else {
      setNumberPersons(1);
    }
  }

  function handleUserRate(rate: number) {
    if (!isConnected) {
      toast.error("Vous devez être connecté pour ajouter une note", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      navigate("/Compte");
    } else {
      fetch(`${import.meta.env.VITE_API_URL}/api/member/rate/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          recipeId,
          userId: idUserOnline,
          rate: rate,
        }),
      }).then((response) => {
        if (response.ok) {
          toast.success("Note ajoutée avec succès", {
            style: { background: "#452a00", color: "#fde9cc" },
          });
        } else {
          toast.error("Erreur lors de l'ajout de la note", {
            style: { background: "#452a00", color: "#fde9cc" },
          });
        }
      });
    }
  }

  function handleShopping(recipeId: number, numberPersons: number) {
    if (!isConnected) {
      toast.warning(
        "Vous devez être connecté pour ajouter des ingrédients à votre liste de courses",
        {
          style: { background: "#452a00", color: "#fde9cc" },
        },
      );
      navigate("/Compte");
    } else {
      const currentList = JSON.parse(
        localStorage.getItem("currentList") || "[]",
      );
      const thisRecipePersonns = {
        recipeId: recipeId,
        userId: idUserOnline,
        numberPersons: numberPersons,
      };
      currentList.push(thisRecipePersonns);
      localStorage.setItem("currentList", JSON.stringify(currentList));
      toast.success("Votre liste de courses est bien mise à jour", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    }
  }

  const renderStars = (rate: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rate) {
        stars.push(<span key={i}>⭐</span>);
      }
    }
    return stars;
  };

  // =======================
  // Rendu mobile
  // =======================
  const renderMobile = () => (
    <section className="min-lg:hidden pb-16">
      {/* Formulaire d'édition */}
      {showEdit && (
        <Edit_Recipe
          recipe={recipe}
          ingredients={ingredients}
          ustensils={ustensils}
          onClose={() => setShowEdit(false)}
          onUpdate={() => {}}
        />
      )}
      {/* Image et titre */}
      <img
        className="h-62 absolute top-20 left-1/2 transform -translate-x-1/2 z-1"
        src={recipe?.picture}
        alt={recipe?.name}
      />
      <h2 className="p-8 pt-35 text-3xl font-extrabold text-primary text-center tracking-wide">
        {recipe?.name} {renderStars(rate)}
      </h2>
      {/* Bloc infos recette */}
      <section className="flex flex-col gap-2 m-4">
        <div className="flex justify-around gap-2">
          <article className="flex items-center bg-primary/20 rounded-xl shadow px-4 py-3">
            <img
              className="w-10 h-10 md:w-14 md:h-14"
              src="/horlogeIcone.png"
              alt="durée"
            />
            <span className="ml-2 text-lg font-bold text-primary">
              {recipe?.time_preparation} min
            </span>
          </article>
          <article className="flex items-center bg-secondary/20 rounded-xl shadow px-4 py-3 font-bold">
            <button
              type="button"
              onClick={toggleFavorite}
              className="flex items-center space-x-1 text-primary hover:text-red-500 transition-colors font-bold"
            >
              {/* Affichage du bouton favori */}
              {isFavorite ? (
                <span className="flex items-center gap-1">
                  Favori <FaHeart size={20} color="red" />
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  Favori <FaRegHeart size={20} />
                </span>
              )}
            </button>
          </article>
          {isAdmin && (
            <div className="flex items-center bg-secondary/20 rounded-xl shadow px-1 py-3">
              <button onClick={() => setShowEdit((v) => !v)} type="button">
                Modifier recette
              </button>
            </div>
          )}
        </div>
        <article className="flex justify-center items-center bg-green-400/10 rounded-xl shadow px-4 py-3 mt-2">
          <img
            className="w-10 h-10 md:w-14 md:h-14"
            src="/torseIcone.png"
            alt="personnes"
          />
          <div className="bg-white h-8 md:h-10 min-w-[250px] md:min-w-[224px] rounded-2xl border-2 border-secondary flex items-center justify-between px-2 md:px-4 mx-2">
            <button
              type="button"
              onClick={handleLess}
              className="p-1 bg-primary/70 rounded-full"
            >
              <FaMinus />
            </button>
            <span className="text-sm md:text-base text-black">
              {numberPersons} personnes
            </span>
            <button
              type="button"
              onClick={() => setNumberPersons((n) => n + 1)}
              className="p-1 bg-primary/70 rounded-full"
            >
              <IoMdAdd />
            </button>
          </div>
        </article>
      </section>
      {/* Séparateur */}
      <hr className="my-6 border-primary/30" />
      {/* Bloc ingrédients */}
      <section className="bg-primary/20 rounded-2xl shadow p-4 m-4 mb-6 ">
        <div className="flex items-center mb-4">
          <span className="inline-block w-1.5 h-7 bg-primary rounded-2xl mr-3" />
          <h3 className="text-lg font-bold text-primary uppercase tracking-wide">
            Ingrédients
          </h3>
        </div>
        <ul className="divide-y divide-primary/10">
          {ingredients?.map((ing) => (
            <li
              key={ing.ingredient_id}
              className="flex items-center justify-between py-3"
            >
              <div className="flex items-center gap-4 ">
                <img
                  className="w-12 h-12 bg-white rounded-2xl border border-primary/20"
                  src={ing.ingredient_picture}
                  alt={ing.ingredient_name}
                />
                <span className="font-medium text-primary">
                  {ing.ingredient_name}
                </span>
              </div>
              <span className="items-center justify-center rounded-xl text-secondary font-bold text-lg">
                {ing.ingredient_quantity * numberPersons}
                {ing.unit_name}
              </span>
            </li>
          ))}
        </ul>
      </section>
      {/* Bouton ajouter à la liste */}
      <div className="flex justify-center">
        <button
          onClick={() => handleShopping(recipeId, numberPersons)}
          type="button"
          className="bg-primary text-white font-semibold px-6 py-3 rounded-full shadow hover:bg-primary/90 transition-colors flex items-center gap-2 text-base"
        >
          <img src="/caddy.png" alt="caddy" className="w-7 h-7" />
          Ajouter à la liste
        </button>
      </div>
      {/* Ustensiles */}
      <section className="bg-secondary/20 rounded-2xl shadow p-4 m-4 mb-6">
        <div className="flex items-center mb-4">
          <span className="inline-block w-1.5 h-7 bg-secondary rounded-2xl mr-3" />
          <h4 className="text-lg font-bold text-secondary uppercase tracking-wide">
            Ustensiles
          </h4>
        </div>
        <UstensilRecipe ustensil={ustensils} />
      </section>
      {/* Préparation */}
      <section className="bg-green-400/10 rounded-2xl shadow p-4 m-4 mb-6">
        <div className="flex items-center mb-4">
          <span className="inline-block w-1.5 h-7 bg-green-400 rounded-2xl mr-3" />
          <h4 className="text-lg font-bold text-green-400 uppercase tracking-wide">
            Préparation
          </h4>
        </div>
        <StepsRecipe recipe={recipe} />
      </section>
      {/* Bloc avis et notation */}
      <section className="bg-primary/20 rounded-2xl shadow p-4 m-4 mb-6">
        <div className="flex items-center justify-center mb-4">
          <span className="inline-block w-1.5 h-7 bg-primary rounded-2xl mr-3" />
          <p className="text-lg font-bold text-primary uppercase tracking-wide">
            Donnez votre avis
          </p>
        </div>
        <div className="flex items-center mb-4 justify-center">
          <img
            className="h-12 w-12 mr-2"
            src="/cook-bonjour.png"
            alt="logo qui donne une note"
          />
          <RatingStars onRate={handleUserRate} rating={rate} />
        </div>
        <div className="rounded-xl p-3 mt-2">
          <CommentRecipe comments={comments} />
        </div>
      </section>
    </section>
  );

  // =======================
  // Rendu desktop
  // =======================
  const renderDesktop = () => (
    <section className="max-lg:hidden flex justify-center bg-primary/10 py-12 px-4">
      <div className="flex flex-row gap-6 w-full max-w-5xl">
        {/* Colonne principale */}
        <div className="flex-1 min-w-0">
          <img
            className="h-80 absolute top-24 left-1/2 transform -translate-x-1/2 z-1"
            src={recipe?.picture}
            alt={recipe?.name}
          />
          <h5 className="p-8 mt-8 ml-70 text-2xl font-extrabold text-primary text-center ">
            {recipe?.name} <br /> {renderStars(rate)}
          </h5>
          {/* --- Bloc infos recette --- */}
          <section className="flex text-secondary ml-50 gap-4">
            <article className="flex items-center bg-primary/20 rounded-xl shadow px-6 py-4 mr-2 min-w-[180px]">
              <img
                className="w-14 h-14"
                src="/horlogeIcone.png"
                alt="icone d'horloge"
              />
              <span className="text-lg font-bold ml-2 text-primary">
                {recipe?.time_preparation} min
              </span>
            </article>
            <article className="flex items-center bg-secondary/20 rounded-xl shadow px-6 py-4 min-w-[220px]">
              <img
                className="w-14 h-14"
                src="/torseIcone.png"
                alt="icone de torse"
              />
              <div className="bg-white h-10 min-w-56 rounded-2xl border-2 border-secondary flex items-center justify-center m-auto ">
                <button
                  onClick={() => handleLess()}
                  type="button"
                  className="cursor-pointer hover:bg-primary/10 rounded-full"
                >
                  <img
                    className="w-8 h-8"
                    src="/moins.png"
                    alt="soustraire une personne"
                  />
                </button>
                <span className="px-4 ">{numberPersons} personne(s)</span>
                <button
                  onClick={() => setNumberPersons(numberPersons + 1)}
                  type="button"
                  className="cursor-pointer hover:bg-primary/10 rounded-full"
                >
                  <img
                    className="w-8 h-8"
                    src="/ajouter.png"
                    alt="ajouter une personne"
                  />
                </button>
              </div>
            </article>
          </section>

          {/* Séparateur */}
          <hr className="my-9 border-primary/60 flex" />

          {/*================================ Bloc Ingrédients / Ustensiles / Préparation ================================*/}

          <section className="w-full flex justify-center mx-35 items-start mb-20">
            <div className="flex flex-row justify-center items-stretch w-full max-w-7xl gap-10">
              {/* Colonne Ingrédients & Ustensiles */}
              <div className="flex flex-col flex-shrink-0 w-full max-w-md gap-8">
                {/* Ingrédients */}
                <article className="bg-primary/20 rounded-2xl shadow p-6">
                  <div className="flex items-center mb-4">
                    <span className="inline-block w-1.5 h-7 bg-primary rounded-2xl mr-3" />
                    <h3 className="text-lg font-bold text-primary uppercase tracking-wide">
                      Ingrédients
                    </h3>
                  </div>
                  {ingredients?.map((ingredient) => (
                    <div
                      key={ingredient.ingredient_id}
                      className="flex justify-between m-4 p-2 rounded-lg"
                    >
                      <div className="flex gap-4 items-center">
                        <img
                          className="w-14 h-14 bg-white rounded-xl border border-primary/20"
                          src={ingredient.ingredient_picture}
                          alt={ingredient.ingredient_name}
                        />
                        <h3 className="text-primary">
                          {ingredient.ingredient_name}
                        </h3>
                      </div>
                      <span className="inline-flex items-center justify-center p-1.5 rounded-xl text-white font-extrabold text-lg">
                        {ingredient.ingredient_quantity * numberPersons}
                        {ingredient.unit_name}
                      </span>
                    </div>
                  ))}
                </article>
                {/* Ustensiles */}
                <article className="bg-secondary/20 rounded-2xl shadow p-6">
                  <div className="flex items-center mb-4">
                    <span className="inline-block w-1.5 h-7 bg-secondary rounded-full mr-3" />
                    <h4 className="text-lg font-bold text-secondary uppercase tracking-wide">
                      Ustensiles
                    </h4>
                  </div>
                  <UstensilRecipe ustensil={ustensils} />
                </article>
              </div>
              {/* Bloc Préparation, plus large et centré */}
              <div className="flex-1 flex flex-col justify-start bg-green-400/10 rounded-2xl shadow p-10 min-w-[600px] max-w-4xl mx-auto">
                <div className="flex items-center mb-4">
                  <span className="inline-block w-1.5 h-7 bg-green-400 rounded-full mr-3" />
                  <h3 className="text-lg font-bold text-green-400 uppercase tracking-wide">
                    Préparation
                  </h3>
                </div>
                <StepsRecipe recipe={recipe} />
              </div>
            </div>
          </section>

          <section className="bg-primary/20 rounded-2xl shadow p-4 m-4 mb-6 ml-30 -mr-50 z-10">
            <div className="flex items-center justify-center mb-4">
              <span className="inline-block w-1.5 h-7 bg-primary rounded-2xl mr-3" />
              <p className="text-lg font-bold text-primary uppercase tracking-wide">
                Donnez votre avis
              </p>
            </div>
            <div className="flex items-center mb-4 justify-center">
              <img
                className="h-12 w-12 mr-2"
                src="/cook-bonjour.png"
                alt="logo qui donne une note"
              />
              <RatingStars onRate={handleUserRate} rating={rate} />
            </div>
            <div className="rounded-xl p-3 mt-2">
              <CommentRecipe comments={comments} />
            </div>
          </section>
        </div>

        {/* Colonne actions à droite, largeur réduite et bien espacée */}
        <div
          className={`flex flex-col gap-2 w-64 ${isAdmin ? "pt-25" : "pt-38"}`}
        >
          {/* Formulaire d'édition */}
          {showEdit && (
            <Edit_Recipe
              recipe={recipe}
              ingredients={ingredients}
              ustensils={ustensils}
              onClose={() => setShowEdit(false)}
              onUpdate={() => {}}
            />
          )}
          {/* Bouton Modifier visible uniquement pour les admins */}
          {isAdmin && (
            <button
              onClick={() => setShowEdit((v) => !v)}
              type="button"
              className="bg-green-400 text-white font-semibold px-6 py-4 rounded-full shadow hover:bg-green-500 transition-colors flex items-center gap-2 text-base"
            >
              <MdModeEdit /> Modifier
            </button>
          )}

          <button
            onClick={() => handleShopping(recipeId, numberPersons)}
            type="button"
            className="bg-primary text-white font-semibold px-6 py-4 rounded-full shadow hover:bg-primary/90 transition-colors flex items-center gap-2 text-base"
          >
            <img src="/caddy.png" alt="caddy" className="w-7 h-7" />
            Ajouter à la liste
          </button>

          <button
            onClick={toggleFavorite}
            type="button"
            className={`bg-secondary text-white font-semibold px-6 py-4 rounded-full shadow hover:bg-secondary/90 transition-colors flex items-center gap-2 text-base ${isFavorite ? "ring-5 ring-red-400 bg-red-400" : ""}`}
          >
            <FaHeart /> Favori
          </button>
        </div>
      </div>
    </section>
  );

  // =======================
  // Rendu principal
  // =======================
  return (
    <div className="bg-primary/10 min-h-screen w-full">
      {renderMobile()}
      {renderDesktop()}
    </div>
  );
}

export default DetailsRecipe;
