import doctor1 from '../../public/images/doctor1.jpg'
import doctor2 from '../../public/images/doctor2.jpg'
import doctor3 from '../../public/images/doctor3.jpg'
import search_service from '../../public/images/search.png'
import consultation_service from '../../public/images/consultation.png'
import info_service from '../../public/images/info.png'


export const headerContent = {
  logo: {
    icon: (
      <img
        src="/favicon.ico" 
        alt="Medico Logo"
        className="h-10 w-10"
      />
    ),
    title: "Medico",
  },
  
  menus: [
    { title: "Home", link: "/", active: true },
    { title: "Our Service", link: "/" },
    { title: "About Us", link: "/" },
    { title: "Contact us", link: "/" },
  ],
  button: "Register Now",
};

export const heroContent = {
  description: "Revolutionizing healthcare with seamless access to top medical experts and personalized care—because your health deserves the best.",
  cta_button: "Register Now",
  images: {
    a: doctor2,
    b: doctor1,
    c: doctor3,
  },
};

export const featuresContent = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-10 w-10"
      >
        <path
          fillRule="evenodd"
          d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    title: "Free Support",
    description: "Always here to assist you, anytime, anywhere.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-10 w-10"
      >
        <path
          fillRule="evenodd"
          d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75A.75.75 0 0113.5 9zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z"
          clipRule="evenodd"
        />
      </svg>
    ),
    title: "Consulting",
    description: "Expert advice tailored to your healthcare needs.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-10 w-10"
      >
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
      </svg>
    ),
    title: "Online Care",
    description: "Healthcare anytime, anywhere.",
  },
];

export const servicesContent = [
  {
    icon: search_service,
    title: "Search doctor",
    desc: "Choose your doctor from thousands of specialists, general practitioners, and trusted hospitals.",
  },
  {
    icon: consultation_service,
    title: "Consultation",
    desc: "Free consultation with our trusted doctors and get the best recommendations.",
  },
  {
    icon: info_service,
    title: "Details info",
    desc: "Get detailed information about doctors and hospitals before making an appointment.",
  },
];
