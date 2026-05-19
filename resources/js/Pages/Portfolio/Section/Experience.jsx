import AnimatedContent from "@/Components/Animations/UI/AnimatedContent";
import { useEffect, useRef, useState } from "react";

function TimelineConnector({ isVisible }) {
    return (
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 hidden lg:block">
            <div
                className={`w-[2px] h-full bg-gradient-to-b from-cyan-400/60 via-sky-500/40 to-blue-700/20 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
            />
        </div>
    );
}

function TimelineDot({ index }) {
    return (
        <div className="absolute left-1/2 top-8 -translate-x-1/2 z-20 hidden lg:flex items-center justify-center">
            <div className="relative flex items-center justify-center">
                {/* Outer glow ring */}
                <div className="absolute w-8 h-8 rounded-full bg-cyan-400/20 animate-ping" />
                {/* Middle ring */}
                <div className="absolute w-6 h-6 rounded-full border-2 border-cyan-400/50" />
                {/* Inner dot */}
                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
            </div>
        </div>
    );
}

function formatPeriod(startDate, endDate) {
    const formatOptions = { month: "short", year: "numeric" };
    const start = startDate ? new Date(startDate).toLocaleDateString("en-US", formatOptions) : "";
    const end = endDate ? new Date(endDate).toLocaleDateString("en-US", formatOptions) : "Present";

    if (!start) {
        return end;
    }

    return `${start} - ${end}`;
}

function normalizeExperience(experience) {
    const rawSkills = experience.skills ?? experience.tech_stack ?? [];
    const skills = Array.isArray(rawSkills)
        ? rawSkills
        : String(rawSkills)
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean);

    return {
        ...experience,
        role: experience.role ?? experience.position ?? "Experience",
        period: experience.period ?? formatPeriod(experience.start_date, experience.end_date),
        skills,
        description: experience.description ?? "",
    };
}

function ExperienceCard({ experience, index, isLeft }) {
    return (
        <div
            className={`w-full lg:w-[calc(50%-2rem)] ${isLeft
                ? "lg:mr-auto lg:pr-4"
                : "lg:ml-auto lg:pl-4"
                }`}
        >
            <AnimatedContent
                distance={80}
                direction="horizontal"
                reverse={isLeft}
                duration={1.2}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.15}
                delay={0.1}
            >
                <div className="group relative">
                    {/* Connector line from dot to card (desktop only) */}
                    <div
                        className={`hidden lg:block absolute top-10 ${isLeft ? "right-0 translate-x-[calc(100%+0.25rem)]" : "left-0 -translate-x-[calc(100%+0.25rem)]"
                            } w-8 h-[2px] bg-gradient-to-r from-cyan-400/50 to-cyan-400/20`}
                    />

                    {/* Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl border border-gray-600/30 p-6 md:p-8 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/20 hover:border-cyan-400/40 hover:scale-[1.02]">
                        {/* Decorative corner accents */}
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-lg transition-colors duration-300 group-hover:border-cyan-400/50" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400/20 rounded-bl-lg transition-colors duration-300 group-hover:border-cyan-400/50" />

                        {/* Hover gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                        {/* Content */}
                        <div className="relative z-10">
                            {/* Period badge */}
                            <span className="inline-block px-3 py-1 mb-3 text-xs md:text-sm font-semibold tracking-wider text-cyan-200 bg-cyan-900/40 border border-cyan-500/30 rounded-full font-retro-mono">
                                {experience.period}
                            </span>

                            {/* Role */}
                            <h3 className="text-lg md:text-xl xl:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 font-retro-pixel tracking-wider mb-1">
                                {experience.role}
                            </h3>

                            {/* Company */}
                            <p className="text-sm md:text-base text-cyan-100/70 font-semibold font-retro-mono mb-3 flex items-center gap-2">
                                <svg
                                    className="w-4 h-4 text-cyan-400/70"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                                {experience.company}
                            </p>

                            {/* Description */}
                            <p className="text-sm md:text-base text-white/70 leading-relaxed font-retro-mono mb-4">
                                {experience.description}
                            </p>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-2">
                                {experience.skills.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 text-xs md:text-sm font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border border-cyan-400/50 rounded-md shadow-[3px_3px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_#0e3a5b] transition-all duration-200 font-retro-mono cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                            {experience.certificate_path && (
                                <div className="flex justify-end mt-4">
                                    <a
                                        href={`/storage/${experience.certificate_path}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs md:text-sm font-semibold text-cyan-300 hover:text-cyan-400 transition-colors duration-200"
                                    >
                                        View Certificate
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </AnimatedContent>
        </div>
    );
}

export default function Experience({ experiences }) {
    const timelineRef = useRef(null);
    const [lineVisible, setLineVisible] = useState(false);

    // Use prop data or fallback to dummy
    const data =
        experiences && experiences.length > 0
            ? experiences.map(normalizeExperience)
            : dummyExperiences.map(normalizeExperience);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLineVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (timelineRef.current) {
            observer.observe(timelineRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <section
            id="experience"
            className="relative w-full min-h-screen flex justify-center items-center font-mono scroll-mt-15 py-20"
        >
            <div className="max-w-[80%] 2xl:max-w-[85%] w-full relative z-10">
                {/* Section Header */}
                <div className="w-full p-3 md:p-5 xl:p-10 mb-10 md:mb-16">
                    <AnimatedContent
                        distance={100}
                        direction="vertical"
                        reverse={true}
                        duration={1.2}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0.2}
                        delay={0}
                    >
                        <h2 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-700 text-center font-retro-pixel tracking-wider">
                            Experience
                        </h2>
                        <p className="text-center italic text-white/90 mt-2">
                            My professional journey and career milestones.
                        </p>
                    </AnimatedContent>
                </div>
                <div className="flex justify-center mt-10">
                    <AnimatedContent
                        distance={30}
                        direction="vertical"
                        reverse={false}
                        duration={1}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0}
                        delay={0.3}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-xs text-cyan-300/60 font-retro-mono tracking-widest">
                                THE JOURNEY CONTINUES
                            </span>
                            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                        </div>
                    </AnimatedContent>
                </div>

                {/* Timeline */}
                <div ref={timelineRef} className="relative">
                    {/* Center vertical line (desktop) */}

                    <TimelineConnector isVisible={lineVisible} />

                    {/* Mobile vertical line (left side) */}
                    <div className="absolute left-4 top-0 bottom-0 lg:hidden">
                        <div
                            className={`w-[2px] h-full bg-gradient-to-b from-cyan-400/60 via-sky-500/40 to-blue-700/20 transition-all duration-1000 ${lineVisible ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    </div>

                    <div className="flex flex-col gap-12 md:gap-16">
                        {data.map((exp, index) => {
                            const isLeft = index % 2 === 0;

                            return (
                                <div key={exp.id || index} className="relative">
                                    {/* Desktop dot on center line */}
                                    <TimelineDot index={index} />

                                    {/* Mobile dot on left line */}
                                    <div className="absolute left-4 top-8 -translate-x-1/2 z-20 lg:hidden flex items-center justify-center">
                                        <div className="relative flex items-center justify-center">
                                            <div className="absolute w-6 h-6 rounded-full bg-cyan-400/20 animate-ping" />
                                            <div className="absolute w-5 h-5 rounded-full border-2 border-cyan-400/50" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                                        </div>
                                    </div>

                                    {/* Mobile: card with left offset */}
                                    <div className="lg:hidden pl-10">
                                        <AnimatedContent
                                            distance={60}
                                            direction="horizontal"
                                            reverse={false}
                                            duration={1}
                                            ease="power3.out"
                                            initialOpacity={0}
                                            animateOpacity
                                            scale={1}
                                            threshold={0.1}
                                            delay={0.1}
                                        >
                                            <div className="group relative">
                                                {/* Connector from dot to card */}
                                                <div className="absolute left-0 top-10 -translate-x-full w-4 h-[2px] bg-gradient-to-r from-cyan-400/20 to-cyan-400/50" />

                                                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-gray-900/80 backdrop-blur-xl border border-gray-600/30 p-5 md:p-6 shadow-2xl transition-all duration-500 hover:shadow-cyan-500/20 hover:border-cyan-400/40">
                                                    <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-lg transition-colors duration-300 group-hover:border-cyan-400/50" />
                                                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-cyan-400/20 rounded-bl-lg transition-colors duration-300 group-hover:border-cyan-400/50" />
                                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                                                    <div className="relative z-10">
                                                        <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold tracking-wider text-cyan-200 bg-cyan-900/40 border border-cyan-500/30 rounded-full font-retro-mono">
                                                            {exp.period}
                                                        </span>
                                                        <h3 className="text-base md:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 font-retro-pixel tracking-wider mb-1">
                                                            {exp.role}
                                                        </h3>
                                                        <p className="text-xs md:text-sm text-cyan-100/70 font-semibold font-retro-mono mb-2 flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5 text-cyan-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                            {exp.company}
                                                        </p>
                                                        <p className="text-xs md:text-sm text-white/70 leading-relaxed font-retro-mono mb-3">
                                                            {exp.description}
                                                        </p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {exp.skills.map((skill, i) => (
                                                                <span key={i} className="px-2 py-0.5 text-xs font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border border-cyan-400/50 rounded-md shadow-[2px_2px_0_0_#0e3a5b] font-retro-mono">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-end">
                                                            {exp.certificate_path && (
                                                                <a
                                                                    href={`/storage/${exp.certificate_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-400 transition-colors duration-200"
                                                                >
                                                                    View Certificate
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                    </svg>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </AnimatedContent>
                                    </div>

                                    {/* Desktop: alternating left-right cards */}
                                    <div className="hidden lg:block">
                                        <ExperienceCard
                                            experience={exp}
                                            index={index}
                                            isLeft={isLeft}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Timeline end cap */}
                    <div className="flex justify-center mt-10">
                        <AnimatedContent
                            distance={30}
                            direction="vertical"
                            reverse={false}
                            duration={1}
                            ease="power3.out"
                            initialOpacity={0}
                            animateOpacity
                            scale={1}
                            threshold={0}
                            delay={0.3}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
                                <span className="text-xs text-cyan-300/60 font-retro-mono tracking-widest">
                                    Starts
                                </span>
                            </div>
                        </AnimatedContent>
                    </div>
                </div>
            </div>
        </section>
    );
}