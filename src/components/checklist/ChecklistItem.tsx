import { motion } from 'framer-motion';
import { Check, ExternalLink } from 'lucide-react';
import { ChecklistItem as ChecklistItemType } from '../../types/election';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Translate } from '../ui/Translate';

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

interface ChecklistItemProps {
  item: ChecklistItemType;
  onToggle: (id: string) => void;
}

export const ChecklistItem = ({ item, onToggle }: ChecklistItemProps) => {
  return (
    <div 
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-sm cursor-pointer",
        item.completed ? "bg-gray-50 border-gray-100 opacity-75" : "bg-white border-gray-200 hover:border-indigo/50"
      )}
      onClick={() => onToggle(item.id)}
    >
      {/* Custom Checkbox */}
      <div className="relative flex items-center justify-center shrink-0 mt-1">
        <input 
          type="checkbox"
          id={`check-${item.id}`}
          checked={item.completed}
          onChange={() => onToggle(item.id)}
          className="sr-only"
          aria-checked={item.completed}
        />
        <div 
          className={cn(
            "w-6 h-6 rounded border-2 flex items-center justify-center transition-colors",
            item.completed ? "bg-emerald border-emerald" : "bg-white border-gray-300"
          )}
        >
          {item.completed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Check className="w-4 h-4 text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex-grow">
        <label 
          htmlFor={`check-${item.id}`}
          className={cn(
            "text-lg font-bold block mb-1 cursor-pointer transition-all",
            item.completed ? "text-gray-400 line-through" : "text-navy"
          )}
        >
          <Translate text={item.title} />
        </label>
        <p className={cn(
          "text-sm transition-all",
          item.completed ? "text-gray-400 line-through" : "text-on-surface/70"
        )}>
          <Translate text={item.description} />
        </p>
      </div>

      {item.link && (
        <a 
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 text-indigo hover:bg-indigo/5 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
          onClick={(e) => e.stopPropagation()}
        >
          <span>Resource</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};
