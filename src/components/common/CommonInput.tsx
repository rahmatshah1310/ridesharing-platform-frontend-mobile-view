import React from "react";
import { Input } from "../ui/input";


type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  inputClassname?: string;
  error?: string;
};

export const CommonInput = React.forwardRef<HTMLInputElement, Props>(
  ({ label, inputClassname = "", error, className = "", ...rest }, ref) => {
    return (
      <div className="w-full">
        {label ? (
          <label className="block mb-1 text-sm font-medium">{label}</label>
        ) : null}

        <Input
          ref={ref}
          className={`p-5 ${className} ${inputClassname}`}
          {...rest}
        />

        {error ? <p className="text-red-500 text-sm mt-1">{error}</p> : null}
      </div>
    );
  }
);

CommonInput.displayName = "CommonInput";
