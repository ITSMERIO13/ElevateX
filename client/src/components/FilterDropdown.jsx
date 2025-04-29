import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Funnel, ChevronDown } from 'lucide-react';

const FilterDropdown = ({ selectedSDG, setSelectedSDG, sdgOptions }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle option selection
  const handleSelect = (value) => {
    setSelectedSDG(value);
    setIsOpen(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative w-full md:w-auto"
    >
      {/* Dropdown Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center justify-between w-full md:w-48 bg-black border border-purple-900 hover:border-purple-500 rounded-lg px-4 py-3 text-white focus:outline-none transition-all duration-300"
      >
        <div className="flex items-center">
          <Funnel className="text-purple-400 mr-2" size={18} />
          <span className="truncate">
            {selectedSDG ? `SDG ${selectedSDG}` : 'All SDGs'}
          </span>
        </div>
        <ChevronDown
          className={`text-purple-400 ml-2 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          size={18}
        />
      </motion.button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-2 bg-black border border-purple-800 rounded-lg shadow-lg overflow-hidden"
            style={{ maxHeight: '250px', overflowY: 'auto' }}
          >
            <div className="py-1">
              <motion.div
                onClick={() => handleSelect('')}
                whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                className={`px-4 py-2 cursor-pointer ${
                  selectedSDG === '' ? 'bg-purple-900 bg-opacity-30 text-purple-300' : 'text-white'
                }`}
              >
                All SDGs
              </motion.div>
              
              {sdgOptions.map((sdg, index) => (
                <motion.div
                  key={index}
                  onClick={() => handleSelect(sdg)}
                  whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.15)' }}
                  className={`px-4 py-2 cursor-pointer ${
                    selectedSDG === sdg ? 'bg-purple-900 bg-opacity-30 text-purple-300' : 'text-white'
                  }`}
                >
                  SDG {sdg}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FilterDropdown;