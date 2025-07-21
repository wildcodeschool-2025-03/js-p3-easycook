import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

interface accountPageType {
  id: number;
  email: string;
  name: string;
  password: string;
  admin: boolean;
}

function MemberAccountPage() {
  const { idUserOnline, isAdmin } = useUser();
  const [profile, setProfile] = useState<accountPageType[]>([]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_API_URL}/api/member/${idUserOnline}/profile`,
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
      .then(setProfile)
      .catch((err) => {
        console.error("Erreur lors de la récupération des commentaires :", err);
      });
  }, [idUserOnline]);

  return (
    <section className="mb-6 bg-[#f9e7cf] shadow-lg rounded-2xl px-2 border-2 border-[#e6d9be] min-w-[260px] max-w-xs">
      {profile.map((pro) => (
        <article className="flex flex-col items-center" key={pro.id}>
          <h2 className="p-4 text-center">Bonjour {pro.name}</h2>
          {isAdmin ? (
            <button
              type="button"
              className="bg-green-700 px-5 py-2 mb-3 rounded-xl"
            >
              Statut : admin
            </button>
          ) : (
            <button
              type="button"
              className="bg-blue-700 px-5 py-2 mb-3 rounded-xl"
            >
              Statut : membre
            </button>
          )}
          <p className="m-5 text-center font-semibold">Email : {pro.email}</p>
        </article>
      ))}
    </section>
  );
}

export default MemberAccountPage;
