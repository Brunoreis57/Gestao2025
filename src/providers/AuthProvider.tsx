'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/',  // Rota principal é pública pois realiza redirecionamento
  '/login', 
  '/recuperar-senha',
  '/cadastro',
  '/resetar-senha',
  '/healthcheck'  // Página de diagnóstico do sistema
];

// Verificar se uma rota começa com algum dos prefixos listados
const hasPublicPrefix = (path: string) => {
  return publicRoutes.some(route => path === route || path.startsWith(`${route}/`));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Este efeito garante que o componente só será renderizado no cliente
  useEffect(() => {
    setMounted(true);
    
    // Log para debug
    console.log('AuthProvider montado, pathname:', pathname);
    
    // Verificar rotas
    const isPublic = hasPublicPrefix(pathname || '');
    console.log('Rota é pública?', isPublic);
  }, [pathname]);

  // Não renderizamos nada durante a montagem do componente para evitar erros de hidratação
  if (!mounted) {
    return null;
  }

  // Verificação simplificada para determinar se a rota é pública
  const isPublicRoute = hasPublicPrefix(pathname || '');

  console.log('AuthProvider: Rota atual:', pathname, 'é pública:', isPublicRoute);

  // Se a rota for pública, renderiza o conteúdo diretamente
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se a rota for protegida, envolve o conteúdo com o ProtectedRoute
  return <ProtectedRoute>{children}</ProtectedRoute>;
} 