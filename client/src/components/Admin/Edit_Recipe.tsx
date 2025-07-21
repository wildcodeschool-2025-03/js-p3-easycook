import type {
  SelectedIngredient,
  TypeIngredient,
  TypeRecipe,
  TypeUnity,
  TypeUstensil,
} from "@/types/TypeFiles";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface EditRecipeProps {
  recipe: TypeRecipe | null;
  ingredients: TypeIngredient[];
  ustensils: TypeUstensil[];
  onClose: () => void;
  onUpdate: () => void;
}

function Edit_Recipe({
  recipe,
  ingredients,
  ustensils,
  onClose,
  onUpdate,
}: EditRecipeProps) {
  const recipeId = recipe?.id;
  const [editForm, setEditForm] = useState({
    name: recipe?.name || "",
    description: recipe?.description || "",
    time_preparation: recipe?.time_preparation || 0,
    difficulty: recipe?.difficulty || "",
    kcal: recipe?.kcal || 0,
    step1: recipe?.step1 || "",
    step2: recipe?.step2 || "",
    step3: recipe?.step3 || "",
    step4: recipe?.step4 || "",
    step5: recipe?.step5 || "",
    step6: recipe?.step6 || "",
    step7: recipe?.step7 || "",
  });
  const [allIngredients, setAllIngredients] = useState<TypeIngredient[]>([]);
  const [allUstensils, setAllUstensils] = useState<TypeUstensil[]>([]);
  const [unity, setUnity] = useState<TypeUnity[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<
    SelectedIngredient[]
  >([]);
  const [selectedUstensils, setSelectedUstensils] = useState<number[]>([]);
  const [isUstensilsOpen, setIsUstensilsOpen] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/ingredient`)
      .then((res) => res.json())
      .then((data) => setAllIngredients(data));
    fetch(`${import.meta.env.VITE_API_URL}/api/ustensil`)
      .then((res) => res.json())
      .then((data) => setAllUstensils(data));
    fetch(`${import.meta.env.VITE_API_URL}/api/unity`)
      .then((res) => res.json())
      .then((data) => setUnity(data));
  }, []);

  useEffect(() => {
    if (ingredients.length > 0) {
      setSelectedIngredients(
        ingredients.map((ing) => ({
          id: ing.ingredient_id,
          quantity: String(ing.ingredient_quantity),
          unity_id: unity.find((u) => u.name === ing.unit_name)?.id || 0,
          value: ing.unit_name,
        })),
      );
    }
    if (ustensils.length > 0) {
      setSelectedUstensils(ustensils.map((u) => u.ustensil_id || u.id));
    }
  }, [ingredients, ustensils, unity]);

  // Fonction générique pour input/textarea/select
  function handleEditChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;
    setEditForm((prev: typeof editForm) => ({ ...prev, [name]: value }));
  }
  function handleIngredientCheck(id: number, checked: boolean) {
    if (checked) {
      setSelectedIngredients((prev) => [
        ...prev,
        { id, quantity: "", unity_id: 0, value: "" },
      ]);
    } else {
      setSelectedIngredients((prev) => prev.filter((item) => item.id !== id));
    }
  }
  function handleIngredientDetailChange(
    id: number,
    field: "quantity" | "unity",
    value: string,
  ) {
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
  }
  function handleUstensilCheck(id: number, checked: boolean) {
    if (checked) {
      setSelectedUstensils((prev) => [...prev, id]);
    } else {
      setSelectedUstensils((prev) => prev.filter((u) => u !== id));
    }
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !recipeId)
      return toast.error("Non connecté !", {
        style: { background: "#452a00", color: "#fde9cc" },
      });

    // Validation stricte côté client
    if (
      !editForm.name.trim() ||
      !editForm.description.trim() ||
      !editForm.difficulty.trim() ||
      !editForm.time_preparation ||
      !editForm.kcal
    ) {
      toast.error(
        "Merci de remplir tous les champs principaux de la recette.",
        { style: { background: "#452a00", color: "#fde9cc" } },
      );
      return;
    }
    if (selectedIngredients.length === 0) {
      toast.error("Merci de sélectionner au moins un ingrédient.", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      return;
    }
    for (const ing of selectedIngredients) {
      if (!ing.quantity || Number(ing.quantity) <= 0 || !ing.unity_id) {
        toast.error(
          "Chaque ingrédient doit avoir une quantité positive et une unité.",
          { style: { background: "#452a00", color: "#fde9cc" } },
        );
        return;
      }
    }
    if (selectedUstensils.length === 0) {
      toast.error("Merci de sélectionner au moins un ustensile.", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      return;
    }

    const body = {
      ...editForm,
      ingredients: selectedIngredients,
      ustensils: selectedUstensils,
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/admin/recipe/${recipeId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      },
    );
    if (response.ok) {
      toast.success("Recette modifiée avec succès", {
        style: { background: "#dd682d", color: "#fff" },
      });
      onUpdate();
      onClose();
    } else {
      const error = await response.json().catch(() => ({}));
      toast.error(error?.message || "Erreur lors de la modification", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 overflow-auto">
      <form
        onSubmit={handleEditSubmit}
        // Formulaire principal : fond blanc, bordure orange, ombre forte, arrondi généreux
        className="relative w-full max-w-2xl bg-gray-100 border-2 border-primary shadow-2xl rounded-2xl p-0 overflow-hidden animate-fadeIn"
        style={{ maxHeight: "95vh" }}
      >
        {/* === BARRE DE TITRE STICKY === */}
        <div
          className="sticky top-0 z-10 bg-primary/90 text-white flex justify-between items-center px-6 py-4 rounded-t-2xl shadow"
          // Fond orange vif, texte blanc, arrondi haut, ombre
        >
          <h2 className="text-xl font-bold tracking-wide">
            Modifier la recette
          </h2>
          <button
            aria-label="Fermer"
            onClick={onClose}
            className="text-white hover:text-primary bg-primary hover:bg-white/80 rounded-full p-2 transition"
            type="button"
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        {/* === CONTENU DU FORMULAIRE === */}
        <div
          className="space-y-8 overflow-y-auto"
          style={{ maxHeight: "80vh" }}
        >
          {/* === SECTION INFORMATIONS PRINCIPALES === */}
          <section
            className="bg-primary/10 border border-primary/30 rounded-2xl shadow-lg p-6 m-6 space-y-6"
            // Fond légèrement orangé, bordure orange claire, ombre, arrondi, padding
          >
            <h3 className="font-bold text-lg text-primary mb-4">
              Informations principales
            </h3>
            {/* Grille responsive pour les champs principaux */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* === Champ Nom === */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="edit-name"
                  className="font-bold text-primary text-base"
                >
                  Nom
                </label>
                <input
                  id="edit-name"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  // Input : fond blanc, texte noir, bordure orange, focus orange vif, arrondi, ombre
                  className="bg-white text-black p-2 rounded-2xl border-2 border-primary focus:border-orange-600 focus:ring-2 focus:ring-orange-200 shadow-sm transition"
                  required
                />
              </div>
              {/* === Champ Temps de préparation === */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="edit-time_preparation"
                  className="font-bold text-primary text-base"
                >
                  Temps de préparation (min)
                </label>
                <input
                  id="edit-time_preparation"
                  name="time_preparation"
                  type="number"
                  value={editForm.time_preparation}
                  onChange={handleEditChange}
                  className="bg-white text-black p-2 rounded-2xl border-2 border-primary focus:border-orange-600 focus:ring-2 focus:ring-orange-200 shadow-sm transition"
                  required
                />
              </div>
              {/* === Champ Difficulté === */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="edit-difficulty"
                  className="font-bold text-primary text-base"
                >
                  Difficulté
                </label>
                <select
                  id="edit-difficulty"
                  name="difficulty"
                  value={editForm.difficulty}
                  onChange={handleEditChange}
                  className="bg-white text-black p-2 rounded-2xl border-2 border-primary focus:border-orange-600 focus:ring-2 focus:ring-orange-200 shadow-sm transition"
                  required
                >
                  <option value="">Sélectionner</option>
                  <option value="Facile">Facile</option>
                  <option value="Moyen">Moyen</option>
                  <option value="Difficile">Difficile</option>
                </select>
              </div>
              {/* === Champ Kcal === */}
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="edit-kcal"
                  className="font-bold text-primary text-base"
                >
                  Kcal
                </label>
                <input
                  id="edit-kcal"
                  name="kcal"
                  type="number"
                  value={editForm.kcal}
                  onChange={handleEditChange}
                  className="bg-white text-black p-2 rounded-2xl border-2 border-primary focus:border-orange-600 focus:ring-2 focus:ring-orange-200 shadow-sm transition"
                  required
                />
              </div>
            </div>
            {/* === Champ Description === */}
            <div className="flex flex-col gap-1 mt-4">
              <label
                htmlFor="edit-description"
                className="font-bold text-primary text-base"
              >
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                className="bg-white text-black p-2 rounded-2xl border-2 border-primary focus:border-orange-600 focus:ring-2 focus:ring-orange-200 shadow-sm transition min-h-[60px] w-full"
                required
              />
            </div>
          </section>
          {/* === FIN SECTION INFORMATIONS PRINCIPALES === */}

          {/* === SECTION ÉTAPES DE PRÉPARATION === */}
          <section className="bg-primary/10 border border-primary/30 rounded-2xl shadow-lg p-6 m-6 space-y-6 ">
            <h3 className="font-bold text-primary text-lg mb-4">
              Étapes de préparation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <label
                    htmlFor={`edit-step${i}`}
                    className="font-bold text-primary text-base"
                  >
                    {`Étape ${i}`}
                  </label>
                  <textarea
                    id={`edit-step${i}`}
                    name={`step${i}`}
                    value={
                      editForm[`step${i}` as keyof typeof editForm] as string
                    }
                    onChange={handleEditChange}
                    className="bg-white text-black p-2 rounded-2xl border-2 border-primary focus:border-orange-600 focus:ring-2 focus:ring-orange-200 shadow-sm transition min-h-[200px] w-full"
                    placeholder={`Décrivez l'étape ${i}...`}
                  />
                </div>
              ))}
            </div>
          </section>
          {/* === FIN SECTION ÉTAPES DE PRÉPARATION === */}

          {/* === SECTION INGRÉDIENTS === */}
          <section className="bg-primary/10 border border-primary/30 rounded-2xl shadow-lg p-6 m-6 space-y-6">
            <h3 className="font-bold text-primary text-lg mb-4">Ingrédients</h3>
            {/* Grille responsive d'ingrédients, cards arrondies, scrollable si trop long */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-72 overflow-y-auto pr-2">
              {allIngredients.map((ingredient) => {
                const isSelected = selectedIngredients.some(
                  (sel) => sel.id === ingredient.id,
                );
                const selectedData = selectedIngredients.find(
                  (sel) => sel.id === ingredient.id,
                );
                return (
                  <div
                    key={ingredient.id}
                    className={`flex flex-col items-start  gap-2 p-3 rounded-2xl shadow-sm border-2 transition
                                            ${
                                              isSelected
                                                ? "border-primary bg-white"
                                                : "border-gray-200 bg-gray-50"
                                            }`}
                  >
                    {/* Checkbox + label */}
                    <div className="flex items-center gap-2 w-full">
                      <input
                        type="checkbox"
                        id={`ingredient-${ingredient.id}`}
                        checked={isSelected}
                        onChange={() =>
                          handleIngredientCheck(ingredient.id, !isSelected)
                        }
                        className="accent-primary w-5 h-5"
                      />
                      <label
                        htmlFor={`ingredient-${ingredient.id}`}
                        className="flex-1 font-semibold text-black cursor-pointer"
                      >
                        {ingredient.name}
                      </label>
                    </div>
                    {/* Si sélectionné, quantité + unité en colonne sur mobile */}
                    {isSelected && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full mt-2 sm:mt-0">
                        <input
                          type="number"
                          min={0}
                          value={selectedData?.quantity || ""}
                          onChange={(e) =>
                            handleIngredientDetailChange(
                              ingredient.id,
                              "quantity",
                              e.target.value,
                            )
                          }
                          className="w-16 p-1 rounded-lg border border-primary text-black bg-white"
                          placeholder="Qté"
                        />

                        <select
                          value={selectedData?.unity_id || ""}
                          onChange={(e) =>
                            handleIngredientDetailChange(
                              ingredient.id,
                              "unity",
                              e.target.value,
                            )
                          }
                          className="p-1 rounded-lg border border-primary text-black bg-white"
                        >
                          <option value="" disabled>
                            Unité
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
            </div>
          </section>
          {/* === FIN SECTION INGRÉDIENTS === */}

          {/* Section ustensiles */}
          <section className="bg-primary/10 border border-primary/30 rounded-2xl shadow-lg p-6 m-6 space-y-6 text-secondary">
            <button
              type="button"
              className="font-bold mb-2 cursor-pointer select-none border-0 border-b-2 border-primary w-full text-left bg-transparent text-lg flex items-center justify-between"
              onClick={() => setIsUstensilsOpen((v) => !v)}
              aria-expanded={isUstensilsOpen}
            >
              <span>Ustensiles</span>
              <span className="ml-2">{isUstensilsOpen ? "▲" : "▼"}</span>
            </button>
            {isUstensilsOpen && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 max-h-40 overflow-y-auto pr-2">
                {allUstensils.map((ustensil) => (
                  <div
                    key={ustensil.id}
                    className={`flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border transition ${
                      selectedUstensils.includes(ustensil.id)
                        ? "border-primary/60"
                        : "border-transparent"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`edit-ustensil-${ustensil.id}`}
                      checked={selectedUstensils.includes(ustensil.id)}
                      onChange={(e) =>
                        handleUstensilCheck(ustensil.id, e.target.checked)
                      }
                      className="accent-primary w-5 h-5"
                    />
                    <label
                      htmlFor={`edit-ustensil-${ustensil.id}`}
                      className="flex-1 font-medium cursor-pointer"
                    >
                      {ustensil.name}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Boutons */}
          <div className="flex flex-col md:flex-row gap-4 mt-6 justify-end mb-5">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/80 text-white font-bold px-6 py-2 rounded-full shadow transition-all focus:outline-none focus:ring-2 focus:ring-primary"
            >
              Enregistrer
            </button>
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold px-6 py-2 rounded-full shadow transition-all focus:outline-none"
              onClick={onClose}
            >
              Annuler
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Edit_Recipe;
