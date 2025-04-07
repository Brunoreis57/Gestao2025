'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditFinancialDataModal from '@/components/EditFinancialDataModal';
import { useStore } from '@/store/useStore';
import { FaPencilAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function BankPage() {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const { financialData, expenses, addExpense, removeExpense, updateExpense, updateFinancialData } = useStore();

  const debitExpenses = expenses.filter(expense => expense.type === 'debit');
  const creditExpenses = expenses.filter(expense => expense.type === 'credit');
  const recurringExpenses = expenses.filter(expense => expense.recurring);

  // Calcula os totais
  const totalDebito = debitExpenses.reduce((total, expense) => total + expense.value, 0);
  const totalCredito = creditExpenses.reduce((total, expense) => total + expense.value, 0);
  const totalRecorrente = recurringExpenses.reduce((total, expense) => total + expense.value, 0);

  // Atualiza os valores bancários quando houver mudanças nos gastos
  useEffect(() => {
    // Recupera os valores base do localStorage ou usa os valores padrão
    const baseValues = JSON.parse(localStorage.getItem('base-financial-values') || JSON.stringify({
      saldoConta: 5000.0,
      limiteCredito: 8000.0,
      contasAbertas: 0,
    }));

    // Atualiza os valores considerando os valores base
    updateFinancialData({
      saldoConta: baseValues.saldoConta - totalDebito,
      limiteCredito: baseValues.limiteCredito - totalCredito,
      contasAbertas: totalRecorrente,
    });
  }, [totalDebito, totalCredito, totalRecorrente]);

  const handleAddExpense = (data: any) => {
    addExpense(data);
    setIsExpenseModalOpen(false);
  };

  const handleUpdateFinancialData = (data: any) => {
    // Salva os novos valores base no localStorage
    localStorage.setItem('base-financial-values', JSON.stringify(data));
    updateFinancialData(data);
    setIsFinancialModalOpen(false);
  };

  return (
    <div className="container mx-auto py-8 px-4 space-y-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Banco</h1>
        
        {/* Links para subpáginas */}
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/banco/contas" 
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-primary dark:text-primary-400 border border-primary/20 dark:border-primary/30 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
          >
            Contas Pessoais
          </Link>
          <Link 
            href="/banco/simulacao" 
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-primary dark:text-primary-400 border border-primary/20 dark:border-primary/30 rounded-lg hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
          >
            Simulação Uber
          </Link>
        </div>
      </div>

      {/* Seção de Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resumo Financeiro
          </h2>
          <button
            onClick={() => setIsFinancialModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaPencilAlt className="w-4 h-4" />
            Editar Dados
          </button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            title="Valor em Conta"
            value={financialData.saldoConta}
            type={financialData.saldoConta < 0 ? 'danger' : 'success'}
          />
          <Card
            title="Valor Crédito"
            value={financialData.limiteCredito}
            type={financialData.limiteCredito < 0 ? 'danger' : 'default'}
          />
          <Card
            title="Contas em Aberto do Mês"
            value={financialData.contasAbertas}
            type={financialData.contasAbertas > 0 ? 'warning' : 'success'}
          />
        </div>
      </section>

      {/* Botão Adicionar Gastos */}
      <section className="flex justify-end">
        <button
          className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
          onClick={() => setIsExpenseModalOpen(true)}
        >
          Adicionar Gastos
        </button>
      </section>

      {/* Listas de Gastos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gastos Débito */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gastos Débito</h2>
          <div className="space-y-3">
            {debitExpenses.length > 0 ? (
              debitExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={(id, data) => updateExpense(id, data)}
                  onDelete={removeExpense}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Nenhum gasto em débito registrado
              </p>
            )}
          </div>
        </div>

        {/* Gastos Crédito */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gastos Crédito</h2>
          <div className="space-y-3">
            {creditExpenses.length > 0 ? (
              creditExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={(id, data) => updateExpense(id, data)}
                  onDelete={removeExpense}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Nenhum gasto em crédito registrado
              </p>
            )}
          </div>
        </div>

        {/* Gastos Recorrentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recorrentes</h2>
          <div className="space-y-3">
            {recurringExpenses.length > 0 ? (
              recurringExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  onEdit={(id, data) => updateExpense(id, data)}
                  onDelete={removeExpense}
                />
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                Nenhum gasto recorrente registrado
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Modais */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={handleAddExpense}
      />
      <EditFinancialDataModal
        isOpen={isFinancialModalOpen}
        onClose={() => setIsFinancialModalOpen(false)}
        onSave={handleUpdateFinancialData}
        initialData={financialData}
      />
    </div>
  );
}

// Componente para exibir um item de gasto
function ExpenseItem({
  expense,
  onEdit,
  onDelete,
}: {
  expense: any;
  onEdit: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600">
      <div>
        <h3 className="font-medium text-gray-900 dark:text-white">{expense.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(expense.date).toLocaleDateString('pt-BR')} {expense.time && `às ${expense.time}`}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium text-primary dark:text-primary/90">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(expense.value)}
        </p>
        <div className="flex gap-2 mt-1">
          <button
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            onClick={() => onEdit(expense.id, expense)}
          >
            Editar
          </button>
          <button
            className="text-xs text-red-600 dark:text-red-400 hover:underline"
            onClick={() => {
              if (confirm('Tem certeza que deseja excluir este gasto?')) {
                onDelete(expense.id);
              }
            }}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
} 