import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";
import type { RatingData } from "../../types/rides";

interface RatingModelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: RatingData) => void;
  isLoading?: boolean;
  type: "driver" | "passenger";
  name: string;
}

const DRIVER_TAGS = [
  "Safe Driver",
  "Clean Car",
  "Good Music",
  "Friendly",
  "Punctual",
  "Professional",
];

const PASSENGER_TAGS = [
  "Polite",
  "Punctual",
  "Respectful",
  "Clean",
  "Friendly",
  "Good Communication",
];

const RatingModel: React.FC<RatingModelProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  type,
  name,
}) => {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [hoveredStar, setHoveredStar] = useState(0);

  const tags = type === "driver" ? DRIVER_TAGS : PASSENGER_TAGS;

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = () => {
    if (score === 0) return;
    onSubmit({
      score,
      comment,
      feedbackTags: selectedTags,
    });
  };

  // Reset state when opening
  React.useEffect(() => {
    if (open) {
      setScore(0);
      setComment("");
      setSelectedTags([]);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Rate {name}</DialogTitle>
          <DialogDescription className="text-center">
            How was your ride with {name}?
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Star Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 focus:outline-none"
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setScore(star)}
              >
                <Star
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 transition-colors duration-200",
                    (hoveredStar ? star <= hoveredStar : star <= score)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
              </button>
            ))}
          </div>

          {/* Feedback Tags */}
          <div className="flex flex-wrap justify-center gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors border",
                  selectedTags.includes(tag)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-input hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Comment Area */}
          <div className="w-full">
            <textarea
              placeholder="Leave a comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Skip
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={score === 0 || isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModel;
