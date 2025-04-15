/**
 * Formata um valor para moeda brasileira
 * @param value - Valor a ser formatado
 * @returns String formatada como moeda (ex: R$ 1.234,56)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Formata um número com casas decimais especificadas
 * @param value - Valor a ser formatado
 * @param decimals - Número de casas decimais (padrão: 2)
 * @returns String formatada com o número de casas decimais especificado
 */
export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Formata uma data para o formato brasileiro
 * @param date - Data a ser formatada (string ISO ou objeto Date)
 * @returns String formatada como data (ex: 01/01/2023)
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR');
}

/**
 * Formata uma data e hora para o formato brasileiro
 * @param date - Data a ser formatada (string ISO ou objeto Date)
 * @returns String formatada como data e hora (ex: 01/01/2023 13:45)
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('pt-BR') + ' ' + 
         dateObj.toLocaleTimeString('pt-BR', {
           hour: '2-digit',
           minute: '2-digit'
         });
} 