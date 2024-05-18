'use client';

import { XIcon } from "lucide-react";
import { useState } from "react";

export function DialogCustom({ isOpen, onClose, children }: {
  isOpen: boolean,
  onClose: () => void,
  children: JSX.Element;
}) {
  const [modalOpen, setModalOpen] = useState(isOpen);

  const closeModal = () => {
    setModalOpen(false);
    onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center ${modalOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="bg-white p-8 rounded-lg z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Modal Title</h2>
          <XIcon onClick={closeModal} className="text-gray-500 hover:text-gray-700 focus:outline-none"></XIcon>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};