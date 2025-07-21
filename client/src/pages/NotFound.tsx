import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);

  // Animation de secousse sur l'image
  useEffect(() => {
    setShake(true);
    const timer = setTimeout(() => setShake(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="fixed inset-0 flex flex-col items-center justify-center bg-[#fde9cc] w-full h-full text-center p-6 z-50">
      <div className="relative">
        <img
          src="/404-easycook.png"
          alt="404 EasyCook"
          className={`w-72 md:w-96 mx-auto drop-shadow-2xl ${shake ? "shake" : ""}`}
        />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
          {/* Optionnel: overlay ou effet */}
        </div>
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold text-primary mt-8 animate-bounce">
        Oups !
      </h1>
      <p className="text-2xl md:text-3xl text-secondary mt-4 mb-2 font-semibold">
        Tu t'es perdu dans la cuisine ?
      </p>
      <p className="text-lg md:text-xl text-secondary/80 mb-8">
        Cette page n'existe pas...
        <br />
        Mais ne t'inquiète pas, le chef va te ramener à bon port !
      </p>
      <Button
        size="lg"
        className="mt-2 bg-primary text-white hover:bg-primary/90 shadow-lg px-8 py-4 text-xl rounded-full transition-all duration-200"
        onClick={() => navigate("/")}
      >
        Retour à l'accueil 🍳
      </Button>
    </section>
  );
}

export default NotFound;
