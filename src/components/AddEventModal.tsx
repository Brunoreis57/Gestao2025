'use client';

import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEventStore } from '@/store/eventStore';

export interface EventData {
  title: string;
  date?: string;
  time?: string;
  description?: string;
  isRecurring?: boolean;
  recurrencePattern?: 'daily' | 'weekly' | 'monthly';
  marker?: {
    name: string;
    color: string;
  };
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EventData) => void;
  initialData?: EventData;
}

const defaultFormData: EventData = {
  title: '',
  date: '',
  time: '',
  description: '',
  isRecurring: false,
  recurrencePattern: 'weekly',
  marker: undefined
};

const AddEventModal = ({ isOpen, onClose, onSave, initialData }: AddEventModalProps) => {
  const [formData, setFormData] = useState<EventData>(defaultFormData);
  const [showMarkerForm, setShowMarkerForm] = useState(false);
  const [newMarkerName, setNewMarkerName] = useState('');
  const [newMarkerColor, setNewMarkerColor] = useState('blue');
  const [editingMarker, setEditingMarker] = useState<{ id: string; name: string; color: string } | null>(null);
  const { markers, addMarker, removeMarker, updateMarker } = useEventStore();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(defaultFormData);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor, insira pelo menos o título do evento');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleAddMarker = () => {
    if (newMarkerName.trim()) {
      if (editingMarker) {
        updateMarker(editingMarker.id, newMarkerName, newMarkerColor);
        setEditingMarker(null);
      } else {
        addMarker(newMarkerName, newMarkerColor);
      }
      setNewMarkerName('');
      setShowMarkerForm(false);
    }
  };

  const handleEditMarker = (marker: { id: string; name: string; color: string }) => {
    setEditingMarker(marker);
    setNewMarkerName(marker.name);
    setNewMarkerColor(marker.color);
    setShowMarkerForm(true);
  };

  const handleDeleteMarker = (markerId: string) => {
    if (confirm('Tem certeza que deseja excluir este marcador? Todos os eventos associados a ele perderão o marcador.')) {
      removeMarker(markerId);
      if (formData.marker && formData.marker.name === markers.find(m => m.id === markerId)?.name) {
        setFormData({ ...formData, marker: undefined });
      }
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      orange: 'bg-orange-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  const availableColors = ['red', 'blue', 'yellow', 'purple', 'green', 'pink', 'orange'];

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
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex justify-between items-center"
                >
                  {initialData ? 'Editar Evento' : 'Adicionar Evento'}
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Data
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Hora
                    </label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descrição
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRecurring}
                      onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Evento recorrente
                    </label>
                  </div>

                  {formData.isRecurring && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Padrão de recorrência
                      </label>
                      <select
                        value={formData.recurrencePattern}
                        onChange={(e) => setFormData({ ...formData, recurrencePattern: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                      >
                        <option value="daily">Diário</option>
                        <option value="weekly">Semanal</option>
                        <option value="monthly">Mensal</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Marcador
                    </label>
                    <div className="mt-2 space-y-2">
                      <select
                        value={formData.marker ? `${formData.marker.name}|${formData.marker.color}` : ''}
                        onChange={(e) => {
                          if (e.target.value === 'new') {
                            setShowMarkerForm(true);
                            setEditingMarker(null);
                            setNewMarkerName('');
                            setNewMarkerColor('blue');
                          } else if (e.target.value === '') {
                            setFormData({ ...formData, marker: undefined });
                          } else {
                            const [name, color] = e.target.value.split('|');
                            setFormData({ ...formData, marker: { name, color } });
                          }
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                      >
                        <option value="">Sem marcador</option>
                        {markers.map((marker) => (
                          <option key={marker.id} value={`${marker.name}|${marker.color}`}>
                            {marker.name}
                          </option>
                        ))}
                        <option value="new">+ Novo marcador</option>
                      </select>

                      {markers.length > 0 && !showMarkerForm && (
                        <div className="mt-2 space-y-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Gerenciar marcadores:
                          </p>
                          <div className="space-y-2">
                            {markers.map((marker) => (
                              <div key={marker.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full ${getColorClass(marker.color)}`} />
                                  <span className="text-sm text-gray-700 dark:text-gray-300">{marker.name}</span>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditMarker(marker)}
                                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                                    title="Editar marcador"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMarker(marker.id)}
                                    className="p-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Excluir marcador"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {showMarkerForm && (
                        <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 space-y-3">
                          <input
                            type="text"
                            value={newMarkerName}
                            onChange={(e) => setNewMarkerName(e.target.value)}
                            placeholder="Nome do marcador"
                            className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:text-white"
                          />
                          <div className="flex gap-2 flex-wrap">
                            {availableColors.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setNewMarkerColor(color)}
                                className={`w-6 h-6 rounded-full ${
                                  newMarkerColor === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                                } ${getColorClass(color)}`}
                                title={color.charAt(0).toUpperCase() + color.slice(1)}
                              />
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleAddMarker}
                              className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
                            >
                              {editingMarker ? 'Salvar' : 'Adicionar'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowMarkerForm(false);
                                setNewMarkerName('');
                                setEditingMarker(null);
                              }}
                              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      {initialData ? 'Salvar' : 'Adicionar'}
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
};

export { AddEventModal };
export default AddEventModal; 