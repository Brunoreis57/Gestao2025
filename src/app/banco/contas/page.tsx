'use client';

import React, { useState } from 'react';
import { FaPlus, FaTimes, FaPencilAlt, FaCheck, FaBars } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Card from '@/components/Card';
import { useStore } from '@/store/useStore';

export default function ContasPage() {
  const pathname = usePathname(); // Hook para obter o pathname atual
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    categories,
    addCategory,
    removeCategory,
    updateCategory,
    personalDebts,
    addPersonalDebt,
    updatePersonalDebt,
    removePersonalDebt,
    toggleDebtPaid
  } = useStore();

  // Estados para o formulário de nova dívida
  const [newDebt, setNewDebt] = useState({
    description: '',
    amount: '',
    categoryId: '',
    date: '',
    paid: false
  });

  // Estados para o formulário de nova categoria
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  
  // Estados para edição de dívida
  const [editingDebtId, setEditingDebtId] = useState<string | null>(null);
  const [editDebt, setEditDebt] = useState({
    description: '',
    amount: '',
    categoryId: '',
    date: '',
    paid: false
  });

  // Estados para edição de categoria
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState({
    name: '',
    description: ''
  });
  
  // Links de navegação para reutilização
  const navLinks = [
    { href: '/banco', label: 'Visão Geral' },
    { href: '/banco/contas', label: 'Contas Pessoais' },
    { href: '/banco/simulacao', label: 'Simulação Uber' }
  ];

  // Função para adicionar nova dívida
  const handleAddDebt = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDebt.description || !newDebt.amount || !newDebt.categoryId || !newDebt.date) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    addPersonalDebt({
      description: newDebt.description,
      amount: parseFloat(newDebt.amount),
      categoryId: newDebt.categoryId,
      date: newDebt.date,
      paid: false
    });
    
    // Limpar formulário
    setNewDebt({
      description: '',
      amount: '',
      categoryId: '',
      date: '',
      paid: false
    });
  };

  // Função para adicionar nova categoria
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategory) {
      alert('Por favor, informe o nome da categoria');
      return;
    }
    
    addCategory({
      name: newCategory,
      description: newCategoryDescription || ''
    });
    
    setNewCategory('');
    setNewCategoryDescription('');
  };

  // Função para iniciar edição de dívida
  const startEditDebt = (debt: any) => {
    setEditingDebtId(debt.id);
    setEditDebt({
      description: debt.description,
      amount: debt.amount.toString(),
      categoryId: debt.categoryId,
      date: debt.date,
      paid: debt.paid
    });
  };

  // Função para iniciar edição de categoria
  const startEditCategory = (category: any) => {
    setEditingCategoryId(category.id);
    setEditCategory({
      name: category.name,
      description: category.description || ''
    });
  };

  // Função para salvar edição de dívida
  const saveEditDebt = () => {
    if (!editDebt.description || !editDebt.amount || !editDebt.categoryId || !editDebt.date) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    
    if (editingDebtId !== null) {
      updatePersonalDebt(editingDebtId, {
        description: editDebt.description,
        amount: parseFloat(editDebt.amount),
        categoryId: editDebt.categoryId,
        date: editDebt.date,
        paid: editDebt.paid
      });
      
      setEditingDebtId(null);
    }
  };

  // Função para salvar edição de categoria
  const saveEditCategory = () => {
    if (!editCategory.name) {
      alert('Por favor, informe o nome da categoria');
      return;
    }
    
    if (editingCategoryId !== null) {
      updateCategory(editingCategoryId, {
        name: editCategory.name,
        description: editCategory.description
      });
      
      setEditingCategoryId(null);
    }
  };

  // Cálculos para os cards
  const totalDebts = personalDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const pendingDebts = personalDebts.filter(debt => !debt.paid);
  const paidDebts = personalDebts.filter(debt => debt.paid);
  const totalPending = pendingDebts.reduce((sum, debt) => sum + debt.amount, 0);
  const totalPaid = paidDebts.reduce((sum, debt) => sum + debt.amount, 0);

  // Formate um valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="w-full py-4 space-y-6">
      {/* Header com menu para mobile */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Contas Pessoais</h1>
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
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">Resumo de Contas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-8 4xl:grid-cols-10 gap-4 md:gap-6">
          <Card
            title="Total de Dívidas"
            value={totalDebts}
            type="blue"
          />
          <Card
            title="Pendentes"
            value={totalPending}
            type="danger"
          />
          <Card
            title="Pagas"
            value={totalPaid}
            type="success"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 3xl:grid-cols-8 gap-6">
        {/* Formulário para adicionar dívida */}
        <div className="lg:col-span-2 xl:col-span-3 2xl:col-span-4 3xl:col-span-6 bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Adicionar Nova Dívida</h2>
          
          <form onSubmit={handleAddDebt} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  value={newDebt.description}
                  onChange={(e) => setNewDebt({...newDebt, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  placeholder="Descrição da dívida"
                />
              </div>
              
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Valor
                </label>
                <input
                  type="number"
                  id="amount"
                  value={newDebt.amount}
                  onChange={(e) => setNewDebt({...newDebt, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  placeholder="0,00"
                  step="0.01"
                />
              </div>
              
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  id="date"
                  value={newDebt.date}
                  onChange={(e) => setNewDebt({...newDebt, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Categoria
                </label>
                <select
                  id="categoryId"
                  value={newDebt.categoryId}
                  onChange={(e) => setNewDebt({...newDebt, categoryId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md shadow-sm"
              >
                <FaPlus className="mr-2" />
                Adicionar Dívida
              </button>
            </div>
          </form>
        </div>
        
        {/* Formulário para adicionar categoria */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Categorias</h2>
          
          <form onSubmit={handleAddCategory} className="mb-4 space-y-3">
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Nome da Categoria
              </label>
              <input
                type="text"
                id="categoryName"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Nome da categoria"
              />
            </div>
            
            <div>
              <label htmlFor="categoryDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <input
                type="text"
                id="categoryDescription"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                placeholder="Descrição (opcional)"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-md shadow-sm"
              >
                <FaPlus className="mr-2" />
                Adicionar Categoria
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Categorias Existentes</h3>
            <div className="max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {categories.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3 xl:w-1/4 2xl:w-1/6">
                          Nome
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3 xl:w-1/2 2xl:w-2/3">
                          Descrição
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/3 xl:w-1/4 2xl:w-1/6">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {categories.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          {editingCategoryId === category.id ? (
                            // Modo de edição
                            <>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <input
                                  type="text"
                                  value={editCategory.name}
                                  onChange={(e) => setEditCategory({...editCategory, name: e.target.value})}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                />
                              </td>
                              <td className="px-4 py-3">
                                <input
                                  type="text"
                                  value={editCategory.description}
                                  onChange={(e) => setEditCategory({...editCategory, description: e.target.value})}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                                />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={saveEditCategory}
                                  className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-3"
                                  title="Salvar"
                                >
                                  <FaCheck />
                                </button>
                                <button
                                  onClick={() => setEditingCategoryId(null)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  title="Cancelar"
                                >
                                  <FaTimes />
                                </button>
                              </td>
                            </>
                          ) : (
                            // Modo de visualização
                            <>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="text-sm text-gray-500 dark:text-gray-400">{category.description}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  onClick={() => startEditCategory(category)}
                                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                                  title="Editar"
                                >
                                  <FaPencilAlt />
                                </button>
                                <button
                                  onClick={() => {
                                    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
                                      removeCategory(category.id);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                  title="Excluir"
                                >
                                  <FaTimes />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-6">
                  Nenhuma categoria cadastrada
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de Dívidas */}
      <section className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Minhas Dívidas</h2>
        
        {personalDebts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-auto">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/4 xl:w-1/6 2xl:w-1/8">
                    Descrição
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6 xl:w-1/8 2xl:w-1/12">
                    Categoria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8 xl:w-1/12 2xl:w-1/16">
                    Vencimento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8 xl:w-1/12 2xl:w-1/16">
                    Valor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/8 xl:w-1/12 2xl:w-1/16">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-1/6 xl:w-1/8 2xl:w-1/12">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {personalDebts.map((debt) => (
                  <tr key={debt.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    {editingDebtId === debt.id ? (
                      // Modo de edição
                      <>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="text"
                            value={editDebt.description}
                            onChange={(e) => setEditDebt({...editDebt, description: e.target.value})}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={editDebt.categoryId}
                            onChange={(e) => setEditDebt({...editDebt, categoryId: e.target.value})}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                          >
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="date"
                            value={editDebt.date}
                            onChange={(e) => setEditDebt({...editDebt, date: e.target.value})}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <input
                            type="number"
                            value={editDebt.amount}
                            onChange={(e) => setEditDebt({...editDebt, amount: e.target.value})}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <select
                            value={editDebt.paid ? "true" : "false"}
                            onChange={(e) => setEditDebt({...editDebt, paid: e.target.value === "true"})}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:text-white"
                          >
                            <option value="false">Pendente</option>
                            <option value="true">Pago</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={saveEditDebt}
                            className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 mr-3"
                            title="Salvar"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => setEditingDebtId(null)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Cancelar"
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    ) : (
                      // Modo de visualização
                      <>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{debt.description}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {categories.find(cat => cat.id === debt.categoryId)?.name || 'Sem categoria'}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(debt.date).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatCurrency(debt.amount)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span 
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              debt.paid 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                          >
                            {debt.paid ? 'Pago' : 'Pendente'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleDebtPaid(debt.id)}
                            className={`${
                              debt.paid 
                              ? 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300' 
                              : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300'
                            } mr-3`}
                            title={debt.paid ? "Marcar como pendente" : "Marcar como pago"}
                          >
                            {debt.paid ? <FaTimes /> : <FaCheck />}
                          </button>
                          <button
                            onClick={() => startEditDebt(debt)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                            title="Editar"
                          >
                            <FaPencilAlt />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Tem certeza que deseja excluir esta dívida?')) {
                                removePersonalDebt(debt.id);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Excluir"
                          >
                            <FaTimes />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-6">
            Nenhuma dívida cadastrada
          </p>
        )}
      </section>
    </div>
  );
} 