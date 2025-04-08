'use client';

interface CardProps {
  title: string;
  value: number;
  type?: 'default' | 'success' | 'blue' | 'danger' | 'warning';
}

export default function Card({ title, value, type = 'default' }: CardProps) {
  const formatValue = (value: number) => {
    // Formatação para exibir o valor como moeda se for possível
    if (Math.abs(value) < 1000) {
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      });
    }
    
    // Para valores maiores, utilizamos a formatação de moeda
    return new Intl.NumberFormat('pt-BR', {
      maximumFractionDigits: 0
    }).format(value);
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-400',
          icon: 'text-green-600 dark:text-green-500',
          shadow: 'shadow-sm shadow-green-200 dark:shadow-green-900/20',
          hover: 'hover:shadow-md hover:shadow-green-200/50 dark:hover:shadow-green-900/30'
        };
      case 'blue':
        return {
          background: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-400',
          icon: 'text-blue-600 dark:text-blue-500',
          shadow: 'shadow-sm shadow-blue-200 dark:shadow-blue-900/20',
          hover: 'hover:shadow-md hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30'
        };
      case 'danger':
        return {
          background: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-400',
          icon: 'text-red-600 dark:text-red-500',
          shadow: 'shadow-sm shadow-red-200 dark:shadow-red-900/20',
          hover: 'hover:shadow-md hover:shadow-red-200/50 dark:hover:shadow-red-900/30'
        };
      case 'warning':
        return {
          background: 'bg-amber-50 dark:bg-amber-900/20',
          border: 'border-amber-200 dark:border-amber-800',
          text: 'text-amber-700 dark:text-amber-400',
          icon: 'text-amber-600 dark:text-amber-500',
          shadow: 'shadow-sm shadow-amber-200 dark:shadow-amber-900/20',
          hover: 'hover:shadow-md hover:shadow-amber-200/50 dark:hover:shadow-amber-900/30'
        };
      default:
        return {
          background: 'bg-primary/5 dark:bg-primary/10',
          border: 'border-primary/20 dark:border-primary/20',
          text: 'text-primary dark:text-primary/90',
          icon: 'text-primary/80 dark:text-primary/70',
          shadow: 'shadow-sm shadow-primary/10 dark:shadow-primary/20',
          hover: 'hover:shadow-md hover:shadow-primary/20 dark:hover:shadow-primary/30'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`
        p-4 sm:p-5 rounded-xl border transition-all duration-200 
        transform hover:scale-[1.02] hover:shadow-md
        ${styles.background} ${styles.border} ${styles.shadow} ${styles.hover}
        w-full flex flex-col
      `}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 truncate">
        {title}
      </h3>
      <p className={`text-2xl font-bold ${styles.text} mt-auto`}>
        {formatValue(value)}
      </p>
    </div>
  );
} 