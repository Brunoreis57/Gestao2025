'use client';

import { Event } from '@/store/eventStore';

interface EventListItemProps {
  event: Event;
  onComplete: (id: string) => void;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
}

function EventListItem({ event, onComplete, onEdit, onDelete }: EventListItemProps) {
  const getMarkerBadgeStyles = () => {
    if (!event.marker) return '';

    switch (event.marker.color) {
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className={`py-3 px-4 border-b last:border-b-0 transition-all ${
      event.completed
        ? 'bg-green-50/30 dark:bg-green-900/10 opacity-50'
        : ''
    } relative`}>
      {event.completed && (
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-center pointer-events-none">
          <div className="w-full border-t-2 border-green-500/40 dark:border-green-500/20"></div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className={`text-base font-medium ${event.completed ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
            {event.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {event.date && (
              <span className={`text-sm ${event.completed ? 'text-gray-500/70 dark:text-gray-500/70' : 'text-gray-600 dark:text-gray-300'}`}>
                {new Date(event.date).toLocaleDateString('pt-BR')}
                {event.time && ` às ${event.time}`}
              </span>
            )}
            {event.marker && (
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${event.completed ? 'opacity-60' : ''} ${getMarkerBadgeStyles()}`}>
                {event.marker.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onComplete(event.id)}
            className={`p-1.5 rounded-full transition-colors ${
              event.completed
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            ✓
          </button>
          <button
            onClick={() => onEdit(event)}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            ✎
          </button>
          <button
            onClick={() => onDelete(event.id)}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventListItem; 