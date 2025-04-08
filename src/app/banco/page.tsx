'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/Card';
import AddExpenseModal from '@/components/AddExpenseModal';
import EditFinancialDataModal from '@/components/EditFinancialDataModal';
import { useStore } from '@/store/useStore';
import { FaPencilAlt, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function BankPage() {
  const pathname = usePathname(); // Hook para obter o pathname atual
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = useState(false);
  const { financialData, expenses, addExpense, removeExpense, updateExpense, updateFinancialData } = useStore();
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  }, [totalDebito, totalCredito, totalRecorrente, updateFinancialData]);

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

  // Links de navegação para reutilização
  const navLinks = [
    { href: '/banco', label: 'Visão Geral' },
    { href: '/banco/contas', label: 'Contas Pessoais' },
    { href: '/banco/simulacao', label: 'Simulação Uber' }
  ];

  return (
    <div className="w-full py-4 space-y-6">
      {/* Header com menu para mobile */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Finanças</h1>
        <button 
          className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Banner com informação sobre persistência de dados */}
      {showInfoBanner && (
        <div className="relative bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 animate-fadeIn">
          <div className="flex items-start">
            <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                Os dados financeiros são salvos automaticamente no seu navegador. 
                <span className="hidden sm:inline"> Você pode retornar a qualquer momento e suas informações estarão preservadas.</span>
              </p>
            </div>
            <button
              onClick={() => setShowInfoBanner(false)}
              className="ml-4 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          {isSaving && (
            <div className="absolute top-1 right-10 flex items-center">
              <div className="animate-pulse mr-2 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
              <span className="text-xs text-blue-600 dark:text-blue-400">Salvando...</span>
            </div>
          )}
        </div>
      )}

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

      {/* Seção de Cards */}
      <section className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Resumo Financeiro
          </h2>
          <button
            onClick={() => setIsFinancialModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <FaPencilAlt className="w-4 h-4" />
            Editar Dados
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
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
          className="bg-primary hover:bg-primary/90 text-white px-4 py-3 sm:px-6 rounded-lg transition-colors shadow-sm hover:shadow-md font-medium"
          onClick={() => setIsExpenseModalOpen(true)}
        >
          Adicionar Gastos
        </button>
      </section>

      {/* Listas de Gastos */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-6">
        {/* Gastos Débito */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gastos Débito</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Gastos Crédito</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recorrentes</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
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
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 group">
      <div className="min-w-0 flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white truncate">{expense.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(expense.date).toLocaleDateString('pt-BR')} {expense.time && `às ${expense.time}`}
        </p>
      </div>
      <div className="text-right ml-4">
        <p className="font-medium text-primary dark:text-primary/90 whitespace-nowrap">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(expense.value)}
        </p>
        <div className="flex gap-2 mt-1 opacity-80 group-hover:opacity-100">
          <button
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline p-1"
            onClick={() => onEdit(expense.id, expense)}
          >
            Editar
          </button>
          <button
            className="text-xs text-red-600 dark:text-red-400 hover:underline p-1"
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