import { useUser } from "@/context/UserContext";
import type { Member } from "@/types/TypeFiles";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function MemberManage() {
  const { idUserOnline } = useUser();
  const [memberMap, setMemberMap] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  //gestion role admin
  const handleAdminToggle = async (member: Member) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${member.id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ admin: !member.admin }),
        },
      );
      if (!response.ok) throw new Error("Erreur lors de la mise à jour");
      setMemberMap((prev) =>
        prev.map((m) =>
          m.id === member.id ? { ...m, admin: !member.admin } : m,
        ),
      );
      toast.success("Statut admin mis à jour", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      setSelectedMember((prev) =>
        prev ? { ...prev, admin: !prev.admin } : prev,
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour admin", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    } finally {
      setLoading(false);
    }
  };

  //gestion des comptes
  const handleDelete = async (memberId: number) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/${idUserOnline}?idToDelete=${memberId}`,
        {
          method: "DELETE",
          headers: { Authorization: `${token}` },
        },
      );
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      setMemberMap((prev) => prev.filter((member) => member.id !== memberId));
      toast.error("Utilisateur supprimé", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      setShowDeleteModal(false);
      setShowModal(false);
      setSelectedMember(null);
    } catch (error) {
      toast.error("Suppression échouée", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    }
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/admin/member`,
          {
            headers: {
              Authorization: `${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );
        if (!response.ok)
          throw new Error("Échec de la récupération des membres");
        const data = await response.json();
        if (Array.isArray(data)) setMemberMap(data);
      } catch (error) {
        toast.error("Erreur lors de la récupération des membres", {
          style: { background: "#452a00", color: "#fde9cc" },
        });
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="bg-primary/20 rounded-xl p-4 sm:p-6 md:p-10 m-2 sm:m-4 md:m-10">
      <h2 className="pb-4 sm:pb-5 text-lg sm:text-xl font-bold">
        Gestion des membres
      </h2>
      <div className="flex flex-col gap-2">
        {memberMap.map((member) => (
          <button
            type="button"
            key={member.id}
            className="w-full text-left bg-white/80 hover:bg-primary/40 transition text-secondary rounded p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 shadow"
            onClick={() => {
              setSelectedMember(member);
              setShowModal(true);
            }}
          >
            <span className="font-semibold flex items-center gap-2 text-base sm:text-lg">
              <i className="bi bi-person-circle" />
              {member.name}
            </span>
            <span className="truncate text-xs sm:text-base text-gray-600">
              {member.email}
            </span>
            <span
              className={`ml-0 sm:ml-auto text-xs sm:text-sm font-semibold rounded px-2 py-1
          ${member.admin ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"}`}
            >
              {member.admin ? "Admin" : "Utilisateur"}
            </span>
          </button>
        ))}
      </div>

      {/* Infos membre */}
      {showModal && selectedMember && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-11/12 max-w-xs sm:max-w-sm">
            <h3 className="text-lg font-bold mb-2 text-secondary underline">
              Détail du membre
            </h3>
            <div className="mb-4">
              <div className="font-semibold text-secondary">
                {" "}
                Nom : {selectedMember.name}
              </div>
              <div className="text-secondary font-semibold">
                {" "}
                Email : {selectedMember.email}
              </div>
              <div className="text-secondary font-semibold">
                {" "}
                Membre depuis :{" "}
                {selectedMember.inscription &&
                  new Date(selectedMember.inscription).toLocaleDateString()}
              </div>
            </div>
            <div className="mb-6">
              <span className="font-semibold text-secondary">Rôle : </span>
              <span
                className={
                  selectedMember.admin ? "text-green-800" : "text-red-700"
                }
              >
                {selectedMember.admin ? "Admin" : "Utilisateur"}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className={`px-4 py-2 rounded font-semibold ${
                  selectedMember.admin
                    ? "bg-primary text-white hover:bg-primary/50"
                    : "bg-green-700 text-white hover:bg-green-600"
                }`}
                disabled={loading}
                onClick={() => handleAdminToggle(selectedMember)}
              >
                {selectedMember.admin
                  ? "Retirer le rôle admin"
                  : "Ajouter le rôle admin"}
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-red-700 text-white hover:bg-red-600 font-semibold"
                disabled={loading}
                onClick={() => setShowDeleteModal(true)}
              >
                Supprimer ce membre
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-500 font-semibold"
                onClick={() => {
                  setShowModal(false);
                  setSelectedMember(null);
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm suppression */}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-5 w-11/12 max-w-xs sm:max-w-sm">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 text-red-700">
              Confirmation
            </h3>
            <p className="mb-4 sm:mb-6 text-xs sm:text-base">
              Voulez-vous vraiment supprimer <b>{selectedMember.name}</b> ?
            </p>
            <div className="flex justify-center gap-2 sm:gap-4">
              <button
                type="button"
                className="px-3 py-2 rounded bg-gray-600 hover:bg-gray-300 text-xs sm:text-sm"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 text-xs sm:text-sm"
                onClick={() => handleDelete(selectedMember.id)}
                disabled={loading}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemberManage;
