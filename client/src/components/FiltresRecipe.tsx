import { useEffect, useRef, useState } from "react";

type DropdownFilterProps = {
  label: string;
  options: string[];
  onSelect: (option: string) => void;
};

export default function FiltresRecipe({
  label,
  options,
  onSelect,
}: DropdownFilterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Ferme le dropdown si on clique à l'extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="rounded-full border-2 border-secondary bg-white/70 text-secondary px-6 py-2 text-lg font-semibold shadow hover:bg-amber-100 hover:scale-105 transition-all duration-150"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        {label}
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 min-w-[180px] bg-white border border-amber-100 rounded-xl shadow-2xl z-50">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-400">Aucune option</div>
          ) : (
            <ul>
              {options.map((opt: string) => (
                <li key={opt}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-2 hover:bg-amber-50 transition"
                    onClick={() => {
                      onSelect(opt);
                      setOpen(false);
                    }}
                  >
                    {opt}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
