# Configuração do Firebase para o Projeto Gestão2025

Este documento explica como configurar o Firebase no seu ambiente de desenvolvimento local.

## Passo 1: Criar um projeto no Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Insira "Gestão2025" como o nome do projeto
4. Aceite os termos de serviço
5. Opcionalmente, desative o Google Analytics se não precisar (ou ative se quiser rastreamento)
6. Clique em "Criar projeto"

## Passo 2: Registrar seu aplicativo web

1. Na página inicial do seu projeto Firebase, clique no ícone "</>" (adicionar app da Web)
2. Dê um nome ao app, como "2025 GestãoWeb"
3. Opcionalmente, marque a opção para configurar o Firebase Hosting
4. Clique em "Registrar app"
5. Você verá um bloco de código com suas credenciais Firebase. Será algo como:

```js
const firebaseConfig = {
  apiKey: "AIzaSyC1a5XYZ...",
  authDomain: "gestao2025.firebaseapp.com",
  projectId: "gestao2025",
  storageBucket: "gestao2025.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456",
  measurementId: "G-ABCDEF123" // (se o Google Analytics estiver ativado)
};
```

## Passo 3: Configurar as variáveis de ambiente

1. Copie todas as credenciais do objeto `firebaseConfig` mostrado no console
2. Abra o arquivo `.env.local` na raiz do projeto
3. Substitua os valores de exemplo por suas credenciais reais:

```
NEXT_PUBLIC_FIREBASE_API_KEY=seu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id_aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id_aqui
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id_aqui
```

## Passo 4: Configurar serviços do Firebase

### Autenticação

1. No console do Firebase, navegue até "Authentication" (Autenticação)
2. Clique em "Começar"
3. Ative o método de login por email/senha

### Firestore Database

1. Navegue até "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha o modo de inicialização (recomendado começar com "modo de teste" para desenvolvimento)
4. Escolha a localização mais próxima para o banco de dados (ex: us-east1)
5. Clique em "Ativar"

### Storage (para armazenamento de arquivos)

1. Navegue até "Storage"
2. Clique em "Começar"
3. Escolha as regras de segurança (modo de teste para início)
4. Selecione a localização e clique em "Concluir"

## Passo 5: Configurar regras de segurança

Para um ambiente de produção, você precisa configurar regras de segurança adequadas. No projeto, já criamos arquivos com regras básicas de segurança que você pode usar como ponto de partida.

### Regras do Firestore

1. No console do Firebase, navegue até "Firestore Database"
2. Clique na aba "Regras"
3. Copie o conteúdo do arquivo `firestore.rules` deste projeto
4. Cole no editor de regras do Firestore
5. Clique em "Publicar"

Estas regras permitem que usuários acessem apenas seus próprios dados e que administradores acessem todos os dados.

### Regras do Storage

1. No console do Firebase, navegue até "Storage"
2. Clique na aba "Regras"
3. Copie o conteúdo do arquivo `storage.rules` deste projeto
4. Cole no editor de regras do Storage
5. Clique em "Publicar"

Estas regras permitem que usuários acessem apenas seus próprios arquivos, com uma exceção para uma pasta "public" que é acessível a todos.

## Passo 6: Reiniciar o servidor de desenvolvimento

Após configurar as variáveis de ambiente, reinicie o servidor de desenvolvimento para que as alterações sejam aplicadas:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

## Observações importantes

- **Nunca compartilhe suas credenciais do Firebase** ou envie o arquivo `.env.local` para repositórios públicos
- Adicione `.env.local` ao seu arquivo `.gitignore` se ainda não estiver lá
- Para ambientes de produção, configure as variáveis de ambiente no seu serviço de hospedagem (Vercel, Netlify, etc.)
- Defina regras de segurança adequadas no Firestore e Storage antes de implantar em produção
- Considere modificar as regras de segurança conforme suas necessidades específicas

## Solução de problemas

Se encontrar o erro "Firebase App named '[DEFAULT]' already exists", verifique se você não está inicializando o Firebase em vários lugares do seu código.

Se precisar testar localmente com dados de demonstração, use a função `generateDemoData()` disponível na página de simulação Uber. 