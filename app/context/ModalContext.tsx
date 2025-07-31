"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ModalContextType {
  isModalOpen: boolean;
  modalContent: {
    title: string;
    message: string;
  };
  openModal: (title: string, message: string, onConfirm?: () => void) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const onConfirmCallbackRef = useRef<(() => void) | undefined>(undefined); // Use ref for callback

  const openModal = (title: string, message: string, onConfirm?: () => void) => {
    setModalContent({ title, message });
    onConfirmCallbackRef.current = onConfirm; // Store callback in ref
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Callback will be handled by useEffect when modal closes
  };

  // Effect to run callback when modal closes
  useEffect(() => {
    if (!isModalOpen && onConfirmCallbackRef.current) {
      // Modal has just closed, execute callback
      onConfirmCallbackRef.current();
      onConfirmCallbackRef.current = undefined; // Clear callback after execution
    }
  }, [isModalOpen]); // Dependency on isModalOpen

  return (
    <ModalContext.Provider value={{ isModalOpen, modalContent, openModal, closeModal }}>
      {children}
      <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}> {/* Radix handles onOpenChange */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{modalContent.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {modalContent.message}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={closeModal}>확인</AlertDialogAction> {/* Just close the modal */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ModalContext.Provider>
  );
};