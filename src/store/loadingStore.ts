import { create } from "zustand";

type LoadingType = {
      loading:boolean;
}
export const useLoadingStore = create<LoadingType>((
      () => ({
            loading:false
      })
))