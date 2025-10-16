"use client";

import { StarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

interface StarRatingProps {
  value?: number;
  onChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function StarRating({
  value = 0,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || value;

  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayRating;

        return (
          <button
            key={star}
            type="button"
            className={`transition-colors ${
              readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
            }`}
            onClick={() => handleClick(star)}
            onMouseEnter={() => handleMouseEnter(star)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
          >
            {isFilled ? (
              <StarIcon
                className={`${sizeClasses[size]} ${
                  readonly ? "text-yellow-400" : "text-yellow-500"
                }`}
              />
            ) : (
              <StarOutlineIcon
                className={`${sizeClasses[size]} ${
                  readonly ? "text-gray-300" : "text-gray-400"
                }`}
              />
            )}
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-default-600 font-medium">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}
