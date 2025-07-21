import { useState } from "react";

export function useToggle() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleMenu = () => setIsOpen((open) => !open);
  return { isOpen, setIsOpen, toggleMenu };
}

export default useToggle;
