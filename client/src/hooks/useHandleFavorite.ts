import { useUser } from "@/context/UserContext";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export function useHandleFavorite(recipeId: number, initialValue: boolean) {
  const { isConnected, idUserOnline } = useUser();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(initialValue);

  const toggleFavorite = useCallback(async () => {
    if (!isConnected) {
      toast.info("Vous devez être connecté pour gérer vos favoris", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      navigate("/Compte");
      return;
    }

    const nextValue = !isFavorite;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/member/favorite/recipe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token") || ""}`,
          },

          body: JSON.stringify({
            recipeId,
            userId: idUserOnline,
            is_favorite: nextValue,
          }),
        },
      );
      if (!res.ok) throw new Error();

      setIsFavorite(nextValue);
      toast.success(nextValue ? "Favori ajouté" : "Favori retiré", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    } catch {
      alert("Impossible de mettre à jour le favori.");
    }
  }, [isConnected, idUserOnline, isFavorite, navigate, recipeId]);

  return { isFavorite, toggleFavorite };
}
