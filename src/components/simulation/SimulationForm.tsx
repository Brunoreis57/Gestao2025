'use client';

import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useSimulationStore } from '@/store/simulationStore';
import { formatDate } from '@/utils/formatters';

const SimulationForm = () => {
  const { addSimulation } = useSimulationStore();

  // Estado para o formulário de nova simulação
  const [newSimulation, setNewSimulation] = useState({
    date: formatDate(new Date()),
    hoursWorked: '',
    distance: '',
    fuelPrice: '',
    earnings: '',
    consumption: '10' // Consumo médio padrão: 10 km/l
  });

  // Função para adicionar nova simulação
  const handleAddSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSimulation.date || !newSimulation.hoursWorked || 
        !newSimulation.distance || !newSimulation.fuelPrice || 
        !newSimulation.earnings || !newSimulation.consumption) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    // Conversão de string para número
    const hoursWorked = parseFloat(newSimulation.hoursWorked);
    const distance = parseFloat(newSimulation.distance);
    const fuelPrice = parseFloat(newSimulation.fuelPrice);
    const earnings = parseFloat(newSimulation.earnings);
    const consumption = parseFloat(newSimulation.consumption);
    
    // Cálculos adicionais
    const fuelCost = (distance / consumption) * fuelPrice;
    const netEarnings = earnings - fuelCost;
    const earningsPerHour = netEarnings / hoursWorked;
    const earningsPerKm = netEarnings / distance;
    
    // Adiciona a nova simulação ao store
    addSimulation({
      date: newSimulation.date,
      hoursWorked,
      distance,
      fuelPrice,
      earnings,
      consumption,
      fuelCost,
      netEarnings,
      earningsPerHour,
      earningsPerKm
    });
    
    // Limpar formulário
    setNewSimulation({
      date: formatDate(new Date()),
      hoursWorked: '',
      distance: '',
      fuelPrice: '',
      earnings: '',
      consumption: '10' // Mantém o valor padrão
    });
  };

  // Função para gerar dados de demonstração
  const generateDemoData = () => {
    // Gera 10 simulações aleatórias para demonstração
    const today = new Date();
    const demoData = Array.from({ length: 10 }, (_, index) => {
      // Cria datas que vão diminuindo para o passado (10 dias atrás até hoje)
      const date = new Date();
      date.setDate(today.getDate() - index);
      
      // Define valores aleatórios dentro de faixas realistas
      const hoursWorked = (4 + Math.random() * 8).toFixed(1); // Entre 4 e 12 horas
      const distance = (50 + Math.random() * 150).toFixed(1); // Entre 50 e 200 km
      const consumption = (8 + Math.random() * 7).toFixed(1); // Entre 8 e 15 km/l
      const fuelPrice = (5 + Math.random() * 2).toFixed(2); // Entre 5 e 7 reais
      const earnings = (80 + Math.random() * 220).toFixed(2); // Entre 80 e 300 reais
      
      // Calcula os valores derivados
      const hoursWorkedNum = parseFloat(hoursWorked);
      const distanceNum = parseFloat(distance);
      const consumptionNum = parseFloat(consumption);
      const fuelPriceNum = parseFloat(fuelPrice);
      const earningsNum = parseFloat(earnings);
      
      const fuelCost = (distanceNum / consumptionNum) * fuelPriceNum;
      const netEarnings = earningsNum - fuelCost;
      const earningsPerHour = netEarnings / hoursWorkedNum;
      const earningsPerKm = netEarnings / distanceNum;
      
      return {
        date: formatDate(date),
        hoursWorked: hoursWorkedNum,
        distance: distanceNum,
        consumption: consumptionNum,
        fuelPrice: fuelPriceNum,
        earnings: earningsNum,
        fuelCost,
        netEarnings,
        earningsPerHour,
        earningsPerKm
      };
    });
    
    // Adiciona cada simulação ao store
    demoData.forEach(sim => {
      addSimulation(sim);
    });
  };

  return (
    <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Nova Simulação
        </h2>
        <form onSubmit={handleAddSimulation} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          <div className="col-span-1">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Data
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={newSimulation.date}
              onChange={(e) => setNewSimulation({...newSimulation, date: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="hoursWorked"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Horas Trabalhadas
            </label>
            <input
              type="number"
              id="hoursWorked"
              name="hoursWorked"
              required
              value={newSimulation.hoursWorked}
              onChange={(e) => setNewSimulation({...newSimulation, hoursWorked: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="distance"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Distância (km)
            </label>
            <input
              type="number"
              id="distance"
              name="distance"
              required
              value={newSimulation.distance}
              onChange={(e) => setNewSimulation({...newSimulation, distance: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="fuelPrice"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Preço do Combustível
            </label>
            <input
              type="number"
              id="fuelPrice"
              name="fuelPrice"
              required
              value={newSimulation.fuelPrice}
              onChange={(e) => setNewSimulation({...newSimulation, fuelPrice: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="earnings"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Ganho Bruto
            </label>
            <input
              type="number"
              id="earnings"
              name="earnings"
              required
              value={newSimulation.earnings}
              onChange={(e) => setNewSimulation({...newSimulation, earnings: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="consumption"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Consumo (km/L)
            </label>
            <input
              type="number"
              id="consumption"
              name="consumption"
              required
              value={newSimulation.consumption}
              onChange={(e) => setNewSimulation({...newSimulation, consumption: e.target.value})}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
            />
          </div>
          <div className="col-span-1 flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors duration-200"
            >
              <FaPlus className="mr-2" /> Adicionar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SimulationForm; 