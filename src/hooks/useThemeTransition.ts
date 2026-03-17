import { useCallback } from "react";

type ThemeValue = string;

/**
 * Hook para aplicar transiciones visuales suaves al cambiar temas, modos o fuentes.
 * Usa View Transitions API para crear un crossfade animado entre estados.
 */
export const useThemeTransition = () => {
  /**
   * Cambia el tema con animación de transición
   */
  const changeThemeWithTransition = useCallback(
    async (
      setter: (value: ThemeValue) => void,
      value: ThemeValue,
    ) => {
      if (!document.startViewTransition) {
        // Fallback para navegadores sin soporte
        setter(value);
        return;
      }

      // CRÍTICO: Asignar viewTransitionName ANTES de iniciar la transición
      document.documentElement.style.viewTransitionName = "theme-change";

      // Iniciar la transición y aplicar el cambio
      const transition = document.startViewTransition(() => {
        setter(value);
      });

      try {
        await transition.finished;
      } catch (error) {
        // Ignorar errores de transición cancelada
        console.log("View transition cancelled or failed:", error);
      } finally {
        // Limpiar el viewTransitionName después de la transición
        document.documentElement.style.viewTransitionName = "";
      }
    },
    [],
  );

  return { changeThemeWithTransition };
};
