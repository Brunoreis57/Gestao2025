'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

interface ExpenseData {
  name: string;
  type: 'debit' | 'credit';
  value: number;
  date: string;
  time?: string;
  recurring: boolean;
}

const defaultFormData: ExpenseData = {
  name: '',
  type: 'debit',
  value: 0,
  date: new Date().toISOString().split('T')[0],
  time: '',
  recurring: false,
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  onSave,
}: AddExpenseModalProps) {
  const [formData, setFormData] = useState<ExpenseData>(defaultFormData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData(defaultFormData);
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
                <div className="flex items-center justify-between mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-white">
                    Adicionar Gasto
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    />
                  </div>

                  {/* Tipo */}
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tipo *
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'debit' | 'credit' })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    >
                      <option value="debit">Débito</option>
                      <option value="credit">Crédito</option>
                    </select>
                  </div>

                  {/* Valor */}
                  <div>
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Valor *
                    </label>
                    <input
                      type="number"
                      id="value"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                      step="0.01"
                      min="0"
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    />
                  </div>

                  {/* Data */}
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data *
                    </label>
                    <input
                      type="date"
                      id="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                      required
                    />
                  </div>

                  {/* Horário */}
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Horário (opcional)
                    </label>
                    <input
                      type="time"
                      id="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:text-white"
                    />
                  </div>

                  {/* Recorrente */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={formData.recurring}
                      onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600"
                    />
                    <label htmlFor="recurring" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Gasto Recorrente
                    </label>
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