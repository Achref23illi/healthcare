'use client';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react'; 
import { headerContent, heroContent, featuresContent,servicesContent } from '@/constants/index';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      {/* Header */}
      <header className="flex w-full py-6 bg-[#f2f4ea]">
        <nav className="mx-auto flex w-full max-w-7xl flex-row items-center justify-between px-4">
          {/* Logo */}
          <div className="flex cursor-pointer flex-row items-center space-x-2">
            <span className="text-[#0c3948]">{headerContent.logo.icon}</span>
            <span className="text-2xl font-bold text-black-800">
              {headerContent.logo.title}
            </span>
          </div>

          {/* Menu Burger (visible sur les petits écrans) */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-[#0c3948] focus:outline-none">
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Menu Items (visible sur les écrans moyens et plus grands) */}
          <ul className="hidden md:flex flex-row space-x-8">
            {headerContent.menus.map((item, i) => (
              <Link href={item.link} key={i}>
                <li
                  className={`${
                    item.active ? "font-bold text-[#0c3948]" : "text-[#0c3948] font-bold"
                  } transition hover:text-sky-900`}
                >
                  {item.title}
                </li>
              </Link>
            ))}
          </ul>

          {/* Button (visible sur les écrans moyens et plus grands) */}
          <Link href="/register" className="hidden md:block">
            <button className="rounded-md bg-[#0c3948] px-7 py-3 font-semibold text-white transition hover:bg-sky-900/90 focus:outline-none">
              {headerContent.button}
            </button>
          </Link>
        </nav>

        {/* Menu Mobile (visible sur les petits écrans lorsque le menu est ouvert) */}
        {isMenuOpen && (
          <div className="md:hidden w-full bg-[#f2f4ea] absolute top-20 left-0 z-50">
            <ul className="flex flex-col space-y-4 p-4">
              {headerContent.menus.map((item, i) => (
                <Link href={item.link} key={i} onClick={toggleMenu}>
                  <li
                    className={`${
                      item.active ? "font-bold text-[#0c3948]" : "text-[#0c3948] font-bold"
                    } transition hover:text-sky-900`}
                  >
                    {item.title}
                  </li>
                </Link>
              ))}
              <Link href="/register" onClick={toggleMenu}>
                <li className="rounded-md bg-[#0c3948] px-7 py-3 font-semibold text-white text-center transition hover:bg-sky-900/90 focus:outline-none">
                  {headerContent.button}
                </li>
              </Link>
            </ul>
          </div>
        )}
      </header>

     {/* Hero Section */}
        <section className="w-full bg-[#f2f4ea]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 pt-8 md:grid-cols-2">
            {/* Main Content (centré sur mobile, aligné à gauche sur PC) */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left space-y-3 py-6 px-4">
              {/* Titre */}
              <h1 className="flex flex-col space-y-3 text-3xl md:text-6xl font-bold text-[#0c3948]">
                <span>For Best</span>
                <span>
                  <span className="border border-[#0c3948] px-2 md:px-4">Medical</span> and{" "}
                  <span className="text-sky-700">Health</span>
                </span>
                <span>Care Center</span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-gray-600 max-w-md">
                {heroContent.description}
              </p>

              {/* Boutons */}
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 pt-6">
                <Link href="/register">
                  <button className="rounded-md bg-[#0c3948] px-5 py-2 md:px-7 md:py-3 font-semibold text-white transition hover:bg-sky-900/90 focus:outline-none">
                    {headerContent.button}
                  </button>
                </Link>
                <button className="font-semibold text-sky-700 transition hover:text-sky-700 focus:outline-none">
                  See more
                </button>
              </div>
            </div>

            {/* Images (masquées sur mobile, visibles sur PC) */}
            <div className="hidden md:block relative">
              <div className="absolute left-15 top-1/4 z-10 -mt-20 h-100 w-100">
                <Image
                  className="object-contain transition-transform duration-300 hover:scale-110 active:scale-125"
                  src={heroContent.images.a}
                  fill
                  priority
                  alt="Doctor a"
                />
              </div>

              <div className="absolute right-4 top-4 z-10 h-[204px] w-[204px]">
                <Image
                  className="object-cover mb-10 transition-transform duration-300 hover:scale-110 active:scale-125"
                  src={heroContent.images.b}
                  fill
                  priority
                  alt="Doctor b"
                />
              </div>

              <div className="absolute left-105 top-65 z-10 h-[250px] w-[250px]">
                <Image
                  className="object-cover transition-transform duration-300 hover:scale-110 active:scale-125"
                  src={heroContent.images.c}
                  fill
                  priority
                  alt="Doctor c"
                />
              </div>

              {/* Patterns */}
              <div className="absolute right-0 z-0 h-full w-1/2 bg-[#0c3948]"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full bg-[#f2f4ea] pt-15 sm:pt-30">
          <ul className="grid grid-cols-1 rounded-t-[80px] bg-[#0c3948] p-4 sm:p-8 text-white md:grid-cols-4">
            {featuresContent.map((item, i) => (
              <li
                className="flex cursor-pointer flex-row place-content-center items-center space-x-4 rounded p-4 transition"
                key={i}
              >
                {/* Icône */}
                <div className="rounded bg-[#f2f4ea] p-3 text-[#0c3948]">{item.icon}</div>
                {/* Titre et description */}
                <div className="flex flex-col">
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="max-w-[150px] text-xs font-light">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Services Section */}
          <section id="services" className="w-full py-10 px-[10px] bg-[#f2f4ea] text-center">
                <h1 className=" md:text-4xl font-bold py-4">Our Services</h1>
                <div className="w-[10%] h-[2px] mx-auto my-2 bg-[#0c3948]" />
                <p className="text-gray-600 py-4 md:max-w-[1000px] mx-auto leading-10 tracking-wide">
                  We provide to you the best choices for you. Adjust it to your health needs and make sure you undergo treatment with our highly qualified doctors. You can consult with us which type of service is suitable for your health.
                </p>
                {/* Services Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 py-2">
                  {servicesContent.map((service, i) => (
                    <div key={i} className="py-5 px-7 bg-white rounded-lg shadow-md text-start md:max-w-[370px] mx-auto">
                      <img src={service.icon} className="py-5" alt={service.title} />
                      <h3 className="font-bold text-xl md:text-2xl py-2">{service.title}</h3>
                      <p className="text-gray-600 tracking-wide py-2">{service.desc}</p>
                    </div>
                  ))}
                </div>
          </section>


    </div>
  );
}