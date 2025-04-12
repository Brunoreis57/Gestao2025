'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlus, FaTimes, FaCarSide, FaMoneyBill, FaGasPump, FaClock, FaBars, FaRandom, FaWallet, FaHourglass, FaTachometerAlt, FaLeaf, FaTrash, FaRoad } from 'react-icons/fa';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';

export default function SimulacaoPage() {
  const pathname = usePathname(); // Hook para obter o pathname atual
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    uberSimulations,
    addUberSimulation,
    removeUberSimulation,
    clearAllSimulations
  } = useStore();

  // Estado para o formulário de nova simulação
  const [newSimulation, setNewSimulation] = useState({
    date: '',
    hoursWorked: '',
    distance: '',
    fuelPrice: '',
    earnings: '',
    consumption: '10' // Consumo médio padrão: 10 km/l
  });
  
  // Links de navegação para reutilização
  const navLinks = [
    { href: '/banco', label: 'Visão Geral' },
    { href: '/banco/contas', label: 'Contas Pessoais' },
    { href: '/banco/simulacao', label: 'Simulação Uber' }
  ];

  // Função para adicionar nova simulação
  const handleAddSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSimulation.date || !newSimulation.hoursWorked || 
        !newSimulation.distance || !newSimulation.fuelPrice || 
        !newSimulation.earnings || !newSimulation.consumption) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    // Cálculos adicionais
    const hoursWorked = parseFloat(newSimulation.hoursWorked);
    const distance = parseFloat(newSimulation.distance);
    const fuelPrice = parseFloat(newSimulation.fuelPrice);
    const earnings = parseFloat(newSimulation.earnings);
    const consumption = parseFloat(newSimulation.consumption);
    
    const fuelCost = (distance / consumption) * fuelPrice;
    const netEarnings = earnings - fuelCost;
    const earningsPerHour = netEarnings / hoursWorked;
    const earningsPerKm = netEarnings / distance;
    
    addUberSimulation({
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
      date: '',
      hoursWorked: '',
      distance: '',
      fuelPrice: '',
      earnings: '',
      consumption: '10' // Mantém o valor padrão
    });
  };

  // Cálculos para os cards de resumo
  const calculateAverages = () => {
    if (uberSimulations.length === 0) {
      return {
        avgEarningsPerHour: 0,
        avgEarningsPerKm: 0,
        totalNetEarnings: 0,
        totalHours: 0,
        totalDistance: 0,
        totalFuelCost: 0,
        avgConsumption: 0,
        hoursTrend: 0,
        distanceTrend: 0,
        consumptionTrend: 0,
        totalNetEarningsTrend: 0,
        fuelCostTrend: 0,
        earningsPerHourTrend: 0,
        earningsPerKmTrend: 0
      };
    }
    
    const totalNetEarnings = uberSimulations.reduce((sum, sim) => sum + Number(sim.netEarnings), 0);
    const totalHours = uberSimulations.reduce((sum, sim) => sum + Number(sim.hoursWorked), 0);
    const totalDistance = uberSimulations.reduce((sum, sim) => sum + Number(sim.distance), 0);
    const totalFuelCost = uberSimulations.reduce((sum, sim) => sum + Number(sim.fuelCost), 0);
    const totalConsumption = uberSimulations.reduce((sum, sim) => sum + Number(sim.consumption), 0);
    
    // Cálculo de médias
    const avgConsumption = totalConsumption / uberSimulations.length;
    const avgEarningsPerHour = totalNetEarnings / totalHours;
    const avgEarningsPerKm = totalNetEarnings / totalDistance;
    
    // Tendências (simuladas para este exemplo)
    const randomTrend = () => Math.random() > 0.5 ? Math.random() * 0.1 : -Math.random() * 0.1;
    
    return {
      avgEarningsPerHour,
      avgEarningsPerKm,
      totalNetEarnings,
      totalHours,
      totalDistance,
      totalFuelCost,
      avgConsumption,
      hoursTrend: randomTrend(),
      distanceTrend: randomTrend(),
      consumptionTrend: randomTrend(),
      totalNetEarningsTrend: randomTrend(),
      fuelCostTrend: randomTrend(),
      earningsPerHourTrend: randomTrend(),
      earningsPerKmTrend: randomTrend()
    };
  };
  
  const averages = calculateAverages();

  // Formatação de valores
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const formatNumber = (value: number, decimals = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  };

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
        id: `demo-${Date.now()}-${index}`,
        date: date.toISOString().split('T')[0], // Formato yyyy-mm-dd
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
      addUberSimulation({
        date: sim.date,
        hoursWorked: sim.hoursWorked,
        distance: sim.distance,
        consumption: sim.consumption,
        fuelPrice: sim.fuelPrice,
        earnings: sim.earnings,
        fuelCost: sim.fuelCost,
        netEarnings: sim.netEarnings,
        earningsPerHour: sim.earningsPerHour,
        earningsPerKm: sim.earningsPerKm
      });
    });
  };

  return (
    <div className="w-full px-4 py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
          Simulação de Ganhos
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={generateDemoData}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center text-sm md:text-base"
          >
            <FaRandom className="mr-2" /> Gerar Dados Demo
          </button>
          <button
            onClick={() => {
              if (uberSimulations.length > 0 && window.confirm('Tem certeza que deseja limpar todas as simulações?')) {
                clearAllSimulations();
              }
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center text-sm md:text-base"
            disabled={uberSimulations.length === 0}
          >
            <FaTrash className="mr-2" /> Limpar Tudo
          </button>
        </div>
      </div>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6">
          <Card
            title="Ganhos Médios"
            value={formatCurrency(averages.totalNetEarnings)}
            icon={<FaWallet className="h-8 w-8 text-green-500" />}
            description="Valor médio líquido por corrida"
            trend={averages.totalNetEarningsTrend}
            animate={true}
          />
          <Card
            title="Custo de Combustível"
            value={formatCurrency(averages.totalFuelCost)}
            icon={<FaGasPump className="h-8 w-8 text-red-500" />}
            description="Valor médio de combustível por corrida"
            trend={averages.fuelCostTrend * -1}
            animate={true}
          />
          <Card
            title="Horas Trabalhadas"
            value={`${averages.totalHours.toFixed(1)}h`}
            icon={<FaHourglass className="h-8 w-8 text-amber-500" />}
            description="Média de horas por corrida"
            trend={averages.hoursTrend}
            animate={true}
          />
          <Card
            title="Distância Média"
            value={`${averages.totalDistance.toFixed(1)} km`}
            icon={<FaTachometerAlt className="h-8 w-8 text-teal-500" />}
            description="Média de quilômetros por corrida"
            trend={averages.distanceTrend}
            animate={true}
          />
          <Card
            title="Consumo Médio"
            value={`${averages.avgConsumption.toFixed(1)} km/l`}
            icon={<FaLeaf className="h-8 w-8 text-green-600" />}
            description="Média de consumo por corrida"
            trend={averages.consumptionTrend}
            animate={true}
          />
          <Card
            title="Ganho por Hora"
            value={formatCurrency(averages.avgEarningsPerHour)}
            icon={<FaClock className="h-8 w-8 text-purple-500" />}
            description="Valor médio por hora trabalhada"
            trend={averages.earningsPerHourTrend}
            animate={true}
          />
          <Card
            title="Ganho por KM"
            value={formatCurrency(averages.avgEarningsPerKm)}
            icon={<FaRoad className="h-8 w-8 text-indigo-500" />}
            description="Valor médio por quilômetro rodado"
            trend={averages.earningsPerKmTrend}
            animate={true}
          />
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="mb-6">
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

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Histórico de Simulações
        </h2>
        {uberSimulations.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Horas
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Distância
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Consumo
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Ganhos Brutos
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Custo Combustível
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Ganhos Líquidos
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      R$/Hora
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      R$/KM
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {uberSimulations.map((sim) => (
                    <tr key={sim.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(sim.date).toLocaleDateString('pt-BR')}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatNumber(sim.hoursWorked, 1)}h
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatNumber(sim.distance)} km
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {formatNumber(sim.consumption, 1)} km/L
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {formatCurrency(sim.earnings)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {formatCurrency(sim.fuelCost)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {formatCurrency(sim.netEarnings)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {formatCurrency(sim.earningsPerHour)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {formatCurrency(sim.earningsPerKm)}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            if (window.confirm('Tem certeza que deseja excluir esta simulação?')) {
                              removeUberSimulation(sim.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          title="Excluir"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
            <FaCarSide className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Nenhuma simulação cadastrada
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Adicione uma nova simulação para acompanhar seus ganhos
            </p>
          </div>
        )}
      </section>
    </div>
  );
} 