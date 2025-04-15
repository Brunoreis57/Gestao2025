'use client';

import React from 'react';
import { FaTrash } from 'react-icons/fa';
import { useSimulationStore } from '@/store/simulationStore';
import { formatCurrency, formatNumber } from '@/utils/formatters';

const SimulationList = () => {
  const { simulations, removeSimulation } = useSimulationStore();

  // Confirmação ao excluir simulação
  const handleDelete = (date: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
      removeSimulation(date);
    }
  };

  // Se não houver simulações, exibe mensagem
  if (simulations.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Nenhuma simulação encontrada. Adicione uma nova simulação acima.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Histórico de Simulações
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Horas
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Distância
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Consumo
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ganho Bruto
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Custo Combustível
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ganho Líquido
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                R$/hora
              </th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                R$/km
              </th>
              <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {simulations.map((simulation, index) => (
              <tr key={simulation.date + index} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {simulation.date}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(simulation.hoursWorked, 1)}h
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(simulation.distance, 1)} km
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatNumber(simulation.consumption, 1)} km/L
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(simulation.earnings)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(simulation.fuelCost)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrency(simulation.netEarnings)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(simulation.earningsPerHour)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {formatCurrency(simulation.earningsPerKm)}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(simulation.date)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                    title="Excluir"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SimulationList; 