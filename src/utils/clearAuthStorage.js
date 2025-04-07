// Script para limpar dados de autenticação do localStorage
// Execute este script no console do navegador se estiver enfrentando problemas de autenticação

function clearAuthStorage() {
  console.log('Limpando dados de autenticação do localStorage...');
  
  // Remove os dados de autenticação
  localStorage.removeItem('auth-storage');
  
  // Opcionalmente, remove todos os dados do localStorage
  // localStorage.clear();
  
  console.log('Dados de autenticação limpos com sucesso!');
  console.log('Por favor, recarregue a página e tente fazer login novamente.');
}

// Executar a função
clearAuthStorage(); 