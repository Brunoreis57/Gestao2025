'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaDatabase, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function BancoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showInfoBanner, setShowInfoBanner] = useState(true);
  const [showPersistenceInfo, setShowPersistenceInfo] = useState(false);

  // Verificar o localStorage para determinar se o banner já foi fechado anteriormente
  useEffect(() => {
    const bannerClosed = localStorage.getItem('banco-info-banner-closed') === 'true';
    if (bannerClosed) {
      setShowInfoBanner(false);
    }
  }, []);

  // Fechar o banner e salvar a preferência
  const handleCloseBanner = () => {
    setShowInfoBanner(false);
    localStorage.setItem('banco-info-banner-closed', 'true');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="space-y-6">
      {/* Banner informativo */}
      {showInfoBanner && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <FaDatabase className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-blue-800 dark:text-blue-300 text-sm">
                  Todos os dados são salvos automaticamente no navegador e persistirão entre sessões.
                  {' '}
                  <button 
                    onClick={() => setShowPersistenceInfo(!showPersistenceInfo)}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    {showPersistenceInfo ? 'Ver menos' : 'Saiba mais'}
                  </button>
                </p>
                {showPersistenceInfo && (
                  <div className="mt-2 text-blue-700 dark:text-blue-400 text-sm">
                    <p className="mb-1">• Os dados são armazenados no localStorage do navegador</p>
                    <p className="mb-1">• Para não perder dados, evite usar o modo de navegação anônima</p>
                    <p className="mb-1">• Limpar os dados/cache do navegador também removerá os dados salvos</p>
                    <p>• Estes dados são acessíveis apenas neste dispositivo e navegador</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={handleCloseBanner}
              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Links de navegação */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
        <Link
          href="/banco"
          className={`px-4 py-2 rounded-lg transition-colors ${
            isActive('/banco')
              ? 'bg-primary text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Principal
        </Link>
        <Link
          href="/banco/contas"
          className={`px-4 py-2 rounded-lg transition-colors ${
            isActive('/banco/contas')
              ? 'bg-primary text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Contas Pessoais
        </Link>
        <Link
          href="/banco/simulacao"
          className={`px-4 py-2 rounded-lg transition-colors ${
            isActive('/banco/simulacao')
              ? 'bg-primary text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Simulação Uber
        </Link>
      </div>

      {children}

      {/* Botão flutuante para mostrar informações sobre persistência */}
      {!showInfoBanner && (
        <button
          onClick={() => setShowPersistenceInfo(!showPersistenceInfo)}
          className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 text-primary dark:text-primary-400 p-3 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
          title="Informações sobre armazenamento de dados"
        >
          <FaInfoCircle className="w-6 h-6" />
        </button>
      )}

      {/* Modal de informações sobre persistência */}
      {!showInfoBanner && showPersistenceInfo && (
        <div className="fixed inset-0 bg-black/20 dark:bg-black/50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <FaDatabase className="w-5 h-5 text-primary" />
                Armazenamento de Dados
              </h3>
              <button
                onClick={() => setShowPersistenceInfo(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>
                Todos os dados inseridos nesta aplicação são salvos automaticamente e ficarão persistidos entre sessões.
              </p>
              <h4 className="font-medium text-gray-900 dark:text-white mt-4">Detalhes técnicos:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Os dados são armazenados no localStorage do navegador</li>
                <li>Não há envio para servidores externos</li>
                <li>Os dados são acessíveis apenas neste dispositivo e navegador</li>
                <li>Para não perder dados, evite usar o modo de navegação anônima</li>
                <li>Limpar os dados/cache do navegador também removerá os dados salvos</li>
              </ul>
              <button
                onClick={() => setShowPersistenceInfo(false)}
                className="w-full mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 