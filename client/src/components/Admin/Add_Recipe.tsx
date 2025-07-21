import type {
  FormData,
  SelectedIngredient,
  TypeCategory,
  TypeDiet,
  TypeIngredient,
  TypeUnity,
  TypeUstensil,
} from "@/types/TypeFiles";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function CreateRecipe() {
  //contient toutes les données du formulaire de la recette et initialise avec un objet vide
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    time_preparation: "",
    difficulty: "",
    kcal: "",
    id_category: "",
    id_diet: "",
    step1: "",
    step2: "",
    step3: "",
    step4: "",
    step5: "",
    step6: "",
    step7: "",
  });
  const [ingredients, setIngredients] = useState<TypeIngredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [categories, setCategories] = useState<TypeCategory[]>([]);
  const [diets, setDiets] = useState<TypeDiet[]>([]);
  const [unity, setUnity] = useState<TypeUnity[]>([]);
  const [isIngredientsOpen, setIsIngredientsOpen] = useState(false);
  const [ustensils, setUstensils] = useState<TypeUstensil[]>([]);
  const [selectedUstensils, setSelectedUstensils] = useState<TypeUstensil[]>(
    [],
  );
  const [isUstensilsOpen, setIsUstensilsOpen] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ingredient`)
      .then((res) => res.json())
      .then((data) => setIngredients(data))
      .catch(() => {});

    fetch(`${import.meta.env.VITE_API_URL}/api/category`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => {});

    fetch(`${import.meta.env.VITE_API_URL}/api/diet`)
      .then((res) => res.json())
      .then((data) => setDiets(data))
      .catch(() => {});

    fetch(`${import.meta.env.VITE_API_URL}/api/unity`)
      .then((res) => res.json())
      .then((data) => setUnity(data))
      .catch(() => {});

    fetch(`${import.meta.env.VITE_API_URL}/api/ustensil`)
      .then((res) => res.json())
      .then((data) => setUstensils(data))
      .catch(() => {});
  }, []);
  //Gère les changements dans les champs du formulaire (input, textearea, select)
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    //Récupère le name et la value et met à jour l'état FormData
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //fonction pour gérer la sélection d'un ingrédient (checkbox)
  const handleIngredientCheck = (id: number, checked: boolean) => {
    if (checked) {
      //fonction de mise à jour du state : prev représente l'ancienne valeur du state selectedIngredients, c’est-à-dire un tableau d’objets ingrédients déjà sélectionnés et ...prev: c’est la destructuration de ce tableau. Les ... (spread operator) servent à copier tous les éléments déjà présents dans prev dans un nouveau tableau.
      setSelectedIngredients((prev) => [
        ...prev,
        { id, quantity: "", unity_id: 0, value: "" },
      ]);
    } else {
      setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleIngredientDetailChange = (
    id: number,
    field: "quantity" | "unity",
    value: string,
  ) => {
    setSelectedIngredients((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "quantity") {
          return { ...item, quantity: value };
        }

        return {
          ...item,
          unity_id: Number.parseInt(value),
          value: String(
            unity.find((u) => u.id === Number.parseInt(value))?.value || "",
          ),
        };
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/recipe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          recipe: {
            ...formData,
            time_preparation: Number.parseInt(formData.time_preparation),
            kcal: Number.parseInt(formData.kcal),
            id_category: Number.parseInt(formData.id_category),
            id_diet: Number.parseInt(formData.id_diet),
          },
          ingredients: selectedIngredients,
          ustensils: selectedUstensils.map((u) => u.id), // envoie uniquement les IDs
        }),
      },
    );

    const data = await response.json();
    const recipeId = data?.id;

    // Ajout des ustensiles liés à la recette
    if (recipeId && selectedUstensils.length > 0) {
      await fetch(`${import.meta.env.VITE_API_URL}/api/ustensil/${recipeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ustensils: selectedUstensils }),
      });
    }

    toast.success("Recette enregistrée avec succès", {
      style: { background: "#452a00", color: "#fde9cc" },
    });
    setFormData({
      name: "",
      description: "",
      time_preparation: "",
      difficulty: "",
      kcal: "",
      id_category: "",
      id_diet: "",
      step1: "",
      step2: "",
      step3: "",
      step4: "",
      step5: "",
      step6: "",
      step7: "",
    });
    setSelectedIngredients([]);
    setSelectedUstensils([]);
  };

  return (
    <div className="bg-primary/20 text-secondary rounded-xl m-2 p-4 lg:mx-50 lg:my-10 md:mx-10 md:my-10">
      <h2 className="mb-10 text-center">Ajouter une nouvelle recette :</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="name"
          >
            <i className="bi bi-pencil-square" /> Nom de la recette *
          </label>
          <input
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            type="text"
            id="name"
            name="name"
            required
            onChange={handleChange}
            value={formData.name}
          />
        </div>

        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="time_preparation"
          >
            <i className="bi bi-stopwatch" /> Temps de préparation* (en min)
          </label>
          <textarea
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            id="time_preparation"
            name="time_preparation"
            required
            onChange={handleChange}
            value={formData.time_preparation}
          />
        </div>

        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="description"
          >
            <i className="bi bi-book" /> Description *
          </label>
          <textarea
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            id="description"
            name="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
        </div>

        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="difficulty"
          >
            <i className="bi bi-bar-chart-steps" /> Difficulté *
          </label>
          <select
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            id="difficulty"
            name="difficulty"
            required
            onChange={handleChange}
            value={formData.difficulty}
          >
            <option value="" disabled>
              Choisir
            </option>
            <option value="Facile">Facile</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Difficile">Difficile</option>
          </select>
        </div>

        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="kcal"
          >
            <i className="bi bi-cup-straw" /> Calories *
          </label>
          <textarea
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            id="kcal"
            name="kcal"
            required
            onChange={handleChange}
            value={formData.kcal}
          />
        </div>

        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="id_category"
          >
            <i className="bi bi-tag" /> Catégorie *
          </label>
          <select
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            id="id_category"
            name="id_category"
            required
            onChange={handleChange}
            value={formData.id_category}
          >
            <option value="" disabled>
              Choisir
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-10">
          <label
            className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            htmlFor="id_diet"
          >
            <i className="bi bi-egg-fried" /> Régime *
          </label>
          <select
            className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
            id="id_diet"
            name="id_diet"
            required
            onChange={handleChange}
            value={formData.id_diet}
          >
            <option value="" disabled>
              Choisir
            </option>
            {diets.map((diet) => (
              <option key={diet.id} value={diet.id}>
                {diet.name} {diet["Sans Gluten"] ? "(Sans Gluten)" : ""}
              </option>
            ))}
          </select>
        </div>

        {[...Array(7)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div className="mb-10" key={i}>
            <label
              className="block pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
              htmlFor={`step${i + 1}`}
            >
              <i className="bi bi-check-lg" /> Étape {i + 1}
              {i === 0 ? " *" : ""}
            </label>
            <textarea
              className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
              id={`step${i + 1}`}
              name={`step${i + 1}`}
              required={i === 0}
              onChange={handleChange}
              value={formData[`step${i + 1}` as keyof FormData]}
            />
          </div>
        ))}

        <fieldset className="mb-10">
          <legend
            className="pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            onClick={() => setIsIngredientsOpen(!isIngredientsOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsIngredientsOpen((open) => !open);
              }
            }}
          >
            <i className="bi bi-mouse2" /> Ingrédients *
            <span className="ml-2">
              {isIngredientsOpen ? (
                <i className="bi bi-caret-up-fill" />
              ) : (
                <i className="bi bi-caret-down-fill" />
              )}
            </span>
          </legend>

          {isIngredientsOpen &&
            ingredients.map((ingredient) => {
              const selected = selectedIngredients.find(
                (item) => item.id === ingredient.id,
              );
              return (
                <div key={ingredient.id} className="mb-4">
                  <input
                    type="checkbox"
                    id={`ingredient-${ingredient.id}`}
                    onChange={(e) =>
                      handleIngredientCheck(ingredient.id, e.target.checked)
                    }
                    checked={selectedIngredients.some(
                      (item) => item.id === ingredient.id,
                    )}
                  />
                  <label
                    className="pl-3"
                    htmlFor={`ingredient-${ingredient.id}`}
                  >
                    {ingredient.name}
                  </label>

                  {selected && (
                    <div className="mt-2 flex flex-col gap-2 items-center font-">
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={selected.quantity}
                        onChange={(e) =>
                          handleIngredientDetailChange(
                            ingredient.id,
                            "quantity",
                            e.target.value,
                          )
                        }
                        required
                        className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
                      />
                      <select
                        id={`unity-${ingredient.id}`}
                        name={"`unity-${ingredient.id}`"}
                        required
                        value={selected.unity_id || ""}
                        onChange={(e) =>
                          handleIngredientDetailChange(
                            ingredient.id,
                            "unity",
                            e.target.value,
                          )
                        }
                        className="mt-3 w-full border-1 rounded-xl border-primary/50 bg-[#fde9cc] p-3"
                      >
                        <option value="" disabled>
                          Choisir une unité de mesure
                        </option>
                        {unity.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
        </fieldset>
        <fieldset className="mb-10">
          <legend
            className="pr-4 font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full"
            onClick={() => setIsUstensilsOpen(!isUstensilsOpen)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsUstensilsOpen((open) => !open);
              }
            }}
          >
            <i className="bi bi-tools" /> Ustensiles *
            <span className="ml-2">
              {isUstensilsOpen ? (
                <i className="bi bi-caret-up-fill" />
              ) : (
                <i className="bi bi-caret-down-fill" />
              )}
            </span>
          </legend>

          {isUstensilsOpen &&
            ustensils.map((ustensil) => {
              const selected = selectedUstensils.find(
                (u) => u.id === ustensil.id,
              );
              return (
                <div key={ustensil.id} className="mb-4">
                  <input
                    type="checkbox"
                    id={`ustensil-${ustensil.id}`}
                    checked={!!selected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUstensils((prev) => [...prev, ustensil]);
                      } else {
                        setSelectedUstensils((prev) =>
                          prev.filter((u) => u.id !== ustensil.id),
                        );
                      }
                    }}
                  />
                  <label className="pl-3" htmlFor={`ustensil-${ustensil.id}`}>
                    {ustensil.name}
                  </label>
                </div>
              );
            })}
        </fieldset>

        <section className="flex justify-center md:justify-start lg:justify-start">
          <button
            className="mb-4 p-2 px-4 cursor-pointer rounded-4xl bg-primary font-bold text-white"
            type="submit"
          >
            Ajouter la recette
          </button>
        </section>
      </form>
    </div>
  );
}

export default CreateRecipe;
