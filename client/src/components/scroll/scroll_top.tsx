import { useCallback, useEffect, useState } from "react";

const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = useCallback(() => {
    setVisible(window.scrollY > 300);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [toggleVisibility]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Retour en haut"
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        color: "#452a00",
        width: "50px",
        height: "50px",
        fontSize: "50px",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      <i className="bi bi-arrow-up-circle" />
    </button>
  );
};

export default ScrollToTopButton;
