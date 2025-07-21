import { useEffect, useState } from "react";

interface RatingStarsProps {
  /** Current rating to display (for read-only or controlled mode) */
  rating?: number;
  /** Callback fired when a user selects a star */
  onRate: (star: number) => void;
}

function RatingStars({ rating = 0, onRate }: RatingStarsProps) {
  const [rated, setRated] = useState<number>(rating);

  // Keep internal state in sync when rating prop changes
  useEffect(() => {
    setRated(rating);
  }, [rating]);

  const handleClick = (star: number) => {
    // Toggle off if clicking the same star
    const newRating = rated === star ? 0 : star;
    setRated(newRating);
    onRate(newRating);
  };

  return (
    <section className="flex space-x-0.5 mb-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          className={`transition transform duration-200 hover:scale-110 focus:scale-110 cursor-pointer ${
            star <= rated ? "text-yellow-300" : "text-gray-400"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill={star <= rated ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            <title>{star <= rated ? "Rated Star" : "Default Star"}</title>
          </svg>
        </button>
      ))}
    </section>
  );
}

export default RatingStars;
