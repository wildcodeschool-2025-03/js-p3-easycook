import { useUser } from "@/context/UserContext";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface CommentInterface {
  text: string;
  member: string;
}

function CommentRecipe({ comments }: { comments: CommentInterface[] }) {
  const navigate = useNavigate();
  const [commentText, setCommentText] = useState<string>("");
  const { isConnected, idUserOnline } = useUser();

  function handleSubmitComment(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default form submission
    e.preventDefault();
    if (!isConnected) {
      toast.error("Vous devez être connecté pour ajouter un commentaire", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      navigate("/Compte");
    } else {
      //update or create comment with recipeId, userId
      const recipeId = Number(localStorage.getItem("recipeId"));
      const userId = idUserOnline;
      //creer la donnée a faire passer dans la requete
      const commentData = {
        text: commentText,
        recipeId: recipeId,
        userId: userId,
      };
      //fetch pour poster la donnée dans la requete
      fetch(`${import.meta.env.VITE_API_URL}/api/member/comment/recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify(commentData),
      }).then((response) => {
        if (response.ok) {
          toast.success("Commentaire ajouté avec succès", {
            style: { background: "#452a00", color: "#fde9cc" },
          });
          window.location.reload();
        } else {
          // Handle error
          toast.error("Erreur lors de l'ajout du commentaire", {
            style: { background: "#452a00", color: "#fde9cc" },
          });
        }
      });
    }
  }

  return (
    <section className="w-full mx-4 ">
      <h4 className="text-xl text-secondary text-center">Commentaires</h4>
      <ul className="text-secondary">
        {comments
          .filter((comment) => comment.text)
          .map((comment) => (
            <li
              className="bg-primary/80 -ml-8 md:ml-0  max-w-90 p-2  rounded  my-4"
              key={`${comment.member}-${comment.text}`}
            >
              {`${comment.member}: ${comment.text}`}
            </li>
          ))}
      </ul>
      <form
        onSubmit={(e) => handleSubmitComment(e)}
        className="flex-col text-secondary "
      >
        <textarea
          onChange={(e) => setCommentText(e.target.value)}
          style={{ resize: "none" }}
          maxLength={100}
          minLength={5}
          className="w-70 md:w-xl p-2 border rounded"
          placeholder="Ajouter un commentaire..."
          rows={3}
        />

        <button
          type="submit"
          className="mt-2 bg-primary flex justify-center mx-auto text-white px-4 py-2 rounded-full w-28 cursor-pointer "
        >
          Envoyer
        </button>
      </form>
    </section>
  );
}

export default CommentRecipe;
