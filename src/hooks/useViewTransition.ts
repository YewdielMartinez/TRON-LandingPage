import { useCallback, useRef } from "react";

export const useViewTransition = () => {
  const isTransitioningRef = useRef(false);

  const startTransition = useCallback((callback: () => void) => {
    // Evitar múltiples transiciones simultáneas
    if (isTransitioningRef.current) {
      callback();
      return Promise.resolve();
    }

    if (!document.startViewTransition) {
      // Fallback para navegadores sin soporte
      callback();
      return Promise.resolve();
    }

    isTransitioningRef.current = true;

    const transition = document.startViewTransition(() => {
      callback();
    });

    // Limpiar flag cuando termine
    transition.finished
      .then(() => {
        isTransitioningRef.current = false;
      })
      .catch(() => {
        isTransitioningRef.current = false;
      });

    return transition.finished;
  }, []);

  return { startTransition };
};
