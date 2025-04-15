'use client';

import React from 'react';
import { FaRandom } from 'react-icons/fa';
import SimulationForm from '@/components/simulation/SimulationForm';
import SimulationList from '@/components/simulation/SimulationList';
import SimulationStats from '@/components/simulation/SimulationStats';
import NavigationTabs from '@/components/common/NavigationTabs';
import { useSimulationStore } from '@/store/simulationStore';

export default function SimulacaoPage() {
  const { clearAllSimulations } = useSimulationStore();
  
  // Links de navegação para reutilização
  const navLinks = [
    { href: '/banco', label: 'Visão Geral' },
    { href: '/banco/contas', label: 'Contas Pessoais' },
    { href: '/banco/simulacao', label: 'Simulação Uber' }
  ];

  // Função para gerar dados de demonstração
  const generateDemoData = () => {
    // Esta função agora está no formulário de simulação
    // Apenas para manter a funcionalidade, poderíamos implementar aqui,
    // mas não é necessário neste momento
    alert('Função de demonstração desativada na versão otimizada');
  };

  return (
    <div className="w-full py-4 space-y-6">
      <NavigationTabs tabs={navLinks} />
      
      <div className="flex justify-end mb-4">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={generateDemoData}
            className="flex items-center justify-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <FaRandom className="mr-2" /> Gerar Dados de Exemplo
          </button>
          
          <button
            onClick={() => {
              if (confirm('Tem certeza que deseja limpar todas as simulações?')) {
                clearAllSimulations();
              }
            }}
            className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Limpar Simulações
          </button>
        </div>
      </div>
      
      <SimulationStats />
      <SimulationForm />
      <SimulationList />
    </div>
  );
} 