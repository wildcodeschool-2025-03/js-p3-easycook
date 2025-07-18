import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

interface Ingredient {
  name: string;
  quantity: string;
}
interface RegisteredRow {
  list_id: number;
  date_creation: string;
  recipe_id: number;
  name: string;
  picture: string;
  number_persons: number;
  ingredients: Ingredient[];
}

function MemberRegisteredList() {
  const { idUserOnline } = useUser();
  const [rows, setRows] = useState<RegisteredRow[]>([]);

  useEffect(() => {
    if (!idUserOnline) return;
    fetch(
      `${import.meta.env.VITE_API_URL}/api/member/${idUserOnline}/registeredlist`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      },
    )
      .then((res) => {
        if (!res.ok) throw new Error("404");
        return res.json() as Promise<RegisteredRow[]>;
      })
      .then(setRows)
      .catch(console.error);
  }, [idUserOnline]);

  // Groupe les recipes par list_id ( )
  const lists = rows.reduce(
    (accumulator, row) => {
      if (!accumulator[row.list_id]) accumulator[row.list_id] = [];
      accumulator[row.list_id].push(row);
      return accumulator;
    },
    {} as Record<number, RegisteredRow[]>,
  );

  return (
    <section className="grid gap-10 mt-8 lg:grid-cols-3">
      {Object.entries(lists).length > 0 ? (
        Object.entries(lists).map(([listId, recipes]) => {
          const created = recipes[0].date_creation;
          return (
            <article
              key={listId}
              className="border-2 border-primary bg-primary/10 rounded-xl p-5 shadow-md"
            >
              <header className="flex justify-between mb-4">
                <h3 className="text-xl font-semibold text-primary">
                  Liste n°{listId}
                </h3>
                <p className="text-sm text-gray-600">
                  Créée le{" "}
                  {new Date(created).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </p>
              </header>
              <main className="">
                {recipes.map((r) => (
                  <div
                    key={r.recipe_id}
                    className=" p-4 flex flex-col items-center px-4 rounded-2xl bg-primary/20 my-5"
                  >
                    <img
                      src={r.picture}
                      alt={r.name}
                      className="h-24 w-24 object-cover rounded mb-2 border"
                    />
                    <h4 className="text-lg font-bold text-secondary text-center">
                      {r.name}
                    </h4>
                    <p className="text-sm text-secondary mb-4 ">
                      Pour {r.number_persons} personne
                      {r.number_persons > 1 && "s"}
                    </p>
                    {r.ingredients && (
                      <ul className="text-sm text-secondary mb-2 w-full ">
                        {r.ingredients.map((ing) => (
                          <li
                            className="py-2 flex  justify-between"
                            key={ing.name}
                          >
                            <p>{ing.name}</p>{" "}
                            <p className="font-bold">
                              {Number(ing.quantity) * r.number_persons}
                            </p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </main>
            </article>
          );
        })
      ) : (
        <p className="text-center text-secondary">
          Vous n’avez enregistré aucune liste de courses.
        </p>
      )}
    </section>
  );
}

export default MemberRegisteredList;
