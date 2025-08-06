import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  const [currentQuote, setCurrentQuote] = useState(0);

  // Motivational quotes inspired by Suriya's philosophy and roles
  const quotes = [
    {
      text: "Success is not about the destination, it's about the journey and the courage to keep moving forward.",
      movie: "Soorarai Pottru"
    },
    {
      text: "Believe in yourself, work hard, and never give up. Your dreams are worth fighting for.",
      movie: "Jai Bhim"
    },
    {
      text: "Every challenge is an opportunity to prove your strength and determination.",
      movie: "24"
    },
    {
      text: "The greatest victory is conquering yourself and your limitations.",
      movie: "Ghajini"
    },
    {
      text: "Be the change you want to see in the world, and inspire others to do the same.",
      movie: "Singam"
    }
  ];

  // Cycle through quotes every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <footer className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 mt-16">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-600/5 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          {/* Suriya Image Section */}
          <motion.div 
            className="flex justify-center lg:justify-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full blur-md opacity-75"></div>
              
              {/* Image container */}
              <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-white/20 bg-gray-800">
                {/* Suriya SVG placeholder - Replace with actual photo */}
                <img 
                  src="/suriya-placeholder.svg" 
                  alt="Actor Suriya - Motivation" 
                  className="w-full h-full object-cover"
                />
                
                {/* To use an actual photo, replace the src above with: */}
                {/* <img 
                  src="/suriya-photo.jpg" 
                  alt="Actor Suriya" 
                  className="w-full h-full object-cover"
                /> */}
              </div>
              
              {/* Achievement badge */}
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ Inspiration
              </div>
            </div>
          </motion.div>

          {/* Quote Section */}
          <motion.div 
            className="text-center lg:text-left space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* Quote */}
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <blockquote className="text-lg lg:text-xl font-medium text-gray-200 italic leading-relaxed">
                "{quotes[currentQuote].text}"
              </blockquote>
              
              <div className="flex items-center justify-center lg:justify-start space-x-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500"></div>
                <cite className="text-sm text-purple-400 font-semibold not-italic">
                  Inspired by "{quotes[currentQuote].movie}"
                </cite>
              </div>
            </motion.div>

            {/* Quote indicators */}
            <div className="flex justify-center lg:justify-start space-x-2">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote 
                      ? 'bg-purple-500 w-6' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-700/50 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* App info */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">⚔️</div>
              <div>
                <div className="text-white font-bold">Reality Check</div>
                <div className="text-xs text-gray-400">Level up your life, one quest at a time</div>
              </div>
            </div>

            {/* Motivational tagline */}
            <div className="text-sm text-gray-400 max-w-md">
              Stay motivated, stay focused, and remember - every small step counts towards your greatness.
            </div>

            {/* Social/Links placeholder */}
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                <span className="text-xs">💪</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="text-xs">🎯</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                <span className="text-xs">⚡</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 