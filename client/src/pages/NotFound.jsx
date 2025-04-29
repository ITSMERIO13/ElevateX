import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FuzzyText from "../animations/FuzzyText";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.h1
        className="text-9xl font-bold text-blue-500 drop-shadow-lg"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <FuzzyText 
    baseIntensity={0.2} 
    hoverIntensity={0.5} 
    enableHover={true}
>
  404
</FuzzyText>
      </motion.h1>


      <motion.p
        className="text-xl text-gray-300 mt-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      >
        
        Oops! The page you're looking for doesn't exist.
      </motion.p>

   
      <motion.div
        className="mt-6 text-6xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        🚀
      </motion.div>


      <motion.div
        className="mt-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Link
          to="/"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md transition duration-300"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
