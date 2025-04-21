'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

export function AuthProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Este efeito garante que o componente só será renderizado no cliente
  useEffect(() => {
    setMounted(true);
    console.log('AuthProvider montado, pathname:', pathname);
  }, [pathname]);

  // Não renderizamos nada durante a montagem do componente para evitar erros de hidratação
  if (!mounted) {
    return null;
  }

  // Todas as rotas são públicas, não precisamos mais de proteção
  return <>{children}</>;
} 