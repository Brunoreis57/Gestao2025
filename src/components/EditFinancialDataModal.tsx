'use client';

import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

interface EditFinancialDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FinancialData) => void;
  initialData: FinancialData;
}

interface FinancialData {
  saldoConta: number;
  limiteCredito: number;
  contasAbertas: number;
}

export default function EditFinancialDataModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditFinancialDataModalProps) {
  const [formData, setFormData] = useState<FinancialData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Editar Dados Financeiros
                  </h2>
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={onClose}
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Saldo em Conta */}
                  <div>
                    <label htmlFor="saldoConta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Saldo em Conta *
                    </label>
                    <input
                      type="number"
                      id="saldoConta"
                      value={formData.saldoConta}
                      onChange={(e) => setFormData({ ...formData, saldoConta: parseFloat(e.target.value) })}
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    />
                  </div>

                  {/* Limite de Crédito */}
                  <div>
                    <label htmlFor="limiteCredito" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Limite de Crédito *
                    </label>
                    <input
                      type="number"
                      id="limiteCredito"
                      value={formData.limiteCredito}
                      onChange={(e) => setFormData({ ...formData, limiteCredito: parseFloat(e.target.value) })}
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    />
                  </div>

                  {/* Contas em Aberto */}
                  <div>
                    <label htmlFor="contasAbertas" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Contas em Aberto *
                    </label>
                    <input
                      type="number"
                      id="contasAbertas"
                      value={formData.contasAbertas}
                      onChange={(e) => setFormData({ ...formData, contasAbertas: parseFloat(e.target.value) })}
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    />
                  </div>

                  {/* Botões */}
                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 