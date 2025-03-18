import { create} from "zustand";

type ErrorMessage = {
  message: string | null | number;
  setMessage: (errorMessage: string | number) => void;
};

export const useErrorStore = create<ErrorMessage>((
  (set) => ({
        message:null,
        setMessage:(errorMessage) => set({message:errorMessage})
  })
))