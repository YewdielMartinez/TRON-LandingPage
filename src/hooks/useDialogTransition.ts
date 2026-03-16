import { useRef, useCallback } from "react";

export const useDialogTransition = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const originButtonRef = useRef<HTMLElement | null>(null);

  const openDialog = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      const viewTransitionClass = "vt-element-animation";
      const dialog = dialogRef.current;
      const originElement = event.currentTarget as HTMLElement;

      if (!dialog) return;

      // Guardar referencia del botón origen
      originButtonRef.current = originElement;

      const originIcon = originElement.querySelector('[data-vt-icon]') as HTMLElement;
      const dialogIcon = dialog.querySelector('[data-vt-icon]') as HTMLElement;

      // Aplicar estilos ANTES de iniciar la transición
      dialog.style.viewTransitionName = "vt-shared";
      dialog.style.viewTransitionClass = viewTransitionClass;

      originElement.style.viewTransitionName = "vt-shared";
      originElement.style.viewTransitionClass = viewTransitionClass;
      originElement.setAttribute("origin-element", "");

      if (originIcon) originIcon.style.viewTransitionName = "vt-icon";
      if (dialogIcon) dialogIcon.style.viewTransitionName = "";

      if (!document.startViewTransition) {
        // Fallback para navegadores sin soporte
        dialog.showModal();
        originElement.style.viewTransitionName = "";
        originElement.style.viewTransitionClass = "";
        if (originIcon) originIcon.style.viewTransitionName = "";
        return;
      }

      const viewTransition = document.startViewTransition(() => {
        originElement.style.viewTransitionName = "";
        originElement.style.viewTransitionClass = "";
        if (originIcon) originIcon.style.viewTransitionName = "";
        dialog.showModal();
        if (dialogIcon) dialogIcon.style.viewTransitionName = "vt-icon";
      });

      await viewTransition.finished;
      originElement.style.viewTransitionName = "";
      originElement.style.viewTransitionClass = "";
      if (dialogIcon) dialogIcon.style.viewTransitionName = "";
    },
    [],
  );

  const closeDialog = useCallback(async () => {
    const viewTransitionClassClosing = "vt-element-animation-closing";
    const dialog = dialogRef.current;
    const originElement = originButtonRef.current;

    if (!dialog) return;

    // Asegurar que el elemento origen esté visible inmediatamente
    if (originElement) {
      originElement.removeAttribute("origin-element");
      originElement.style.opacity = "";
    }

    if (!originElement) {
      dialog.close();
      return;
    }

    const originIcon = originElement.querySelector('[data-vt-icon]') as HTMLElement;
    const dialogIcon = dialog.querySelector('[data-vt-icon]') as HTMLElement;

    // Aplicar estilos para la transición de cierre
    dialog.style.viewTransitionName = "vt-shared";
    dialog.style.viewTransitionClass = viewTransitionClassClosing;

    if (dialogIcon) dialogIcon.style.viewTransitionName = "vt-icon";
    if (originIcon) originIcon.style.viewTransitionName = "";

    if (!document.startViewTransition) {
      // Fallback para navegadores sin soporte
      originElement.style.viewTransitionName = "vt-shared";
      originElement.style.viewTransitionClass = viewTransitionClassClosing;
      dialog.style.viewTransitionName = "";
      dialog.style.viewTransitionClass = "";
      dialog.close();
      originElement.style.viewTransitionName = "";
      originElement.style.viewTransitionClass = "";
      originElement.removeAttribute("origin-element");
      if (dialogIcon) dialogIcon.style.viewTransitionName = "";
      return;
    }

    const viewTransition = document.startViewTransition(() => {
      originElement.style.viewTransitionName = "vt-shared";
      originElement.style.viewTransitionClass = viewTransitionClassClosing;
      if (originIcon) originIcon.style.viewTransitionName = "vt-icon";

      dialog.style.viewTransitionName = "";
      dialog.style.viewTransitionClass = "";
      if (dialogIcon) dialogIcon.style.viewTransitionName = "";
      dialog.close();
    });

    await viewTransition.finished;
    originElement.style.viewTransitionName = "";
    originElement.style.viewTransitionClass = "";
    originElement.removeAttribute("origin-element");
    if (originIcon) originIcon.style.viewTransitionName = "";
  }, []);

  return { dialogRef, openDialog, closeDialog };
};
