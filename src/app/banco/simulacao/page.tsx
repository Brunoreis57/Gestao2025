'use client';

import { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import Card from '@/components/Card';
import { FaPlus, FaTimes, FaTrash, FaCheck } from 'react-icons/fa';

export default function UberSimulacaoPage() {
  const {
    uberSimulations,
    addUberSimulation,
    removeUberSimulation,
    updateUberSimulation
  } = useStore();

  const [isAddingSimulation, setIsAddingSimulation] = useState(false);
  const [newSimulation, setNewSimulation] = useState({
    date: new Date().toISOString().split('T')[0],
    workHours: '',
    grossIncome: '',
    fuelExpense: '',
    otherExpenses: '',
    notes: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  // Função para mostrar o indicador de salvamento
  const showSavingIndicator = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  // Calcular estatísticas
  const stats = useMemo(() => {
    if (uberSimulations.length === 0) {
      return {
        totalGross: 0,
        totalFuel: 0,
        totalOther: 0,
        totalNet: 0,
        avgHourly: 0,
        bestDay: { date: '', amount: 0 },
        totalHours: 0
      };
    }

    const totalGross = uberSimulations.reduce((sum, sim) => sum + sim.grossIncome, 0);
    const totalFuel = uberSimulations.reduce((sum, sim) => sum + sim.fuelExpense, 0);
    const totalOther = uberSimulations.reduce((sum, sim) => sum + sim.otherExpenses, 0);
    const totalNet = totalGross - totalFuel - totalOther;
    const totalHours = uberSimulations.reduce((sum, sim) => sum + sim.workHours, 0);
    
    const avgHourly = totalHours > 0 ? totalNet / totalHours : 0;
    
    const bestDay = uberSimulations.reduce(
      (best, sim) => {
        const netAmount = sim.grossIncome - sim.fuelExpense - sim.otherExpenses;
        return netAmount > best.amount 
          ? { date: sim.date, amount: netAmount } 
          : best;
      },
      { date: '', amount: 0 }
    );

    return {
      totalGross,
      totalFuel,
      totalOther,
      totalNet,
      avgHourly,
      bestDay,
      totalHours
    };
  }, [uberSimulations]);

  const handleAddSimulation = () => {
    if (!newSimulation.date || !newSimulation.workHours || !newSimulation.grossIncome) {
      alert('Por favor, preencha pelo menos a data, horas trabalhadas e ganho bruto');
      return;
    }

    addUberSimulation({
      date: newSimulation.date,
      workHours: parseFloat(newSimulation.workHours),
      grossIncome: parseFloat(newSimulation.grossIncome),
      fuelExpense: parseFloat(newSimulation.fuelExpense || '0'),
      otherExpenses: parseFloat(newSimulation.otherExpenses || '0'),
      notes: newSimulation.notes
    });

    setNewSimulation({
      date: new Date().toISOString().split('T')[0],
      workHours: '',
      grossIncome: '',
      fuelExpense: '',
      otherExpenses: '',
      notes: ''
    });
    setIsAddingSimulation(false);
    showSavingIndicator();
  };

  const handleRemoveSimulation = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      removeUberSimulation(id);
      showSavingIndicator();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Simulação de Ganhos Uber</h1>
        
        {/* Indicador de salvamento */}
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full animate-pulse">
            <FaCheck className="w-4 h-4" />
            <span>Dados salvos automaticamente</span>
          </div>
        )}
      </div>

      {/* Cards de Resumo */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Ganho Líquido Total"
          value={stats.totalNet}
          type="green"
          valueType="currency"
        />
        <Card
          title="Média por Hora"
          value={stats.avgHourly}
          type="blue"
          valueType="currency"
        />
        <Card
          title="Horas Trabalhadas"
          value={stats.totalHours}
          type="purple"
          valueType="number"
          suffix="h"
        />
        <Card
          title="Gasto com Combustível"
          value={stats.totalFuel}
          type="red"
          valueType="currency"
        />
      </section>

      {/* Botão para adicionar */}
      <section className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsAddingSimulation(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FaPlus className="w-5 h-5" />
          Adicionar Dia de Trabalho
        </button>
      </section>

      {/* Formulário para adicionar nova simulação */}
      {isAddingSimulation && (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Adicionar Dia de Trabalho
            </h2>
            <button
              onClick={() => setIsAddingSimulation(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={newSimulation.date}
                onChange={(e) => setNewSimulation({ ...newSimulation, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Horas Trabalhadas
              </label>
              <input
                type="number"
                value={newSimulation.workHours}
                onChange={(e) => setNewSimulation({ ...newSimulation, workHours: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 8"
                step="0.5"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ganho Bruto (R$)
              </label>
              <input
                type="number"
                value={newSimulation.grossIncome}
                onChange={(e) => setNewSimulation({ ...newSimulation, grossIncome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 300.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Gasto com Combustível (R$)
              </label>
              <input
                type="number"
                value={newSimulation.fuelExpense}
                onChange={(e) => setNewSimulation({ ...newSimulation, fuelExpense: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 50.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Outras Despesas (R$)
              </label>
              <input
                type="number"
                value={newSimulation.otherExpenses}
                onChange={(e) => setNewSimulation({ ...newSimulation, otherExpenses: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 20.00"
                step="0.01"
                min="0"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observações
              </label>
              <textarea
                value={newSimulation.notes}
                onChange={(e) => setNewSimulation({ ...newSimulation, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Observações adicionais..."
                rows={2}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddSimulation}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </section>
      )}

      {/* Sumário Detalhado */}
      {uberSimulations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Resumo Detalhado</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Ganhos</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ganho Bruto Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(stats.totalGross)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Gastos com Combustível:</span>
                  <span className="font-medium text-red-500">{formatCurrency(stats.totalFuel)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Outras Despesas:</span>
                  <span className="font-medium text-red-500">{formatCurrency(stats.totalOther)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-900 dark:text-white font-medium">Ganho Líquido Total:</span>
                  <span className="font-medium text-green-500">{formatCurrency(stats.totalNet)}</span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Médias</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ganho Médio por Hora:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(stats.avgHourly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Horas Trabalhadas Total:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{stats.totalHours.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dias Trabalhados:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{uberSimulations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Média Diária:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(stats.totalNet / uberSimulations.length)}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Melhores Resultados</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Melhor Dia:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {stats.bestDay.date ? formatDate(stats.bestDay.date) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Valor Melhor Dia:</span>
                  <span className="font-medium text-green-500">
                    {formatCurrency(stats.bestDay.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Lista de Simulações */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Histórico de Dias</h2>
        
        {uberSimulations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Horas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ganho Bruto
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Combustível
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Outras Despesas
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ganho Líquido
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Por Hora
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {uberSimulations
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((simulation) => {
                    const netIncome = simulation.grossIncome - simulation.fuelExpense - simulation.otherExpenses;
                    const hourlyRate = simulation.workHours > 0 
                      ? netIncome / simulation.workHours 
                      : 0;
                      
                    return (
                      <tr key={simulation.id} className="bg-white dark:bg-gray-800">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatDate(simulation.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {simulation.workHours.toFixed(1)}h
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(simulation.grossIncome)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-500">
                          {formatCurrency(simulation.fuelExpense)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-500">
                          {formatCurrency(simulation.otherExpenses)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-500">
                          {formatCurrency(netIncome)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(hourlyRate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <button
                            onClick={() => handleRemoveSimulation(simulation.id)}
                            className="p-1 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            title="Excluir"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma simulação adicionada ainda. Adicione seu primeiro dia de trabalho para começar a acompanhar seus ganhos.
            </p>
          </div>
        )}
      </section>
    </div>
  );
} 