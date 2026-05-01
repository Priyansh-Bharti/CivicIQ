import { motion } from 'framer-motion';

interface ProgressRingProps {
  percentage: number;
}

export const ProgressRing = ({ percentage }: ProgressRingProps) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  let color = 'text-gray-200'; // 0%
  if (percentage > 0 && percentage < 50) color = 'text-indigo';
  else if (percentage >= 50 && percentage < 100) color = 'text-amber';
  else if (percentage === 100) color = 'text-emerald';

  return (
    <div
      className="relative flex items-center justify-center w-[120px] h-[120px]"
      aria-label={`Civic readiness: ${percentage}% complete`}
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="text-gray-100"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
        />
        {/* Progress circle */}
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          className={color}
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {/* Percentage text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          key={percentage}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-2xl font-bold font-hero text-navy"
        >
          {percentage}%
        </motion.span>
      </div>
    </div>
  );
};
