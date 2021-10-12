import { createContext, useContext } from 'react';

export interface LoaderContextProvider {
  isLoading: boolean;
  setIsLoading: (newValue: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const LOADER_CONTEXT_DEFAULT_VALUE = { isLoading: false, setIsLoading: (_: boolean) => {} };

export const LoaderContext = createContext<LoaderContextProvider>(LOADER_CONTEXT_DEFAULT_VALUE);

export const useLoader = () => {
  return useContext(LoaderContext);
};
