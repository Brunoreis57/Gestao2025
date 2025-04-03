'use client';

interface CardProps {
  title: string;
  value: number;
  type?: 'default' | 'success' | 'blue' | 'danger';
}

export default function Card({ title, value, type = 'default' }: CardProps) {
  const formatValue = (value: number) => {
    return value.toString();
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          background: 'bg-green-100 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          text: 'text-green-700 dark:text-green-400'
        };
      case 'blue':
        return {
          background: 'bg-blue-100 dark:bg-blue-900/20',
          border: 'border-blue-200 dark:border-blue-800',
          text: 'text-blue-700 dark:text-blue-400'
        };
      case 'danger':
        return {
          background: 'bg-red-100 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          text: 'text-red-700 dark:text-red-400'
        };
      default:
        return {
          background: 'bg-primary/10 dark:bg-primary/5',
          border: 'border-primary/20 dark:border-primary/10',
          text: 'text-primary dark:text-primary/90'
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${styles.background} ${styles.border}`}
    >
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
        {title}
      </h3>
      <p className={`text-xl font-bold ${styles.text}`}>
        {formatValue(value)}
      </p>
    </div>
  );
} 