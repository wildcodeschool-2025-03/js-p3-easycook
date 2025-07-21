import { useUser } from "@/context/UserContext";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import type { TypeIngredient, TypeRecipe } from "@/types/TypeFiles";

interface RecipeItem {
  recipeId: number;
  userId: number;
  numberPersons: number;
}

function List() {
  const { userOnline, isConnected } = useUser();
  const [currentList, setCurrentList] = useState<RecipeItem[]>([]);
  const [recipe, setRecipe] = useState<TypeRecipe[]>([]);
  const [ingredients, setIngredients] = useState<TypeIngredient[]>([]);

  useEffect(() => {
    const localList = JSON.parse(localStorage.getItem("currentList") || "[]");

    //regrouper le nbr de personne par recette de currentList
    const recipeGroupById: RecipeItem[] = Object.values(
      localList.reduce(
        (acc: { [x: string]: { numberPersons: number } }, item: RecipeItem) => {
          if (!acc[item.recipeId]) {
            acc[item.recipeId] = { ...item }; // on crée une boîte pour cette recette
          } else {
            acc[item.recipeId].numberPersons += item.numberPersons; // on ajoute le nombre de personnes dans la boîte
          }
          return acc;
        },
        {},
      ),
    );
    //console.log("recipeGroupById", recipeGroupById);
    //map recipeGroupById pour fetch chaque recette
    const recipeToMap: TypeRecipe[] = [];
    const ingredientsToMap: TypeIngredient[] = [];
    recipeGroupById.map((item) => {
      fetch(
        `${import.meta.env.VITE_API_URL}/api/recipe/detail/${item.recipeId}`,
      )
        .then((response) => response.json())
        .then((data) => {
          data.numberPersons = item.numberPersons;
          recipeToMap.push(data);
          //console.log(recipeToMap);
          setRecipe(recipeToMap);
        });

      fetch(
        `${import.meta.env.VITE_API_URL}/api/ingredient/recipe/${item.recipeId}`,
      )
        .then((response) => response.json())
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].numberPersons = item.numberPersons;
          }
          ingredientsToMap.push(data);
          console.log(ingredientsToMap);
          const flatIngredients = ingredientsToMap.flat();
          const newIngredients: TypeIngredient[] = Object.values(
            flatIngredients.reduce(
              (acc: { [key: number]: TypeIngredient }, item) => {
                if (!acc[item.ingredient_id]) {
                  acc[item.ingredient_id] = { ...item }; // on crée une boîte pour cette recette
                } else {
                  acc[item.ingredient_id].numberPersons += item.numberPersons; // on ajoute le nombre de personnes dans la boîte
                }
                return acc;
              },
              {} as { [key: number]: TypeIngredient },
            ),
          );

          setIngredients(newIngredients);
        });
    });

    setCurrentList(recipeGroupById);
  }, []);

  async function handleValidList() {
    //console.log("currentList", currentList);
    if (currentList.length > 0 && isConnected) {
      const token = localStorage.getItem("token");
      console.log(currentList);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/member/${userOnline?.id}/list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            list: currentList,
          }),
        },
      );
      if (response.ok) {
        toast.success("Liste validée avec succès", {
          style: { background: "#452a00", color: "#fde9cc" },
        });
        // vider la liste de courses
        localStorage.removeItem("currentList");
        setCurrentList([]);
      }
    }
  }
  const printSectionRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    const printContents = printSectionRef.current?.innerHTML;
    if (!printContents) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.body.innerHTML = `
      <html>
        <head>
          <title>Liste de courses</title>
          <style>
          title{
          font-size:60px;}

            body{
              
              h3{
              font-size:12px;
              }
           }
            .ligne{ 
            margin:0 50px 0 50px;
                       
            display:flex;
            flex-direction:row;
            justify-content:space-between;
            }
       
            img {
              display:none;
            }
            
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `;
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  return (
    <>
      <h1 className="text-center my-6">Mes courses</h1>
      <section className="text-secondary">
        <h2 className="pl-4 my-4">Liste en cours</h2>

        {currentList.length > 0 ? (
          <>
            <section className="flex flex-col lg:flex-row lg:justify-center">
              <section className="flex flex-wrap gap-6 justify-center my-6 lg:flex-col lg:w-1/4 ">
                {recipe.map((item) => (
                  <article
                    className="flex flex-col items-center bg-[#f9e7cf] shadow-lg rounded-2xl p-2 border-2 border-[#e6d9be]  w-44 lg:w-60"
                    key={item.id}
                  >
                    <img
                      className="w-30 h-30 lg:w-40 lg:h-40 "
                      src={item.picture}
                      alt={item.name}
                    />
                    <h4 className="text-secondary text-xs font-bold lg:text-lg">
                      {item.name}
                    </h4>
                    <h4 className="text-secondary text-xs font-bold lg:text-lg">
                      {" "}
                      pour {item.numberPersons} personnes
                    </h4>
                  </article>
                ))}
              </section>
              <section
                ref={printSectionRef}
                className="bg-primary/20 mx-4 rounded-2xl shadow-2xl lg:w-150 relative"
              >
                <button
                  onClick={() => handlePrint()}
                  type="button"
                  className="bg-white rounded-full w-20 h-20  flex items-center justify-center  absolute -bottom-4 -right-4 cursor-pointer "
                >
                  <img
                    className=" w-14 h-14"
                    src="./printer.png"
                    alt="imprimer"
                  />
                </button>

                {ingredients.map((item) => (
                  <article
                    className="flex flex-row items-center gap-6 m-4"
                    key={item.ingredient_id}
                  >
                    <img
                      className="w-14 h-14 bg-white rounded-full m-2"
                      src={item.ingredient_picture}
                      alt={item.ingredient_name}
                    />
                    <div className="ligne">
                      <h3>{item.ingredient_name}</h3>
                      <div>
                        {item.ingredient_quantity * item.numberPersons}{" "}
                        {item.unit_name}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            </section>
            <section className="flex flex-row justify-center items-center my-8">
              <button
                onClick={() => {
                  localStorage.removeItem("currentList");
                  setCurrentList([]);
                }}
                className="btn btn-primary rounded-full m-6"
                type="button"
              >
                Annuler la liste
              </button>
              <button
                className="btn btn-primary rounded-full m-6"
                onClick={() => {
                  handleValidList();
                }}
                type="button"
              >
                Valider la liste
              </button>
            </section>
          </>
        ) : (
          <p>Pas de liste en cours</p>
        )}
      </section>
    </>
  );
}

export default List;
