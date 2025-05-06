'use client';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { headerContent, heroContent, featuresContent, servicesContent } from '@/constants/index';
import { motion } from 'framer-motion';
import { 
  CalendarDays, 
  Clock, 
  Heart, 
  Shield, 
  ChevronRight, 
  ArrowRight, 
  Menu, 
  X, 
  Check,
  Users,
  Activity,
  MessagesSquare,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  
  // Handle scroll event to change header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = () => {
    router.push('/register');
  };
  
  const handleLoginClick = () => {
    router.push('/login');
  };

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      image: "/images/doctor1.jpg",
      quote: "Medico's real-time monitoring has revolutionized how I track patients with chronic heart conditions. The alert system has literally saved lives."
    },
    {
      id: 2,
      name: "James Wilson",
      role: "Patient",
      image: "/images/patient1.jpg", 
      quote: "Since using Medico to manage my diabetes, my health has improved dramatically. The medication reminders and tracking features are incredibly helpful."
    },
    {
      id: 3,
      name: "Dr. Michael Chen",
      role: "General Practitioner",
      image: "/images/doctor2.jpg",
      quote: "The dashboard provides all the vital information I need at a glance. It's improved my workflow efficiency by at least 40%."
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const pulse = {
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" 
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-white overflow-x-hidden">
      {/* Meta tags */}
      <Head>
        <title>Medico - Healthcare Monitoring System</title>
        <meta name="description" content="Advanced healthcare monitoring system connecting doctors and patients" />
      </Head>

      {/* Header with enhanced styling and animations */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full z-50 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? 'bg-white/90 shadow-md py-3' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with animation */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                <motion.span animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>M</motion.span>
              </div>
              <motion.span 
                className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600"
              >
                Medico
              </motion.span>
            </motion.div>

            {/* Desktop Navigation with hover effects */}
            <nav className="hidden md:flex items-center space-x-8">
              {headerContent.menus.map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.link}
                    className={`font-medium transition relative ${
                      item.active 
                        ? 'text-indigo-700' 
                        : 'text-gray-700 hover:text-indigo-600'
                    }`}
                  >
                    {item.title}
                    {item.active && (
                      <motion.div 
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Auth Buttons - Desktop with animations */}
            <div className="hidden md:flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                Login
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRegisterClick}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition"
              >
                Register Now
              </motion.button>
            </div>

            {/* Mobile Menu Button with animation */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <motion.div 
          initial={false}
          animate={isMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-md overflow-hidden border-t mt-2 shadow-lg"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {headerContent.menus.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={item.link}
                    className={`font-medium p-2 rounded transition ${
                      item.active 
                        ? 'text-indigo-700 bg-indigo-50' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/login');
                  }}
                  className="p-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium text-center"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/register');
                  }}
                  className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 text-white font-medium text-center"
                >
                  Register Now
                </motion.button>
              </div>
            </nav>
          </div>
        </motion.div>
      </motion.header>

      {/* Hero Section with animations */}
      <section className="relative pt-28 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 -right-64 w-96 h-96 rounded-full bg-indigo-200 filter blur-[80px] opacity-50"
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -10, 0],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-200 filter blur-[80px] opacity-50"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content with animations */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerChildren}
              className="text-center md:text-left"
            >
              <motion.div 
                variants={fadeIn}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-6 border border-indigo-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Healthcare Redefined
              </motion.div>
              <motion.h1 
                variants={fadeIn}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6"
              >
                Advanced <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600">Healthcare</span> Monitoring System
              </motion.h1>
              <motion.p 
                variants={fadeIn}
                className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0"
              >
                Connect with top medical experts, monitor health in real-time, and receive personalized care from anywhere, anytime.
              </motion.p>
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 15px 25px -5px rgba(79, 70, 229, 0.5)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition flex items-center justify-center"
                >
                  Get Started
                  <motion.span 
                    animate={{ x: [0, 5, 0] }} 
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowUpRight className="w-5 h-5 ml-2" />
                  </motion.span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </motion.div>
              
              {/* Trust indicators with animations */}
              <motion.div 
                variants={fadeIn}
                className="mt-12 flex flex-wrap justify-center md:justify-start gap-6"
              >
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <motion.div 
                    animate={pulse}
                    className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center"
                  >
                    <Users className="w-5 h-5 text-green-600" />
                  </motion.div>
                  <div className="ml-3">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="font-bold text-gray-800"
                    >
                      10,000+
                    </motion.p>
                    <p className="text-sm text-gray-500">Active Users</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <motion.div 
                    animate={pulse}
                    className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center"
                  >
                    <Activity className="w-5 h-5 text-blue-600" />
                  </motion.div>
                  <div className="ml-3">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="font-bold text-gray-800"
                    >
                      99.9%
                    </motion.p>
                    <p className="text-sm text-gray-500">Uptime</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="flex items-center bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <motion.div 
                    animate={pulse}
                    className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center"
                  >
                    <Shield className="w-5 h-5 text-purple-600" />
                  </motion.div>
                  <div className="ml-3">
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="font-bold text-gray-800"
                    >
                      HIPAA
                    </motion.p>
                    <p className="text-sm text-gray-500">Compliant</p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Right column - Interactive dashboard mockup */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative hidden md:block"
            >
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-40"></div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="relative bg-white p-6 rounded-2xl shadow-2xl border border-gray-100"
              >
                {/* Dashboard header */}
                <div className="mb-5 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold">M</div>
                    <span className="ml-2 font-semibold text-lg text-gray-800">Dashboard</span>
                  </div>
                  <div className="flex space-x-2">
                    <motion.div whileHover={{ scale: 1.1 }} className="w-3 h-3 rounded-full bg-red-400"></motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="w-3 h-3 rounded-full bg-yellow-400"></motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} className="w-3 h-3 rounded-full bg-green-400"></motion.div>
                  </div>
                </div>
                
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Image
                      src="/images/doctor2.jpg"
                      fill
                      priority
                      alt="Doctor with patient"
                      className="object-cover rounded-lg"
                      style={{ objectPosition: 'center top' }}
                    />
                  </motion.div>
                  
                  {/* Interactive overlay elements */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <div>
                      <p className="text-white font-medium">Patient Dashboard</p>
                      <p className="text-white/80 text-sm">Updated 2 minutes ago</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats cards with animations */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -right-16 top-12 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 0 0 rgba(239, 68, 68, 0)",
                          "0 0 0 10px rgba(239, 68, 68, 0.2)",
                          "0 0 0 0 rgba(239, 68, 68, 0)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3"
                    >
                      <Heart className="w-5 h-5 text-red-500" />
                    </motion.div>
                    <div>
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <motion.p 
                        animate={{ scale: [1, 1.04, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="text-lg font-bold text-gray-800"
                      >
                        75 BPM
                      </motion.p>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -left-16 bottom-40 bg-white p-4 rounded-xl shadow-lg border border-gray-100"
                >
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <Clock className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Appointment</p>
                      <p className="text-lg font-bold text-gray-800">Today, 2:00 PM</p>
                    </div>
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl"
                >
                  <h3 className="font-bold text-gray-800 mb-3">Doctor Dashboard</h3>
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Real-time patient monitoring</span>
                    </motion.div>
                    <motion.div 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Critical alerts system</span>
                    </motion.div>
                    <motion.div 
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="flex items-center"
                    >
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Patient management tools</span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with animations */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Animated background shapes */}
        <motion.div 
          animate={{ 
            x: [0, 20, 0],
            y: [0, -10, 0], 
            rotate: [0, 10, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-10 w-72 h-72 rounded-full bg-purple-100 opacity-30 blur-3xl"
        />
        <motion.div 
          animate={{ 
            x: [0, -30, 0],
            y: [0, 15, 0], 
            rotate: [0, -10, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 5 }}
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-100 opacity-30 blur-3xl"
        />
        
        <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4"
          >
            Key Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Why Choose Medico?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Our platform provides everything you need for modern healthcare management, combining advanced technology with user-friendly interfaces.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuresContent.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[100px] z-0 opacity-60" />
              <div className="relative z-10">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center mb-6"
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      
      {/* Services Section with enhanced animations */}
      <section id="services" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 right-0 w-96 h-96 rounded-full bg-blue-50 filter blur-[80px] opacity-30"
        />
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4"
            >
              Our Services
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700"
            >
              Comprehensive Healthcare Solutions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              We provide the best healthcare services tailored to your needs, combining expertise with cutting-edge technology.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesContent.map((service, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="h-48 bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-6 relative overflow-hidden"
                >
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, type: "spring" }}
                  >
                    <img 
                      src={service.icon} 
                      alt={service.title} 
                      className="h-32 object-contain transition-transform duration-300 group-hover:scale-110" 
                    />
                  </motion.div>
                  {/* Decorative dots */}
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-5 right-5 w-20 h-20 opacity-10"
                  >
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute top-0 left-0"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute top-0 right-0"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute bottom-0 left-0"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute bottom-0 right-0"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1/2 left-0 -translate-y-1/2"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute top-1/2 right-0 -translate-y-1/2"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute top-0 left-1/2 -translate-x-1/2"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                  </motion.div>
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <motion.button 
                    whileHover={{ x: 10 }}
                    className="text-indigo-600 font-medium flex items-center transition-all duration-300"
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with animations */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4"
            >
              Testimonials
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              What Our Users Say
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              Discover how Medico is transforming healthcare experiences for both doctors and patients alike.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
                }}
                className="bg-white rounded-xl p-8 shadow-lg relative border border-gray-100"
              >
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.2 }}
                  transition={{ delay: 0.3 }}
                  className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-indigo-400"
                >
                  <svg 
                    width="60" 
                    height="60" 
                    viewBox="0 0 60 60" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 30.6122V59H28.2245V30.6122H9.40816C9.40816 19.5918 17.2041 9.40816 28.2245 9.40816V0C12.2449 0 0 13.7755 0 30.6122ZM60 9.40816V0C44.0204 0 31.7755 13.7755 31.7755 30.6122V59H60V30.6122H41.1837C41.1837 19.5918 48.9796 9.40816 60 9.40816Z"/>
                  </svg>
                </motion.div>
                <div className="mb-6">
                  <p className="text-gray-600 italic relative z-10">{testimonial.quote}</p>
                </div>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden mr-4 flex-shrink-0 border-2 border-indigo-200">
                    <motion.img 
                      whileHover={{ scale: 1.15 }}
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section with enhanced animations */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 rounded-2xl shadow-xl overflow-hidden relative z-10"
        >
          <motion.div 
            animate={{ 
              x: [0, 100, 0], 
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0], 
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-white opacity-10 blur-2xl"
          />
          
          <div className="md:flex items-center relative z-10">
            <div className="p-10 md:p-12 lg:p-16 md:w-3/5">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Ready to transform your healthcare experience?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-indigo-100 text-lg mb-8"
              >
                Join thousands of doctors and patients who are already benefiting from our advanced healthcare monitoring system.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium shadow-md hover:bg-opacity-90 transition flex items-center justify-center"
                >
                  Register Now
                  <motion.span 
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, background: "rgba(255,255,255,0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLoginClick}
                  className="px-8 py-3 rounded-lg border border-white text-white font-medium hover:bg-white hover:bg-opacity-10 transition"
                >
                  Login
                </motion.button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="hidden md:block md:w-2/5 relative h-full min-h-[300px]"
            >
              <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
              <motion.img 
                initial={{ scale: 1.1 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                src="/images/doctor3.jpg" 
                alt="Doctor with tablet" 
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
      
      {/* Footer with animations */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8"
          >
            {/* Logo and description */}
            <div className="md:col-span-1">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex items-center mb-6"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 flex items-center justify-center text-white font-bold text-xl">
                  <motion.span animate={{ rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 5, repeat: Infinity }}>M</motion.span>
                </div>
                <span className="ml-2 text-2xl font-bold">Medico</span>
              </motion.div>
              <p className="text-gray-400 mb-6">
                Advanced healthcare monitoring system connecting doctors and patients for better health outcomes.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram'].map((social, i) => (
                  <motion.a 
                    key={social}
                    href="#"
                    whileHover={{ y: -5, color: '#fff' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="text-gray-400 hover:text-white transition"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                      {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                      {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
            
            {/* Footer links with animations */}
            {[
              { title: "Services", links: ["Remote Monitoring", "Doctor Consultations", "Health Analytics", "Medication Management"] },
              { title: "Company", links: ["About Us", "Careers", "Blog", "Contact Us"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Accessibility"] }
            ].map((column, colIndex) => (
              <div key={column.title}>
                <motion.h3 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + colIndex * 0.1 }}
                  className="text-white font-bold text-lg mb-4"
                >
                  {column.title}
                </motion.h3>
                <ul className="space-y-3">
                  {column.links.map((link, i) => (
                    <motion.li 
                      key={link}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) + (colIndex * 0.1) }}
                    >
                      <motion.a 
                        href="#" 
                        whileHover={{ x: 5, color: '#fff' }}
                        className="text-gray-400 hover:text-white transition inline-flex items-center"
                      >
                        <span>{link}</span>
                        <motion.span 
                          initial={{ opacity: 0, x: -5 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="w-3 h-3 ml-1" />
                        </motion.span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-8 mt-8 border-t border-gray-800 text-center md:flex md:justify-between"
          >
            <p className="text-gray-400">© 2025 Medico. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLoginClick}
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-indigo-700"
              >
                <MessagesSquare className="w-5 h-5 mr-2" /> 
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}