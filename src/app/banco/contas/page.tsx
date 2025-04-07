'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import Card from '@/components/Card';
import { FaPlus, FaTimes, FaPencilAlt, FaCheck, FaTrash } from 'react-icons/fa';

export default function ContasPage() {
  const {
    categories,
    addCategory,
    removeCategory,
    personalDebts,
    addPersonalDebt,
    removePersonalDebt,
    togglePersonalDebtPaid
  } = useStore();

  const [isAddingDebt, setIsAddingDebt] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newDebt, setNewDebt] = useState({
    name: '',
    value: '',
    categoryId: '',
    dueDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    color: '#3B82F6' // Cor padrão azul
  });
  const [isSaving, setIsSaving] = useState(false);

  // Função para mostrar o indicador de salvamento
  const showSavingIndicator = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  // Calcular totais
  const totalDebts = personalDebts.reduce((sum, debt) => sum + debt.value, 0);
  const unpaidDebts = personalDebts.filter(debt => !debt.paid);
  const totalUnpaidDebts = unpaidDebts.reduce((sum, debt) => sum + debt.value, 0);
  const paidDebts = personalDebts.filter(debt => debt.paid);
  const totalPaidDebts = paidDebts.reduce((sum, debt) => sum + debt.value, 0);

  // Agrupar dívidas por categoria
  const debtsByCategory = categories.map(category => {
    const debts = personalDebts.filter(debt => debt.categoryId === category.id);
    const total = debts.reduce((sum, debt) => sum + debt.value, 0);
    const unpaidTotal = debts.filter(debt => !debt.paid).reduce((sum, debt) => sum + debt.value, 0);
    
    return {
      category,
      debts,
      total,
      unpaidTotal
    };
  });

  const handleAddDebt = () => {
    if (!newDebt.name || !newDebt.value || !newDebt.categoryId) {
      alert('Por favor, preencha pelo menos o nome, valor e categoria da dívida');
      return;
    }

    addPersonalDebt({
      name: newDebt.name,
      value: parseFloat(newDebt.value),
      categoryId: newDebt.categoryId,
      dueDate: newDebt.dueDate,
      notes: newDebt.notes,
      paid: false
    });

    setNewDebt({
      name: '',
      value: '',
      categoryId: '',
      dueDate: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsAddingDebt(false);
    showSavingIndicator();
  };

  const handleAddCategory = () => {
    if (!newCategory.name) {
      alert('Por favor, insira um nome para a categoria');
      return;
    }

    addCategory({
      name: newCategory.name,
      color: newCategory.color
    });

    setNewCategory({
      name: '',
      color: '#3B82F6'
    });
    setIsAddingCategory(false);
    showSavingIndicator();
  };

  const handleTogglePaid = (id: string) => {
    togglePersonalDebtPaid(id);
    showSavingIndicator();
  };

  const handleRemoveDebt = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta dívida?')) {
      removePersonalDebt(id);
      showSavingIndicator();
    }
  };

  const handleRemoveCategory = (id: string) => {
    const debtsInCategory = personalDebts.filter(debt => debt.categoryId === id);
    if (debtsInCategory.length > 0) {
      alert(`Não é possível excluir esta categoria pois existem ${debtsInCategory.length} dívidas associadas a ela.`);
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      removeCategory(id);
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Controle de Contas e Gastos</h1>
        
        {/* Indicador de salvamento */}
        {isSaving && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full animate-pulse">
            <FaCheck className="w-4 h-4" />
            <span>Dados salvos automaticamente</span>
          </div>
        )}
      </div>

      {/* Cards de Resumo */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          title="Total de Dívidas"
          value={totalDebts}
          type="blue"
          valueType="currency"
        />
        <Card
          title="Total a Pagar"
          value={totalUnpaidDebts}
          type="red"
          valueType="currency"
        />
        <Card
          title="Total Pago"
          value={totalPaidDebts}
          type="green"
          valueType="currency"
        />
      </section>

      {/* Botões para adicionar */}
      <section className="flex flex-wrap gap-4">
        <button
          onClick={() => setIsAddingDebt(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <FaPlus className="w-5 h-5" />
          Adicionar Dívida
        </button>
        <button
          onClick={() => setIsAddingCategory(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <FaPlus className="w-5 h-5" />
          Nova Categoria
        </button>
      </section>

      {/* Formulário para adicionar nova dívida */}
      {isAddingDebt && (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Adicionar Nova Dívida
            </h2>
            <button
              onClick={() => setIsAddingDebt(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Dívida
              </label>
              <input
                type="text"
                value={newDebt.name}
                onChange={(e) => setNewDebt({ ...newDebt, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Cartão de crédito"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                value={newDebt.value}
                onChange={(e) => setNewDebt({ ...newDebt, value: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: 150.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Categoria
              </label>
              <select
                value={newDebt.categoryId}
                onChange={(e) => setNewDebt({ ...newDebt, categoryId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data de Vencimento
              </label>
              <input
                type="date"
                value={newDebt.dueDate}
                onChange={(e) => setNewDebt({ ...newDebt, dueDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Observações
              </label>
              <textarea
                value={newDebt.notes}
                onChange={(e) => setNewDebt({ ...newDebt, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Observações adicionais..."
                rows={2}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddDebt}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </section>
      )}

      {/* Formulário para adicionar nova categoria */}
      {isAddingCategory && (
        <section className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Adicionar Nova Categoria
            </h2>
            <button
              onClick={() => setIsAddingCategory(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Ex: Alimentação"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cor
              </label>
              <input
                type="color"
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="w-full h-10 px-1 py-1 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Adicionar Categoria
            </button>
          </div>
        </section>
      )}

      {/* Lista de Categorias */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Categorias de Gastos</h2>
        {categories.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {debtsByCategory.map(({ category, debts, total, unpaidTotal }) => (
              <div 
                key={category.id} 
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleRemoveCategory(category.id)}
                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    title="Excluir categoria"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">A pagar:</span>
                    <span className="font-medium text-red-500">{formatCurrency(unpaidTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Itens:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{debts.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhuma categoria adicionada ainda. Adicione sua primeira categoria para organizar suas dívidas.
            </p>
          </div>
        )}
      </section>

      {/* Lista de Dívidas */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dívidas e Contas a Pagar</h2>
        
        {personalDebts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {personalDebts
                  .sort((a, b) => {
                    // Primeiro os não pagos, depois por data de vencimento
                    if (a.paid !== b.paid) return a.paid ? 1 : -1;
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                  })
                  .map((debt) => {
                    const category = categories.find(cat => cat.id === debt.categoryId);
                    const isPastDue = !debt.paid && new Date(debt.dueDate) < new Date();
                    
                    return (
                      <tr 
                        key={debt.id} 
                        className={`${debt.paid ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-white dark:bg-gray-800'}`}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="font-medium">{debt.name}</div>
                          {debt.notes && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {debt.notes}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          {category && (
                            <div className="flex items-center gap-1.5">
                              <div 
                                className="w-2.5 h-2.5 rounded-full" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span className="text-gray-900 dark:text-white">{category.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {formatCurrency(debt.value)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className={`${isPastDue ? 'text-red-500 font-medium' : 'text-gray-900 dark:text-white'}`}>
                            {formatDate(debt.dueDate)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span 
                            className={`px-2 py-1 text-xs rounded-full ${
                              debt.paid 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : isPastDue
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {debt.paid 
                              ? 'Pago' 
                              : isPastDue 
                                ? 'Atrasado' 
                                : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleTogglePaid(debt.id)}
                              className={`p-1.5 rounded-full ${
                                debt.paid 
                                  ? 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300' 
                                  : 'text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                              }`}
                              title={debt.paid ? 'Marcar como não pago' : 'Marcar como pago'}
                            >
                              <FaCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveDebt(debt.id)}
                              className="p-1.5 rounded-full text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title="Excluir"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
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
              Nenhuma dívida adicionada ainda. Adicione sua primeira dívida para começar a controlar seus gastos.
            </p>
          </div>
        )}
      </section>
    </div>
  );
} 