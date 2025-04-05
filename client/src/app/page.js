'use client';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { headerContent, heroContent, featuresContent, servicesContent } from '@/constants/index';
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
  MessagesSquare
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Meta tags */}
      <Head>
        <title>Medico - Healthcare Monitoring System</title>
        <meta name="description" content="Advanced healthcare monitoring system connecting doctors and patients" />
      </Head>

      {/* Header with enhanced styling */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-xl">
                M
              </div>
              <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                Medico
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {headerContent.menus.map((item, i) => (
                <Link
                  href={item.link}
                  key={i}
                  className={`font-medium transition ${
                    item.active 
                      ? 'text-indigo-700' 
                      : 'text-gray-700 hover:text-indigo-600'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleLoginClick}
                className="font-medium text-indigo-600 hover:text-indigo-800 transition"
              >
                Login
              </button>
              <button
                onClick={handleRegisterClick}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition"
              >
                Register Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t mt-2 py-4 shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex flex-col space-y-4">
                {headerContent.menus.map((item, i) => (
                  <Link
                    href={item.link}
                    key={i}
                    className={`font-medium p-2 rounded transition ${
                      item.active 
                        ? 'text-indigo-700 bg-indigo-50' 
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.title}
                  </Link>
                ))}
                <div className="pt-4 border-t border-gray-200 flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/login');
                    }}
                    className="p-2 rounded-lg border border-indigo-600 text-indigo-600 font-medium text-center"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      router.push('/register');
                    }}
                    className="p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium text-center"
                  >
                    Register Now
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-28 md:pt-40 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="text-center md:text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-6">
                Healthcare Redefined
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Advanced <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500">Healthcare</span> Monitoring System
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                Connect with top medical experts, monitor health in real-time, and receive personalized care from anywhere, anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  Get Started
                </button>
                <button
                  onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-gray-800">10,000+</p>
                    <p className="text-sm text-gray-500">Active Users</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-gray-800">99.9%</p>
                    <p className="text-sm text-gray-500">Uptime</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-bold text-gray-800">HIPAA</p>
                    <p className="text-sm text-gray-500">Compliant</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right column - Image/Illustration */}
            <div className="relative hidden md:block">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-100 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-100 rounded-full filter blur-3xl opacity-40"></div>
              
              <div className="relative bg-white p-6 rounded-2xl shadow-xl">
                <div className="relative h-64 w-full mb-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/doctor2.jpg"
                    fill
                    priority
                    alt="Doctor with patient"
                    className="object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                </div>
                
                {/* Stats cards overlaying the image */}
                <div className="absolute -right-16 top-12 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                      <Heart className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Heart Rate</p>
                      <p className="text-lg font-bold text-gray-800">75 BPM</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -left-16 bottom-40 bg-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                      <Clock className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Next Appointment</p>
                      <p className="text-lg font-bold text-gray-800">Today, 2:00 PM</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-xl">
                  <h3 className="font-bold text-gray-800 mb-3">Doctor Dashboard</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Real-time patient monitoring</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Critical alerts system</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">Patient management tools</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-white to-indigo-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
            Key Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Choose Medico?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform provides everything you need for modern healthcare management, combining advanced technology with user-friendly interfaces.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuresContent.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-lg bg-indigo-100 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
              Our Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Comprehensive Healthcare Solutions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide the best healthcare services tailored to your needs, combining expertise with cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {servicesContent.map((service, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl group">
                <div className="h-48 bg-indigo-50 flex items-center justify-center p-6">
                  <img 
                    src={service.icon} 
                    alt={service.title} 
                    className="h-32 object-contain transition-transform duration-300 group-hover:scale-110" 
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.desc}</p>
                  <button className="text-indigo-600 font-medium flex items-center transition-all duration-300 group-hover:translate-x-2">
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - New */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-4">
              Testimonials
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how Medico is transforming healthcare experiences for both doctors and patients alike.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-8 shadow-lg relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2 text-indigo-400 opacity-20">
                  <svg 
                    width="60" 
                    height="60" 
                    viewBox="0 0 60 60" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 30.6122V59H28.2245V30.6122H9.40816C9.40816 19.5918 17.2041 9.40816 28.2245 9.40816V0C12.2449 0 0 13.7755 0 30.6122ZM60 9.40816V0C44.0204 0 31.7755 13.7755 31.7755 30.6122V59H60V30.6122H41.1837C41.1837 19.5918 48.9796 9.40816 60 9.40816Z"/>
                  </svg>
                </div>
                <div className="mb-6">
                  <p className="text-gray-600 italic relative z-10">{testimonial.quote}</p>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 overflow-hidden mr-4 flex-shrink-0">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section - New */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="md:flex items-center">
            <div className="p-10 md:p-12 lg:p-16 md:w-3/5">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to transform your healthcare experience?
              </h2>
              <p className="text-indigo-100 text-lg mb-8">
                Join thousands of doctors and patients who are already benefiting from our advanced healthcare monitoring system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRegisterClick}
                  className="px-8 py-3 rounded-lg bg-white text-indigo-600 font-medium shadow-md hover:bg-opacity-90 transition"
                >
                  Register Now
                </button>
                <button
                  onClick={handleLoginClick}
                  className="px-8 py-3 rounded-lg border border-white text-white font-medium hover:bg-white hover:bg-opacity-10 transition"
                >
                  Login
                </button>
              </div>
            </div>
            <div className="hidden md:block md:w-2/5 relative">
              <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
              <img 
                src="/images/doctor3.jpg" 
                alt="Doctor with tablet" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            {/* Logo and description */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                  M
                </div>
                <span className="ml-2 text-2xl font-bold">Medico</span>
              </div>
              <p className="text-gray-400 mb-6">
                Advanced healthcare monitoring system connecting doctors and patients for better health outcomes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Services</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Remote Monitoring</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Doctor Consultations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Health Analytics</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Medication Management</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">HIPAA Compliance</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 mt-8 border-t border-gray-800 text-center md:flex md:justify-between">
            <p className="text-gray-400">© 2025 Medico. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleLoginClick}
                className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <MessagesSquare className="w-5 h-5 mr-2" /> Contact Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}