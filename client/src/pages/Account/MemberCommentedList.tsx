import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

interface CommentedRecipeType {
  recipe_id: number;
  name: string;
  picture: string;
  comment: string;
}

function MemberCommentedList() {
  const { idUserOnline } = useUser();
  const [commented, setCommented] = useState<CommentedRecipeType[]>([]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/member/${idUserOnline}/comments`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token") || ""}`,
        },
      },
    )
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then(setCommented)
      .catch((err) => {
        console.error("Erreur lors de la récupération des commentaires :", err);
      });
  }, [idUserOnline]);

  return (
    <section className=" flex flex-col mt-5 ml-3 md:justify-around md:flex-wrap">
      {commented.map((com) => (
        <div
          key={com.recipe_id}
          className="mb-5 bg-[#f9e7cf] shadow-lg rounded-2xl px-2 border-2 border-[#e6d9be] flex items-center min-w-[260px] max-w-xs"
        >
          <img
            src={com.picture}
            alt={com.name}
            className="w-10 h-10 object-cover rounded-xl m-3"
          />

          {/* <h4 className="font-bold text-lg text-secondary mb-2 text-center">
        {com.name}
      </h4> */}

          <p className=" text-md font-semibold text-secondary m-3">
            {com.comment}
          </p>
        </div>
      ))}
    </section>
  );
}

export default MemberCommentedList;
