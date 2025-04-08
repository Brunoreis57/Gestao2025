'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlus, FaTimes, FaCarSide, FaMoneyBill, FaGasPump, FaClock, FaBars } from 'react-icons/fa';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';

export default function SimulacaoPage() {
  const pathname = usePathname(); // Hook para obter o pathname atual
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    uberSimulations,
    addUberSimulation,
    removeUberSimulation
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
        totalHours: 0
      };
    }
    
    const totalNetEarnings = uberSimulations.reduce((sum, sim) => sum + sim.netEarnings, 0);
    const totalHours = uberSimulations.reduce((sum, sim) => sum + sim.hoursWorked, 0);
    const totalDistance = uberSimulations.reduce((sum, sim) => sum + sim.distance, 0);
    
    return {
      avgEarningsPerHour: totalNetEarnings / totalHours,
      avgEarningsPerKm: totalNetEarnings / totalDistance,
      totalNetEarnings,
      totalHours
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

  return (
    <div className="w-full py-4 space-y-6">
      {/* Header com menu para mobile */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Simulação Uber</h1>
        <button 
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Menu de navegação para mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 mb-6 animate-fadeIn">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors ${
                  pathname === link.href
                    ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Navegação de subpáginas (somente desktop) */}
      <div className="hidden md:block mb-8">
        <div className="flex flex-wrap items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                pathname === link.href
                  ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Cards de Resumo */}
      <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Resumo de Ganhos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8 3xl:grid-cols-10 4xl:grid-cols-12 gap-4 md:gap-6">
          <Card
            title="Ganho Médio por Hora"
            value={averages.avgEarningsPerHour}
            type="success"
          />
          <Card
            title="Ganho Médio por KM"
            value={averages.avgEarningsPerKm}
            type="blue"
          />
          <Card
            title="Total Líquido"
            value={averages.totalNetEarnings}
            type="default"
          />
          <Card
            title="Total de Horas"
            value={averages.totalHours}
            type="warning"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6">
        {/* Formulário para adicionar simulação */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nova Simulação</h2>
          
          <form onSubmit={handleAddSimulation} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data
                </label>
                <input
                  type="date"
                  id="date"
                  value={newSimulation.date}
                  onChange={(e) => setNewSimulation({...newSimulation, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="hoursWorked" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Horas Trabalhadas
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="hoursWorked"
                    value={newSimulation.hoursWorked}
                    onChange={(e) => setNewSimulation({...newSimulation, hoursWorked: e.target.value})}
                    className="w-full px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    step="0.5"
                  />
                  <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Distância (km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="distance"
                    value={newSimulation.distance}
                    onChange={(e) => setNewSimulation({...newSimulation, distance: e.target.value})}
                    className="w-full px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    step="0.1"
                  />
                  <FaCarSide className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="fuelPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Preço do Combustível
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="fuelPrice"
                    value={newSimulation.fuelPrice}
                    onChange={(e) => setNewSimulation({...newSimulation, fuelPrice: e.target.value})}
                    className="w-full px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="0,00"
                    step="0.01"
                  />
                  <FaGasPump className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="earnings" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ganho Bruto
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="earnings"
                    value={newSimulation.earnings}
                    onChange={(e) => setNewSimulation({...newSimulation, earnings: e.target.value})}
                    className="w-full px-3 py-2 pl-9 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                    placeholder="0,00"
                    step="0.01"
                  />
                  <FaMoneyBill className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label htmlFor="consumption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Consumo (km/L)
                </label>
                <input
                  type="number"
                  id="consumption"
                  value={newSimulation.consumption}
                  onChange={(e) => setNewSimulation({...newSimulation, consumption: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  placeholder="10"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md shadow-sm"
              >
                <FaPlus className="mr-2" />
                Adicionar Simulação
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Lista de Simulações */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Histórico de Simulações</h2>
        
        {uberSimulations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Horas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Distância
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Consumo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ganho Bruto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Custo Combustível
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ganho Líquido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    R$/Hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    R$/Km
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
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