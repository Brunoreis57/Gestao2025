# GESTAO2025

Sistema de gestão de eventos e tarefas desenvolvido com Next.js 14, TypeScript e Tailwind CSS.

## Funcionalidades

- ✅ Gerenciamento de eventos
- 📅 Eventos recorrentes (diário, semanal, mensal)
- 🏷️ Sistema de marcadores personalizáveis
- 🌓 Tema claro/escuro
- 📱 Design responsivo
- 💾 Armazenamento local persistente

## Tecnologias Utilizadas

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) (Gerenciamento de estado)
- [Headless UI](https://headlessui.com/) (Componentes acessíveis)

## Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/GESTAO2025.git
```

2. Instale as dependências:
```bash
cd GESTAO2025
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse `http://localhost:3000` no seu navegador.

## Estrutura do Projeto

```
src/
  ├── app/              # Rotas e páginas
  │   ├── agenda/       # Página principal da agenda
  │   └── components/   # Componentes específicos da página
  ├── components/       # Componentes globais
  └── store/           # Gerenciamento de estado com Zustand
```

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes. 