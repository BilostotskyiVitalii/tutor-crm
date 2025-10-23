import { createContext, type ReactNode, useContext, useState } from 'react';

import type { ModalState, OpenModalOptions } from '@/shared/types/modalTypes';

type OpenModalFn = (options: OpenModalOptions) => void;

interface ModalContextValue {
  modal: ModalState;
  openModal: OpenModalFn;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modal, setModal] = useState<ModalState>({
    open: false,
    type: null,
    entity: null,
  });

  const openModal: OpenModalFn = (options) => {
    setModal({ ...options, open: true });
  };

  const closeModal = () => {
    setModal({ open: false, type: null, entity: null });
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
