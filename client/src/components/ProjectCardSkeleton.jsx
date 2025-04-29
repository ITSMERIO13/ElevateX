import React from 'react';
import { motion } from 'framer-motion';

const ProjectCardSkeleton = () => {
  return (
    <motion.div 
      className="bg-black border border-purple-900 rounded-xl overflow-hidden h-full flex flex-col"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    >
      {/* Thumbnail skeleton */}
      <div className="w-full h-48 bg-purple-900 bg-opacity-20 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
          animate={{ 
            x: ["calc(-100%)", "calc(100%)"], 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-grow space-y-4">
        {/* Title skeleton */}
        <div className="h-6 bg-purple-900 bg-opacity-20 rounded-md w-3/4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
            animate={{ 
              x: ["calc(-100%)", "calc(100%)"], 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              ease: "linear",
              delay: 0.2
            }}
          />
        </div>
        
        {/* Description lines skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-purple-900 bg-opacity-20 rounded-md w-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
              animate={{ 
                x: ["calc(-100%)", "calc(100%)"], 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "linear",
                delay: 0.3
              }}
            />
          </div>
          <div className="h-4 bg-purple-900 bg-opacity-20 rounded-md w-5/6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
              animate={{ 
                x: ["calc(-100%)", "calc(100%)"], 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "linear",
                delay: 0.4
              }}
            />
          </div>
          <div className="h-4 bg-purple-900 bg-opacity-20 rounded-md w-4/6 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
              animate={{ 
                x: ["calc(-100%)", "calc(100%)"], 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "linear",
                delay: 0.5
              }}
            />
          </div>
        </div>

        {/* SDG tags skeleton */}
        <div className="mt-auto">
          <div className="h-3 bg-purple-900 bg-opacity-20 rounded-md w-16 mb-2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
              animate={{ 
                x: ["calc(-100%)", "calc(100%)"], 
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "linear",
                delay: 0.6
              }}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="h-6 bg-purple-900 bg-opacity-20 rounded-full w-20 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
                animate={{ 
                  x: ["calc(-100%)", "calc(100%)"], 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.7
                }}
              />
            </div>
            <div className="h-6 bg-purple-900 bg-opacity-20 rounded-full w-24 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-800 to-transparent opacity-20"
                animate={{ 
                  x: ["calc(-100%)", "calc(100%)"], 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.8
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCardSkeleton;