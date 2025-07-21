// import { useUser } from "@/context/UserContext";
import { useUser } from "@/context/UserContext";
import { Link } from "react-router";

function NavBar_UL() {
  const { isConnected } = useUser();

  return (
    <ul className="space-x-5 font-bold hidden md:flex lg:text-xl">
      <li className="relative group text-secondary">
        <Link to="/Recettes">Recettes</Link>
      </li>
      <span className="text-[var(--color-primary)]">|</span>
      <li className="relative group text-secondary">
        {isConnected ? (
          <Link to="/Courses">Mes courses</Link>
        ) : (
          <Link to="/Compte">Mes courses</Link>
        )}
      </li>
      <span className="text-[var(--color-primary)]">|</span>
      <li className="relative group text-secondary">
        <Link to="/A_propos">A propos</Link>
      </li>
      <span className="text-[var(--color-primary)]">|</span>
      <li className="relative group text-secondary">
        <Link to="/Mixer">Mixer</Link>
      </li>

      <li className="absolute top-1 right-2">
        {!isConnected ? (
          <Link to="/Compte">
            <img
              className="w-15 h-auto"
              src="/cook-account.png"
              alt="Account"
            />
          </Link>
        ) : (
          <Link to="/Compte">
            <img
              className="w-15 h-auto"
              src="/cook-bonjour.png"
              alt="Account"
            />
          </Link>
        )}
      </li>
    </ul>
  );
}

export default NavBar_UL;
