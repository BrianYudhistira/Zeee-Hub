import AboutSection from "./Section/About";
import ProjectsSection from "./Section/Project";
import ContactSection from "./Section/Contact";
import HomeSection from "./Section/Home";
import { useEffect, useState } from "react";
import { Head, Link } from '@inertiajs/react';
import AnimatedContent from "@/Components/Animations/UI/AnimatedContent";
import { BiMenu } from 'react-icons/bi';
import Footer from "@/Components/Footer";
import Particles from "@/Components/Animations/Background/Particles";
import DarkVeil from "@/Components/Animations/Background/DarkVeil";

export default function Portfolio( {userphoto} ) {
    const [isTop, setIsTop] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const sections = document.querySelectorAll("section");
        
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        // Pilih semua link setiap kali ada perubahan
                        const navLinks = document.querySelectorAll("a#link");
                        navLinks.forEach((link) => {
                            link.classList.remove("text-blue-600"); // Reset warna
                            if (link.getAttribute("href") === `#${id}`) {
                                link.classList.add("text-blue-600"); // Tambahkan warna aktif
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.5, // Section harus terlihat 50% untuk dianggap aktif
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect(); // Bersihkan observer saat komponen unmount
    }, []);

    useEffect(() => {
        const menuTrigger = document.getElementById("menu-button");
        const navMenu = document.getElementById("nav-menu");
        const handleClickOutside = (event) => {
            if (navMenu && !navMenu.contains(event.target) && !menuTrigger.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if(window.scrollY > 0) {
                setIsTop(false);
            } else {
                setIsTop(true);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return(
        <>
            <Head title="Portfolio"/>
            <div className="w-full font-retro-mono">
                <div className="fixed inset-0 h-screen w-screen z-0 overflow-hidden">
                    <DarkVeil/>
                </div>
                <div className="fixed inset-0 h-screen w-screen z-10 overflow-hidden">
                    <Particles
                        particleColors={['#ffffff', '#ffffff']}
                        particleCount={300}
                        particleSpread={13}
                        speed={0.1}
                        particleBaseSize={100}
                        moveParticlesOnHover={true}
                        alphaParticles={false}
                        disableRotation={false}
                    />
                </div>
                <nav className={`w-full ${isTop ? 'bg-transparent' : 'bg-white/5 backdrop-blur-md'} fixed top-0 z-50 py-3 md:py-2 px-7 transition-colors duration-500`}>
                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={true}
                        duration={1.5}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0}
                        delay={0}
                    >
                        <div className="flex flex-row justify-between md:max-w-[80%] 2xl:max-w-[85%] w-full mx-auto items-center">
                            <div className="flex flex-row items-center">
                                <img src="/images/web_icon.png" alt="Logo" className="h-7 md:h-10" />
                                <span className="text-white font-extrabold text-sm md:text-lg">ZeeeHub</span>
                            </div>
                            <ul className="hidden md:flex space-x-4 p-4 gap-3 text-lg text-white">
                                <li><a href="#home" id="link" className=" relative hover:text-blue-600 transition-colors duration-500 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-500 hover:after:w-full">Home</a></li>
                                <li><a href="#about" id="link" className=" relative hover:text-blue-600 transition-colors duration-500 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-500 hover:after:w-full">About</a></li>
                                <li><a href="#project" id="link" className=" relative hover:text-blue-600 transition-colors duration-500 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-500 hover:after:w-full">Projects</a></li>
                                <li><a href="#contact" id="link" className=" relative hover:text-blue-600 transition-colors duration-500 after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-500 hover:after:w-full">Contact</a></li>
                            </ul>
                            <div className="md:hidden">
                                <button aria-label="Menu Button" onClick={() => setMenuOpen(!menuOpen)}>
                                    <BiMenu id="menu-button" className="text-white h-8 w-8"/>
                                </button>
                            </div>
                        </div>
                    </AnimatedContent>
                    <div id="nav-menu" className={`top-full right-0 w-full overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
                        <ul className="flex flex-col px-2">
                            <li><a href="#home" id="link" className="block py-2 text-white hover:text-blue-600 transition-colors duration-500">Home</a></li>
                            <li><a href="#about" id="link" className="block py-2 text-white hover:text-blue-600 transition-colors duration-500">About</a></li>
                            <li><a href="#project" id="link" className="block py-2 text-white hover:text-blue-600 transition-colors duration-500">Projects</a></li>
                            <li><a href="#contact" id="link" className="block py-2 text-white hover:text-blue-600 transition-colors duration-500">Contact</a></li>
                        </ul>
                    </div>
                </nav>
                <div className="relative z-10">
                <HomeSection/>
                <AboutSection userphoto={userphoto}/>
                <ProjectsSection/>
                <ContactSection/>
                <Footer/>
                </div>
            </div>
        </>
    );
}