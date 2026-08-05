import AboutSection from "./Section/About";
import ExperienceSection from "./Section/Experience";
import SkillsSection from "./Section/Skills";
import ProjectsSection from "./Section/Project";
import ContactSection from "./Section/Contact";
import HomeSection from "./Section/Home";
import { useEffect, useState } from "react";
import { Head } from '@inertiajs/react';
import FuturisticBackground from "@/Components/Animations/Background/FuturisticBackground";
import { BiMenu } from 'react-icons/bi';
import Footer from "@/Components/Footer";

const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    { href: '#experience', label: 'Experience' },
    { href: '#project', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
];

export default function Portfolio({ portfolio }) {
    const [isTop, setIsTop] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        console.log("📦 Portfolio data received from Laravel:", portfolio);

        if (!portfolio) {
            console.warn("⚠️ Portfolio data is null or undefined!");
            return;
        }

        console.group("🔍 Portfolio Data Check");
        console.log("🏠 Home:", portfolio.home);
        console.log("👤 About:", portfolio.about);
        console.log("🧩 Projects:", portfolio.projects);
        console.log("📞 Contacts:", portfolio.contacts);
        console.groupEnd();
    }, [portfolio]);


    useEffect(() => {
        const sections = document.querySelectorAll("section");

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = entry.target.id;
                        const navLinks = document.querySelectorAll("a[data-nav-link]");
                        navLinks.forEach((link) => {
                            link.classList.remove("text-cyan-400");
                            if (link.getAttribute("href") === `#${id}`) {
                                link.classList.add("text-cyan-400");
                            }
                        });
                    }
                });
            },
            {
                threshold: 0.5,
            }
        );

        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
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
            if (window.scrollY > 0) {
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

    return (
        <>
            <Head title="Portfolio" />
            <FuturisticBackground
                speed={1}
                particleCount={80}
                interactive={true}
                resolutionScale={0.75}
            />
            <div className="w-full font-retro-mono">
                <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${isTop ? 'bg-transparent' : 'backdrop-blur-md bg-[#050510]/60 border-b border-white/5'}`}>
                    <div className="max-w-[80%] 2xl:max-w-[85%] w-full mx-auto py-4 flex items-center justify-between">
                        {/* Logo */}
                        <a href="/" className="flex items-center gap-3 group">
                            <img src="/images/web_icon.png" alt="Logo" className="h-8 w-8 md:h-10 md:w-10 transition-transform duration-300 group-hover:scale-105" />
                            <span className="text-white font-extrabold text-sm md:text-lg tracking-wider font-retro-mono">
                                ZeeeHub
                            </span>
                        </a>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    data-nav-link
                                    className="text-sm tracking-widest uppercase text-white/90 hover:text-cyan-400 transition-colors duration-300 font-retro-mono font-medium"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <div className="md:hidden">
                            <button aria-label="Menu Button" onClick={() => setMenuOpen(!menuOpen)}>
                                <BiMenu id="menu-button" className="text-white h-7 w-7" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    <div id="nav-menu" className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
                        <div className="px-6 pb-4 space-y-1 backdrop-blur-md bg-[#050510]/80">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    data-nav-link
                                    onClick={() => setMenuOpen(false)}
                                    className="block py-2.5 text-sm tracking-widest uppercase text-white/90 hover:text-cyan-400 transition-colors duration-300 font-retro-mono"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* ── Page Content ── */}
                <div className="relative z-10">
                    <HomeSection home={portfolio.home} />

                    {/* Divider */}
                    <div className="max-w-[80%] 2xl:max-w-[85%] mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                    </div>

                    <AboutSection about={portfolio.about} />

                    {/* Divider */}
                    <div className="max-w-[80%] 2xl:max-w-[85%] mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                    </div>

                    <SkillsSection skills={portfolio.user_skills ?? portfolio.userSkills ?? []} />

                    {/* Divider */}
                    <div className="max-w-[80%] 2xl:max-w-[85%] mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                    </div>

                    <ExperienceSection experiences={portfolio.experiences} />

                    {/* Divider */}
                    <div className="max-w-[80%] 2xl:max-w-[85%] mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                    </div>

                    <ProjectsSection projects={portfolio.projects} />

                    {/* Divider */}
                    <div className="max-w-[80%] 2xl:max-w-[85%] mx-auto">
                        <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                    </div>

                    <ContactSection contacts={portfolio.contacts} sosmedLinks={portfolio.home.social_media_links} />
                    <Footer />
                </div>
            </div>
        </>
    );
}