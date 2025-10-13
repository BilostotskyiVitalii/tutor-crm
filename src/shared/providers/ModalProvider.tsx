import { createContext, type ReactNode, useContext, useState } from 'react';

import type { ModalState } from '@/shared/types/modalTypes';

interface ModalContextValue {
  modal: ModalState;
  openModal: (options: Omit<ModalState, 'open'>) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState>({ open: false, type: null });

  const openModal = (options: Omit<ModalState, 'open'>) => {
    setModal({ ...options, open: true });
  };

  const closeModal = () => {
    setModal({ open: false, type: null });
  };

  return (
    <ModalContext.Provider value={{ modal, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return ctx;
};
