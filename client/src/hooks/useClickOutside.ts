import { type RefObject, useEffect } from "react";
// type pour les evenements Mouse | touch natif TypeScript
type EventType = MouseEvent | TouchEvent;
export function useClickOutside<Type extends HTMLElement>(
  ref: RefObject<Type | null>,
  handler: (event: EventType) => void,
) {
  useEffect(() => {
    const listener = (event: EventType) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    // Ajoute les Listener d'événements pour les clics de souris et touches
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      // Remove les écouteurs d'événements pour éviter le debordement de memoire du Navigateur
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
