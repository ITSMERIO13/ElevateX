import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import OtherContext from '../context/OtherContext';
import ShinyText from '../animations/ShinetText';
import ProjectCardSkeleton from '../components/ProjectCardSkeleton';

const ProjectList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSDG, setSelectedSDG] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [delayedError, setDelayedError] = useState(false);

  const { viewProjects, projects = [], loading, error } = useContext(OtherContext);

  useEffect(() => {
    if (projects.length === 0) {
      viewProjects();
    }

    const timer = setTimeout(() => setIsLoaded(true), 300);

    const delayErrorTimer = setTimeout(() => {
      if (loading && projects.length === 0) {
        setDelayedError(true);
      }
    }, 12000);

    return () => {
      clearTimeout(timer);
      clearTimeout(delayErrorTimer);
    };
  }, [viewProjects, loading, projects.length]);

  const filteredProjects = projects.filter((project) => {
    const matchesSearchTerm = project.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSDG =
      selectedSDG === '' || project.sdgs?.map(String).includes(String(selectedSDG));
    return matchesSearchTerm && matchesSDG;
  });

  const sdgOptions = Array.from(
    new Set(projects.flatMap((project) => project.sdgs || []))
  ).sort((a, b) => Number(a) - Number(b));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white py-12 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-2">
            Discover Projects
          </h1>
          <ShinyText text="Find and explore innovative solutions making an impact" disabled={false} speed={3} className='custom text-lg' />
        </motion.div>

        {loading && !delayedError && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="cursor-default"
              >
                <ProjectCardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* API error */}
        {error && (
          <motion.div
            className="bg-black border border-purple-400 text-purple-300 p-4 rounded-lg text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* 12s fallback error */}
        {delayedError && !error && (
          <motion.div
            className="bg-black border border-red-400 text-red-300 p-4 rounded-lg text-center mt-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            Unable to fetch. Please check your internet connection.
          </motion.div>
        )}

        {/* Main UI if no error */}
        {!loading && !error && !delayedError && (
          <>
            <motion.div
              className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 space-y-4 md:space-y-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex-grow w-full md:w-auto md:max-w-md">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <div className="w-full md:w-auto">
                <FilterDropdown
                  selectedSDG={selectedSDG}
                  setSelectedSDG={setSelectedSDG}
                  sdgOptions={sdgOptions}
                />
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
            >
              {filteredProjects.map((project, index) =>
                project && (
                  <motion.div
                    key={project._id}
                    variants={itemVariants}
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 25px -5px rgba(156, 39, 176, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="cursor-pointer rounded-xl overflow-hidden bg-black border border-purple-900 hover:border-purple-500 transition-all duration-300"
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                )
              )}
            </motion.div>

            {filteredProjects.length === 0 && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center h-60 text-center"
              >
                <svg className="w-16 h-16 text-purple-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p className="text-xl text-purple-200">No projects found. Try adjusting your filters.</p>
              </motion.div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectList;
