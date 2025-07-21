import { useLocation } from "react-router";

const bannerItems: Record<string, string> = {
  "/": "/Banner_Accueil.png",
  "/Recettes": "Banner_Recettes.png",
  "/Details": "Banner_Détails.png",
  "/Courses": "Banner_Courses.png",
  "/Compte": "Banner_Membres.png",
  "/Mentions_legales": "Banner_Mentions_Legales.png",
  "/A_propos": "Banner_A_Propos.png",
  "/Mixer": "Banner_Mixer.png",
  "/Admin": "Banner_Admin.png",
  "/Contact": "Banner_Contact.png",
};

function Banner() {
  const location = useLocation();
  const bannerImg = bannerItems[location.pathname];
  return (
    <img
      src={bannerImg}
      alt="Banner"
      className="object-cover w-full h-35 md:h-50 lg:h-60"
    />
  );
}

export default Banner;
