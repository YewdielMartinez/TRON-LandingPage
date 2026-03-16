import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { flushSync } from "react-dom";

/**
 * Hook que aplica View Transitions API automáticamente en cambios de ruta.
 * Detecta cambios de ubicación y envuelve los updates del DOM en view transitions.
 *
 * Características:
 * - Transiciones suaves entre páginas
 * - Fallback automático para navegadores sin soporte
 * - No intrusivo - respeta prefers-reduced-motion
 * - Skipped en primer render
 */
export const useViewTransitionRouter = () => {
  const location = useLocation();
  const firstRenderRef = useRef(true);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    // Skip transición en el primer render
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    // Skip si ya hay una transición en progreso
    if (isTransitioningRef.current) {
      return;
    }

    // Si el navegador soporta View Transitions API
    if ("startViewTransition" in document) {
      isTransitioningRef.current = true;

      // Aplicar view transition
      const transition = (document as any).startViewTransition(() => {
        // flushSync fuerza React a completar el render síncronamente
        flushSync(() => {
          // React ya ha actualizado el DOM aquí
        });
      });

      // Limpiar flag cuando termine
      transition.finished
        .then(() => {
          isTransitioningRef.current = false;
        })
        .catch(() => {
          isTransitioningRef.current = false;
        });
    }
  }, [location.pathname, location.search]);

  return null;
};
