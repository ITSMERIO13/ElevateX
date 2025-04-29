// Landing.jsx
import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, ArrowDown, Filter, Clock, Users, Award, Send,Image } from 'lucide-react';
import RotatingText from '../animations/RotatingText';
import CountUp from '../animations/CountUp';
import GradientText from '../animations/GradientText';
import Masonry from '../animations/Masonry';
import TrueFocus from '../animations/TrueFocus';
import { Link } from 'react-router-dom';

// Register GSAP plugins
;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};


// Testimonial data
const data = [
  {
    id: 1,
    image: "https://picsum.photos/id/26/600/400",  // Tech conference setup
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400,
  },
  {
    id: 2,
    image: "https://picsum.photos/id/96/600/400",  // Coding/laptop image
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 3,
    image: "https://picsum.photos/id/42/600/400",  // Crowd/auditorium setting
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 4,
    image: "https://picsum.photos/id/60/600/400",  // Modern architecture for tech event
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 5,
    image: "https://picsum.photos/id/75/600/400",  // People gathering
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 6,
    image: "https://picsum.photos/id/116/600/400", // Electronic setup
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 7,
    image: "https://picsum.photos/id/119/600/400", // Large venue image
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 8,
    image: "https://picsum.photos/id/156/600/400", // Technical display
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 9,
    image: "https://picsum.photos/id/167/600/400", // Creative setting
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  },
  {
    id: 10,
    image: "https://picsum.photos/id/180/600/400", // Modern space
    height: Math.floor(Math.random() * (1000 - 400 + 1)) + 400
  }
];





// Upcoming events data
const upcomingEvents = [
    {
      id: 1,
      date: "May 15, 2025",
      title: "Spring Innovation Showcase",
      description: "Featuring top student projects and industry networking opportunities.",
      location: "Main Campus, Building A",
      img: "/img/inovation.jpeg"
    },
    {
      id: 2,
      date: "June 8, 2025",
      title: "Tech Mentorship Workshop",
      description: "Connect with industry professionals and receive project feedback.",
      location: "Virtual Event",
      img: "/img/mentorship.jpeg"
    },
    {
      id: 3,
      date: "July 22, 2025",
      title: "Summer Design Challenge",
      description: "A two-day intensive collaborative design sprint with prizes.",
      location: "Innovation Hub",
      img: "/img/design.jpeg"                
    }
  ];

function Landing() {
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const galleryRef = useRef(null);
  
  // Parallax effect with framer-motion
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  
  useEffect(() => {
    // Hero section animations with GSAP
    gsap.fromTo(".hero-text", 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 0.5 }
    );
    
    // Animate featured projects on scroll
    ScrollTrigger.batch(".project-card", {
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8
      }),
      start: "top bottom-=100",
      once: true
    });
    
    // Animate testimonials on scroll
    ScrollTrigger.batch(".testimonial-card", {
      onEnter: batch => gsap.to(batch, {
        opacity: 1,
        x: 0,
        stagger: 0.2,
        duration: 0.8
      }),
      start: "top bottom-=100",
      once: true
    });
    
    // Animate gallery items
    gsap.utils.toArray(".gallery-item").forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: "top bottom-=50",
        onEnter: () => {
          gsap.to(item, {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.1
          });
        },
        once: true
      });
    });
    
  }, []);
  gsap.registerPlugin(ScrollTrigger);

// Project data for the featured section
const processRef = useRef(null);
const timelineRef = useRef(null);

useEffect(() => {
  gsap.registerPlugin(ScrollTrigger);
  
  // Animate progress line
  gsap.fromTo(
    timelineRef.current,
    { width: '0%' },
    {
      width: '100%',
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: processRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    }
  );
}, []);

