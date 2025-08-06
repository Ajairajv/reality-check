import { motion } from 'framer-motion';

const Footer = () => {

  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 mt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-600/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
            {/* App info */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚔️</div>
              <div>
                <div className="text-white font-bold">Reality Check</div>
                <div className="text-sm text-gray-400">Level up your life, one quest at a time</div>
              </div>
            </div>

            {/* Motivational tagline */}
            <div className="text-sm text-gray-400 max-w-md text-center">
              Stay motivated, stay focused, and remember - every small step counts towards your greatness.
            </div>

            {/* Social/Links placeholder */}
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <span className="text-lg">💪</span>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-lg">🎯</span>
              </div>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <span className="text-lg">⚡</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 