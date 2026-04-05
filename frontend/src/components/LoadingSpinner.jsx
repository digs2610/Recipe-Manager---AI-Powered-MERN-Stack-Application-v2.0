import { motion } from 'framer-motion';

const LoadingSpinner = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-cyan-500/20"
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-cyan-400"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1 left-1 w-14 h-14 rounded-full border-4 border-transparent border-t-purple-400"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;