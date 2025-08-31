import { writable } from 'svelte/store';

export interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // ms
}

function createToastStore() {
  const { subscribe, update, set } = writable<Toast[]>([]);
  let nextId = 1;

  function show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = nextId++;
    const toast: Toast = { id, message, type, duration };
    update((toasts) => [...toasts, toast]);
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration);
    }
    return id;
  }

  function dismiss(id: number) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  function clear() {
    set([]);
  }

  return {
    subscribe,
    show,
    dismiss,
    clear
  };
}

export const toastStore = createToastStore();
