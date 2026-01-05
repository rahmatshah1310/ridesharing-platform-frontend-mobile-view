import { AuthService } from "../services/services";
import { useMutation } from "@tanstack/react-query";

export const useSignupMutation = () => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return await AuthService.signUp(data);
    },
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: async (data: Record<string, string>) => {
      return await AuthService.login(data);
    },
  });
};
