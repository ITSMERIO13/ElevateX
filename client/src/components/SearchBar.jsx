import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileFocus={{ scale: 1.02, borderColor: '#b794f4' }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-center bg-black border border-purple-900 hover:border-purple-500 focus-within:border-purple-400 rounded-lg px-4 py-3 w-full transition-all duration-300"
    >
      <Search className="text-purple-400 mr-3" size={20} />
      <input
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow bg-transparent outline-none text-white placeholder-purple-200 focus:placeholder-purple-300"
      />
      {searchTerm && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setSearchTerm('')}
          className="ml-2 text-purple-400 hover:text-purple-300 focus:outline-none"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M18 6L6 18M6 6L18 18" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </motion.button>
      )}
    </motion.div>
  );
};

export default SearchBar;