import type { TypeUser } from "@/types/TypeFiles";
import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

//Interface pour Children Joker du Typage
interface ContextInterface {
  children: ReactNode;
}

//Interface (variable = typage classic avec option Undefined) + SET(variable = typage React.Dispatch<React.SetStateAction<Type> | undefined)
interface UserContextValue {
  // userOnline: string; // Commented out or remove if not used elsewhere
  isConnected: boolean;
  email: string;
  password: string;
  user: TypeUser;
  isAdmin: boolean;
  idUserOnline: number | null;
  userOnline?: TypeUser; // Optional, can be undefined
  isEasterEgg: boolean;
  // setUserOnline: React.Dispatch<React.SetStateAction<string>>; // Commented out or remove if not used elsewhere
  setIsEasterEgg: React.Dispatch<React.SetStateAction<boolean>>;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  setUser: React.Dispatch<React.SetStateAction<TypeUser>>;
  setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleSubmitSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDisconnect: () => void;
  handleDeleteSelfAccount: () => void;
  handleUpdateMember: (e: React.FormEvent<HTMLFormElement>) => void;
}

// creation du context
const UserContext = createContext<UserContextValue | undefined>(undefined);

//Creation composant Provider (appliquant le context sur tout les enfants)
export function UserProvider({ children }: ContextInterface) {
  //Initialisation du State avec la conversion du LocalStorage en String.
  const [idUserOnline, setIdUserOnline] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState<TypeUser>({
    name: "",
    email: "",
    password: "",
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [userOnline, setUserOnline] = useState<TypeUser>();
  //boulean easterEgg
  const [isEasterEgg, setIsEasterEgg] = useState(false);

  // Verification du Token --------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && isConnected) {
      setIsConnected(false);
    }
  }, [isConnected]);

  ////////////Fait pas attention à ça////////////////////

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!isConnected) {
      fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token") || "",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message !== " Unauthorized") {
            setUserOnline(data);
            setIsConnected(true);
            setIdUserOnline(data.id);
            setIsAdmin(data.admin);
          } else {
            setIsConnected(false);
            setIdUserOnline(null);
            setUserOnline(undefined);
          }
        });
    }
  }, []);

  // Creation du Token -----------------------------------------

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token); // stocké en string
      setIsConnected(true);
      setIsAdmin(data.admin);
      setIdUserOnline(data.userId);

      setUserOnline(data);
      navigate("/Compte");

      // navigate("/Compte");
      window.location.reload();
    } else {
      setIsConnected(false);
      setIdUserOnline(null);
      setUserOnline(undefined);
      navigate("/Compte");
      toast.error("Identifiant ou mot de passe incorrect", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    }
  }

  async function handleSubmitSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      setIsConnected(true);
      setIdUserOnline(data.userId);
      setUserOnline(data);
      navigate("/Compte");
      toast.success("Compte créé avec succès", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  }

  // Supression Token avec bouton --------------------------------
  function handleDisconnect() {
    localStorage.removeItem("token");
    setIsConnected(false);
    setIdUserOnline(null);
    setUserOnline(undefined);
    localStorage.removeItem("currentList");
    window.location.reload();
  }

  async function handleUpdateMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token)
      return toast.warning("Non connecté", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/member`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password || undefined, // don't send empty string
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        return toast.error("Erreur lors de la mise à jour du profil", {
          style: { background: "#452a00", color: "#fde9cc" },
        });
      }
      const response = await res.json();
      setUser((prev) => ({ ...prev, ...response, password: "" }));
      toast.success("Profil mis à jour", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    } catch (err) {
      toast.warning("Erreur réseau", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
    }
  }

  async function handleDeleteSelfAccount() {
    if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?"))
      return;
    const token = localStorage.getItem("token");
    0;

    if (!token) return;
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/member/${idUserOnline}`,
        {
          method: "DELETE",
          headers: { Authorization: `${token}` },
        },
      );
      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        return toast.error("Erreur lors de la suppréssion du compte", {
          style: { background: "#452a00", color: "#fde9cc" },
        });
      }
      toast.success("Compte supprimé avec succès", {
        style: { background: "#452a00", color: "#fde9cc" },
      });
      localStorage.removeItem("token");
      setIsConnected(false);
      // Optionally redirect
      // navigate("/login");
    } catch (err) {
      alert("Erreur réseau");
    }
  }
  //return provider avec tout les UseState/ logique / fetch Applicable sur les composants ou App.tsx consommant le context
  return (
    <UserContext.Provider
      value={{
        isConnected,
        setIsConnected,
        email,
        setEmail,
        password,
        setPassword,
        handleDisconnect,
        handleSubmit,
        handleSubmitSignUp,
        handleChange,
        user,
        setUser,
        handleDeleteSelfAccount,
        handleUpdateMember,
        idUserOnline,
        isAdmin,
        setIsAdmin,
        userOnline,
        isEasterEgg,
        setIsEasterEgg,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

//creation useHook pour consommer le context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Erreur Provider");
  }
  return context;
};
