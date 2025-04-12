'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';

// Rotas públicas que não requerem autenticação
const publicRoutes = [
  '/login', 
  '/login/recuperar-senha', 
  '/login/redefinir-senha',
  '/recuperar-senha',
  '/cadastro',
  '/resetar-senha'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Este efeito garante que o componente só será renderizado no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Não renderizamos nada durante a montagem do componente para evitar erros de hidratação
  if (!mounted) {
    return null;
  }

  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/login') {
      return pathname === '/login';
    }
    return pathname?.startsWith(route);
  });

  console.log('AuthProvider: Rota atual:', pathname, 'é pública:', isPublicRoute);

  // Se a rota for pública, renderiza o conteúdo diretamente
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se a rota for protegida, envolve o conteúdo com o ProtectedRoute
  return <ProtectedRoute>{children}</ProtectedRoute>;
} 