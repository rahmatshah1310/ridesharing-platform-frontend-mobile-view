import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { CommonInput } from "../components";

interface InputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "textarea";
  min?: number;
  max?: number;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (value: string) => void;
  variant?: "default" | "destructive";
  isLoading?: boolean;
  validation?: (value: string) => string | null; // Returns error message or null
}

export const InputDialog: React.FC<InputDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  label,
  placeholder,
  type = "text",
  min,
  max,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  variant = "default",
  isLoading = false,
  validation,
}) => {
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setValue("");
      setError(null);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!value.trim()) {
      setError(`${label} is required`);
      return;
    }

    if (validation) {
      const validationError = validation(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (type === "number") {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) {
        setError("Please enter a valid number");
        return;
      }
      if (min !== undefined && numValue < min) {
        setError(`Value must be at least ${min}`);
        return;
      }
      if (max !== undefined && numValue > max) {
        setError(`Value must be at most ${max}`);
        return;
      }
    }

    onConfirm(value);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">{label}</label>
            {type === "textarea" ? (
              <textarea
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder={placeholder}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            ) : (
              <CommonInput
                type={type}
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                placeholder={placeholder}
                min={min}
                max={max}
                className="bg-gray-50 dark:bg-gray-800"
              />
            )}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={isLoading || !value.trim()}>
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

