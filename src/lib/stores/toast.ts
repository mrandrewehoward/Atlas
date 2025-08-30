import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  timeout?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let id = 0;

  function show(message: string, type: ToastType = 'info', timeout = 3000) {
    const toast: Toast = { id: ++id, type, message, timeout };
    update((toasts) => [...toasts, toast]);
    if (timeout) {
      setTimeout(() => dismiss(toast.id), timeout);
    }
  }

  function dismiss(id: number) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  return { subscribe, show, dismiss };
}

export const toastStore = createToastStore();
