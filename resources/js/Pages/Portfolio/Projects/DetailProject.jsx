import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AnimatedContent from "@/Components/Animations/UI/AnimatedContent";
import FuturisticBackground from "@/Components/Animations/Background/FuturisticBackground";
import Footer from "@/Components/Footer";


function getDeviconClass(icon) {
    if (!icon) return null;
    if (icon.startsWith('devicon-')) return icon;
    return `devicon-${icon}-plain`;
}

function resolveTechStack(project) {
    if (project.tech_stacks && project.tech_stacks.length > 0) {
        return project.tech_stacks.map(ts => ({
            name: ts.name,
            icon: ts.icon,
        }));
    }
    if (project.tech_stack && project.tech_stack.length > 0) {
        return project.tech_stack.map(name => ({
            name,
            icon: name.toLowerCase().replace(/[\s.]+/g, ''),
        }));
    }
    return [];
}

function ImageSlider({ images, altText }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const sliderRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.3 }
        );

        if (sliderRef.current) {
            observer.observe(sliderRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!images || images.length <= 1 || !isInView || isHovered) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        
        return () => clearInterval(interval);
    }, [images, currentIndex, isInView, isHovered]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    if (!images || images.length === 0) return null;

    if (images.length === 1) {
        return (
            <img
                src={images[0]}
                alt={altText}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.015]"
            />
        );
    }

    return (
        <div 
            ref={sliderRef}
            className="relative w-full h-full group/slider overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div 
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {images.map((imgSrc, idx) => (
                    <img
                        key={idx}
                        src={imgSrc}
                        alt={`${altText} ${idx + 1}`}
                        className="w-full h-auto object-cover shrink-0"
                    />
                ))}
            </div>
            
            <button 
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity z-20"
            >
                <ChevronLeft size={20} />
            </button>
            <button 
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity z-20"
            >
                <ChevronRight size={20} />
            </button>
            
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-cyan-400' : 'bg-white/30'}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default function DetailProject({ project }) {
    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white bg-gray-900 font-retro-mono">
                Project not found
            </div>
        );
    }

    const screenshots = project.images?.length
        ? project.images.map((image, idx) => {
            let srcArray = [];
            if (Array.isArray(image.image_url)) {
                srcArray = image.image_url;
            } else if (image.image_url) {
                srcArray = [image.image_url];
            } else if (Array.isArray(image.image_path)) {
                srcArray = image.image_path.map(p => `/storage/${p}`);
            } else {
                srcArray = [`/storage/${image.image_path}`];
            }

            return {
                src: srcArray,
                alt: image.title || `${project.title} ${idx + 1}`,
                caption: image.description || project.description || 'Project screenshot',
            };
        })
        : [];
    const heroImage = project.image_url || (screenshots[0]?.src ? screenshots[0].src[0] : null);
    const techStack = resolveTechStack(project);

    return (
        <>
            <Head title={`Project - ${project.title}`} />

            <FuturisticBackground
                speed={1}
                particleCount={80}
                interactive={true}
                resolutionScale={0.75}
            />

            <div className="relative z-10 min-h-screen font-retro-mono" style={{ backgroundColor: 'transparent' }}>

                <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#050510]/60 border-b border-cyan-400/5">
                    <div className="max-w-[80%] 2xl:max-w-[80%] mx-auto px-6 py-4 flex items-center justify-between">
                        <a href="/" className="flex items-center gap-3 group">
                            <img src="/images/web_icon.png" alt="Logo" className="h-8 w-8 md:h-10 md:w-10 transition-transform duration-300 group-hover:scale-105" />
                            <span className="text-white font-extrabold text-sm md:text-lg tracking-wider font-retro-mono">
                                ZeeeHub
                            </span>
                        </a>
                        <Link
                            href={route('portfolio.index')}
                            className="inline-flex items-center gap-2 text-cyan-300/80 hover:text-cyan-300 transition-colors text-sm tracking-wide font-retro-mono"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back
                        </Link>
                    </div>
                </nav>

                <section className="pt-16 md:pt-24 pb-10 md:pb-14 px-6">
                    <div className="max-w-6xl mx-auto">
                        <AnimatedContent distance={30} direction="vertical" reverse={true} duration={1} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1}>
                            <div className="flex items-center gap-3 mb-6">
                                {project.is_featured && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] tracking-[0.2em] uppercase font-semibold text-cyan-200 bg-cyan-500/15 border border-cyan-400/30 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.1)]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                        Featured
                                    </span>
                                )}
                                <span className="text-[10px] tracking-[0.2em] uppercase text-cyan-300/60 font-semibold">
                                    {project.type ? project.type.toUpperCase() + " Project" : 'Personal Project'}
                                </span>
                            </div>
                        </AnimatedContent>

                        <AnimatedContent distance={40} direction="vertical" reverse={true} duration={1.2} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1} delay={0.1}>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 font-retro-pixel bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                                {project.title}
                            </h1>
                        </AnimatedContent>

                        <AnimatedContent distance={30} direction="vertical" reverse={true} duration={1} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1} delay={0.2}>
                            <p className="text-base sm:text-lg md:text-xl text-white/75 leading-relaxed max-w-3xl mb-8">
                                {project.description}
                            </p>
                            <div className="flex items-center gap-3 mb-14">
                                {project.demo_url && (
                                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#050510] bg-gradient-to-r from-cyan-400 to-sky-400 rounded-lg hover:from-cyan-300 hover:to-sky-300 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        Live Demo
                                    </a>
                                )}
                                {project.source_url && (
                                    <a href={project.source_url} target="_blank" rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-cyan-300/80 border border-cyan-400/20 rounded-lg hover:bg-cyan-400/5 hover:text-cyan-200 hover:border-cyan-400/35 transition-all duration-300">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                        Source Code
                                    </a>
                                )}
                            </div>
                        </AnimatedContent>

                        <AnimatedContent distance={60} direction="vertical" reverse={false} duration={1.4} ease="power3.out" initialOpacity={0} animateOpacity scale={0.98} threshold={0.1} delay={0.2}>
                            <div className="relative rounded-2xl overflow-hidden border border-cyan-400/10 group shadow-[0_0_40px_rgba(34,211,238,0.05)]">
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                                <div className="aspect-video bg-[#060614] flex items-center justify-center">
                                    {heroImage ? (
                                        <img src={heroImage} alt={project.title}
                                            className="h-full w-auto max-w-full object-cover mx-auto transition-transform duration-700 group-hover:scale-[1.02]" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-cyan-400/15 gap-4">
                                            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-xs tracking-[0.3em] uppercase text-cyan-400/20">No Preview Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </AnimatedContent>
                    </div>
                </section>

                {techStack.length > 0 && (
                    <section className="py-3 px-6">
                        <div className="max-w-6xl mx-auto">
                            <AnimatedContent distance={30} direction="vertical" reverse={true} duration={1} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1}>
                                <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/80 font-semibold">
                                    Built With
                                </span>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    {techStack.map((tech, idx) => {
                                        const iconClass = getDeviconClass(tech.icon);
                                        return (
                                            <div
                                                key={idx}
                                                className="group flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-400/[0.03] border border-cyan-400/10 hover:bg-cyan-400/[0.08] hover:border-cyan-400/25 transition-all duration-300"
                                            >
                                                {iconClass && (
                                                    <i className={`${iconClass} text-xl text-cyan-300/70 group-hover:text-cyan-300 transition-colors duration-300`} />
                                                )}
                                                <span className="text-sm text-white/80 group-hover:text-white transition-colors duration-300">
                                                    {tech.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </AnimatedContent>
                        </div>
                    </section>
                )}

                {/* Divider */}
                <div className="max-w-6xl mx-auto px-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                </div>
                
                {screenshots.length > 0 && (
                    <section className="py-16 px-6">
                        <div className="max-w-6xl mx-auto">
                            <AnimatedContent distance={30} direction="vertical" reverse={true} duration={1} ease="power3.out" initialOpacity={0} animateOpacity scale={1} threshold={0.1}>
                                <div className="mb-14 max-w-xl">
                                    <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-400/80 font-semibold">
                                        Documentation
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold mt-3 leading-snug font-retro-pixel bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                                        Application Screenshots
                                    </h2>
                                    <p className="text-sm text-white/50 mt-3 leading-relaxed">
                                        A visual walkthrough of the key screens and features.
                                    </p>
                                </div>
                            </AnimatedContent>

                            <div className="space-y-16 md:space-y-24">
                                {screenshots.map((screenshot, idx) => (
                                    <AnimatedContent
                                        key={idx}
                                        distance={50}
                                        direction="vertical"
                                        reverse={false}
                                        duration={1.2}
                                        ease="power3.out"
                                        initialOpacity={0}
                                        animateOpacity
                                        scale={0.98}
                                        threshold={0.1}
                                        delay={0.05}
                                    >
                                        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center`}>
                                            <div className={`lg:col-span-8 ${idx % 2 === 1 ? 'lg:order-2' : 'lg:order-1'}`}>
                                                <div className="relative rounded-xl overflow-hidden border border-cyan-400/8 group shadow-[0_0_30px_rgba(34,211,238,0.04)]">
                                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent z-10" />
                                                    <ImageSlider images={screenshot.src} altText={screenshot.alt} />
                                                </div>
                                            </div>

                                            <div className={`lg:col-span-4 ${idx % 2 === 1 ? 'lg:order-1' : 'lg:order-2'}`}>
                                                <div className="space-y-3">
                                                    <span className="text-[10px] tracking-[0.2em] uppercase text-cyan-400/40 font-semibold">
                                                        {String(idx + 1).padStart(2, '0')} / {String(screenshots.length).padStart(2, '0')}
                                                    </span>
                                                    <h3 className="text-lg md:text-xl font-semibold text-cyan-200/90 font-retro-pixel">
                                                        {screenshot.alt}
                                                    </h3>
                                                    <p className="text-sm text-white/60 leading-relaxed">
                                                        {screenshot.caption}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </AnimatedContent>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <div className="max-w-6xl mx-auto px-6">
                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent" />
                </div>

                <div className="h-8" />
                
                <Footer />
            </div>
        </>
    );
}