const processSteps = [
  {
    step: "01",
    title: "Project Submission",
    description: "Students submit innovative proposals through our platform for evaluation and selection.",
    icon: <Send className="w-6 h-6" />
  },
  {
    step: "02",
    title: "Review & Feedback",
    description: "Expert faculty evaluate submissions and provide valuable guidance for improvement.",
    icon: <Users className="w-6 h-6" />
  },
  {
    step: "03", 
    title: "Development Phase",
    description: "Selected projects are refined with dedicated mentorship and resources.",
    icon: <Clock className="w-6 h-6" />
  },
  {
    step: "04",
    title: "Showcase Exhibition",
    description: "Final projects are presented to industry professionals and the academic community.",
    icon: <Award className="w-6 h-6" />
  }
]
const testimonials = [
    {
      id: 1,
      quote: "The showcase program transformed my portfolio and helped me land my dream job. The mentorship was invaluable.",
      author: "Alex Johnson",
      role: "UX Design Graduate"
    },
    {
      id: 2,
      quote: "As a mentor, watching students grow throughout this program has been incredibly rewarding. The talent is outstanding.",
      author: "Sarah Chen",
      role: "Industry Mentor"
    },
    {
      id: 3,
      quote: "The collaborative environment and feedback sessions pushed my project to a level I didn't think was possible.",
      author: "Michael Rodriguez",
      role: "Full-Stack Developer"
    }
  ];
  
  return (
    <div className="font-sans antialiased text-gray-900 mt-5">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden bg-black">
  {/* Background with minimal grain texture */}
  <div className="absolute inset-0 z-0 opacity-20">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMjIyIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')]"></div>
  </div>
  
  {/* Animated geometric shapes in the background */}
  <div className="absolute inset-0 z-0 overflow-hidden">
    <motion.div 
      className="absolute w-64 h-64 rounded-full bg-white/5 blur-3xl"
      animate={{ 
        x: ['-10%', '60%', '-10%'],
        y: ['10%', '40%', '10%']
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute w-96 h-96 rounded-full bg-gray-800/40 blur-3xl"
      animate={{ 
        x: ['60%', '20%', '60%'],
        y: ['40%', '10%', '40%']
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
    />
  </div>

  <div className="absolute left-8 lg:left-16 top-1/2 transform -translate-y-1/2 z-10 hidden md:block w-1/3 lg:w-1/4"> 
  <motion.div
    animate={{ 
      y: [-20, 20, -20] 
    }}
    transition={{ 
      duration: 6,
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className="w-full"
  >
    <img 
      src="/img/rocket.png" 
      alt="Rocket illustration" 
      className="w-[400px] z-50 lg:w-[500px] h-auto filter drop-shadow-2xl transform rotate-[6deg] hover:rotate-0 transition-transform duration-500"
    />

         <motion.div 
      className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-32"
      initial={{ opacity: 0.7 }}
      animate={{ 
        opacity: [0.7, 0.9, 0.7],
        height: [32, 40, 32]
      }}
      transition={{ 
        duration: 1.5, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-full h-full bg-gradient-to-t from-orange-500/0 via-orange-500/50 to-white/80 rounded-b-full blur-md"></div>
    </motion.div>
  </motion.div>
</div>


  <div className="container mx-auto px-6 relative z-10 flex justify-end">
    <div className="max-w-2xl hero-text md:mr-12 lg:mr-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h5 className="text-gray-400 uppercase tracking-wider mb-3 font-medium">College Project Showcase</h5>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
   
          <span>Discover</span>
          <RotatingText
  texts={['Innovation', 'Creativity', 'Invention', 'Modernization!','Next-gen']}
  mainClassName="px-2 w-fit sm:px-2 md:px-3 bg-gray-200 text-black overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
  staggerFrom={"last"}
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "-120%" }}
  staggerDuration={0.025}
  splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
  transition={{ type: "spring", damping: 30, stiffness: 400 }}
  rotationInterval={2000}
/>
          
        </h1>
        <div className="h-1 w-24 bg-white mb-8"></div>
        <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed">
          A platform to showcase creativity, research, and engineering marvels from our brightest minds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
        <Link to={'/viewproject'}>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-white hover:bg-gray-100 text-black font-medium px-8 py-3 rounded-md flex items-center justify-center group"
          >
           Explore Projects
            <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
          </motion.button>
          </Link>
         
        </div>
      </motion.div>
    </div>
  </div>
  
  {/* Bottom Scroll Indicator */}
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 1.5 }}
    className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white text-center flex flex-col items-center"
  >
    <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/50 mb-4"></div>
    <p className="mb-2 text-sm font-medium text-gray-400 uppercase tracking-widest">Scroll</p>
  </motion.div>
  
  {/* Top right decorative element */}
  <div className="absolute top-8 right-8 flex items-center space-x-4 text-gray-400">
    <div className="w-6 h-px bg-gray-400"></div>
    <span className="text-xs uppercase tracking-widest">Est. 2025</span>
  </div>
</section>
      
      {/* About the Showcase */}
      <section className="py-24 bg-black">
  <div className="container mx-auto px-6">
    <div className="flex flex-col md:flex-row items-center gap-16">
      {/* Left side image with decorative elements */}
      <div className="md:w-1/2 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          {/* Main image */}
          <img 
            src="/img/setuo.jpeg" 
            alt="Project exhibition" 
            className="rounded-md shadow-2xl grayscale hover:grayscale-0 transition-all duration-500"
          />
          
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-white/20 rounded-md -z-10"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 border border-white/20 rounded-md -z-10"></div>
          
          {/* Stats overlay */}
          <div className="absolute -right-8 -bottom-8 bg-white text-black p-6 rounded-md shadow-lg">
            <div className="font-bold text-4xl">1</div>
            <div className="uppercase text-xs tracking-widest mt-1">Years of Excellence</div>
          </div>
        </motion.div>
      </div>
      
      {/* Right side content */}
      <div className="md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex items-center mb-2">
            <div className="h-px w-12 bg-gray-400 mr-4"></div>
            <span className="text-gray-400 uppercase text-sm tracking-widest">About</span>
          </div>
          
          <h2 className=" text-3xl md:text-4xl lg:text-5xl font-bold mb-8 p-1 text-white"><TrueFocus
sentence="Showcase Experience"
manualMode={true}
blurAmount={5}
borderColor="rgb(0, 216, 255)"
animationDuration={2}
pauseBetweenAnimations={1}
/></h2>
          
          <div className="space-y-6 text-gray-300">
            <p className="text-lg leading-relaxed">
              Our annual project showcase represents the pinnacle of student achievement and innovation at our college. Started in 2015, this exhibition brings together undergraduate and graduate students from diverse disciplines to present their groundbreaking research, creative designs, and technical solutions.
            </p>
            
            <p className="text-lg leading-relaxed">
              More than just a display of academic excellence, the showcase serves as a bridge between classroom learning and real-world application. It provides students with valuable opportunities to present their work to industry professionals, potential employers, and the wider academic community.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-3 gap-4">
            <div className="border border-white/20 p-6 rounded-md hover:bg-white/5 transition-colors">
          
              <div className="text-white font-bold text-3xl md:text-4xl mb-1">  <CountUp
  from={0}
  to={200}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>+</div>
              <div className="text-gray-400 text-sm">Projects</div>
            </div>
            <div className="border border-white/20 p-6 rounded-md hover:bg-white/5 transition-colors">
              <div className="text-white font-bold text-3xl md:text-4xl mb-1"><CountUp
  from={0}
  to={30}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>+</div>
              <div className="text-gray-400 text-sm">Classes</div>
            </div>
            <div className="border border-white/20 p-6 rounded-md hover:bg-white/5 transition-colors">
              <div className="text-white font-bold text-3xl md:text-4xl mb-1"><CountUp
  from={0}
  to={4}
  separator=","
  direction="up"
  duration={1}
  className="count-up-text"
/>+</div>
              <div className="text-gray-400 text-sm">Departments</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
</section>
    
      
      {/* How It Works */}
      <section className="bg-black text-white py-24" ref={processRef}>
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-3">Process</h2>
          <h3 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h3>
          <div className="h-1 w-24 bg-white mx-auto"></div>
        </motion.div>
        
        {/* Timeline Bar */}
        <div className="hidden md:block relative h-0.5 bg-zinc-800 max-w-4xl mx-auto mb-24">
          <div ref={timelineRef} className="absolute left-2 inset-0 bg-white origin-left"></div>
          
          {/* Timeline Dots */}
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className="absolute w-4 h-4 bg-white rounded-full top-1/2 transform -translate-y-1/2"
              style={{ left: `${index * 33.33}%` }}
            ></motion.div>
          ))}
        </div>
        
        {/* Process Steps */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {processSteps.map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                transition: { duration: 0.3 }
              }}
              className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 group hover:border-white transition-all duration-300"
            >
              <div className="flex items-center mb-6">
                <div className="bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center mr-4 text-white group-hover:bg-white group-hover:text-black transition-colors duration-300">
                  {item.icon}
                </div>
                <span className="text-xl font-bold text-gray-400">{item.step}</span>
              </div>
              
              <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
              
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "40%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-0.5 bg-white mt-6"
              ></motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Additional Visual Element */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center">
            <div className="h-px w-12 bg-gray-400"></div>
            <p className="mx-4 text-gray-400 text-sm uppercase tracking-wider">Begin Your Journey</p>
            <div className="h-px w-12 bg-gray-400"></div>
          </div>
        </motion.div>
      </div>
    </section>
      
      {/* Student Testimonials */}
      <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Student Testimonials</h2>
          <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Hear from students and mentors about their transformative showcase experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 transition-transform duration-300 hover:transform hover:-translate-y-2"
            >
              <div className="mb-6 flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-white text-xl mr-1">★</span>
                ))}
              </div>
              <p className="text-lg mb-8 font-light leading-relaxed">"{item.quote}"</p>
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center mr-4 text-xl font-bold">
                  {item.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-lg">{item.author}</h4>
                  <p className="text-gray-400 text-sm">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center">
            <div className="h-px w-12 bg-gray-400"></div>
            <p className="mx-4 text-gray-400 text-sm uppercase tracking-wider">Our Real Wealth</p>
            <div className="h-px w-12 bg-gray-400"></div>
          </div>
        </motion.div>
      </div>
    </section>
      
      {/* Gallery Section */}
      <section className="py-16 md:py-24 bg-white text-zinc-900">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <div className="text-center mb-12 md:mb-16">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-6 tracking-tight text-black">
        Gallery
      </h2>
      <div className="w-16 sm:w-24 h-1 bg-black mx-auto mb-4 md:mb-6"></div>
      <p className="text-lg sm:text-xl text-zinc-700 max-w-xl mx-auto">
        Moments captured from our past showcase events
      </p>
    </div>
    <div className="mb-8 md:mb-12">
      <Masonry data={data} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" />
    </div>

    <div className="text-center mt-8 md:mt-12">
      <button 
        className="bg-black hover:bg-zinc-800 text-white font-medium px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3 rounded-md transition-all duration-300 inline-flex items-center gap-2 group"
      >
        <span>View Full Gallery</span>
        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
      </button>
    </div>
  </div>
</section>

      
      {/* Upcoming Events & News */}
      <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-16 opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Upcoming Events & News</h2>
          <div className="w-0 h-1 bg-white mx-auto mb-6 animate-[expandWidth_1.2s_ease-out_0.3s_forwards]"></div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stay updated with the latest showcase events and innovation contests
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <div
              key={event.id}
              className="bg-zinc-900 border border-zinc-800 overflow-hidden transition-all duration-300 hover:translate-y-[-8px] opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Image Holder Component with Animation */}
              <div className="h-48 bg-zinc-800 flex items-center justify-center relative overflow-hidden group">
                <div className="flex flex-col items-center justify-center text-zinc-500 transform transition-transform duration-500 group-hover:scale-110">
                  <img src={event.img}/>
                </div>
                <div className="absolute top-4 left-4 bg-white text-black px-4 py-2 transform transition-transform duration-300 group-hover:-translate-y-1">
                  <p className="font-bold">{event.date}</p>
                </div>
                {/* Animated overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold mb-3 transform transition-all duration-300 hover:translate-x-1">{event.title}</h3>
                <p className="text-gray-400 mb-6">{event.description}</p>
                <div className="flex items-center text-gray-500 text-sm mb-6">
                  <Clock className="w-4 h-4 mr-2 animate-[pulseLight_3s_infinite]" />
                  <span>{event.location}</span>
                </div>
                <button 
                  className="mt-2 border border-white text-white hover:bg-white hover:text-black px-6 py-2 font-medium transition-all duration-300 w-full relative overflow-hidden group"
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:text-black">Learn More</span>
                  <span className="absolute inset-0 w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16 opacity-0 animate-[fadeIn_0.8s_ease-out_1.2s_forwards]">
          <button 
            className="bg-white hover:bg-gray-200 text-black font-medium px-8 py-3 inline-flex items-center gap-2 group transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative z-10">View All Events</span>
            <ArrowRight className="w-5 h-5 transform transition-all duration-300 group-hover:translate-x-1 relative z-10" />
            <span className="absolute inset-0 w-full h-full bg-white transform origin-left transition-transform duration-300 group-hover:origin-right"></span>
          </button>
        </div>
      </div>

      {/* Add keyframes for custom animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expandWidth {
          from { width: 0; }
          to { width: 24px; }
        }
        
        @keyframes pulseLight {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
      `}</style>
    </section>

      
    </div>
  );
}

export default Landing;