import { Link } from "react-router";

function NavBar_Logo() {
  return (
    <Link to="/">
      <img src="/logo-EASY!Cook-WB.png" alt="EasyCook" className="w-30 h-15" />
    </Link>
  );
}

export default NavBar_Logo;
