import AnimatedContent from "@/Components/Animations/UI/AnimatedContent";

const categoryLabelMap = {
    language: 'Languages',
    framework: 'Frameworks & Frontend',
    frontend: 'Frameworks & Frontend',
    database: 'Database & Tools',
    auth: 'Database & Tools',
    tool: 'Database & Tools',
    devops: 'Database & Tools',
    other: 'Database & Tools',
};

function normalizeSkillsInput(userSkills) {
    if (!Array.isArray(userSkills) || userSkills.length === 0) {
        return [];
    }

    const groups = new Map();

    userSkills.forEach((entry) => {
        const techStack = entry?.tech_stack ?? entry?.techStack ?? null;
        const category = techStack?.category ?? 'other';
        const label = categoryLabelMap[category] ?? 'Database & Tools';
        const name = techStack?.name ?? '';

        if (!name) {
            return;
        }

        if (!groups.has(label)) {
            groups.set(label, []);
        }

        groups.get(label).push({
            name,
            icon: techStack?.icon ?? null,
        });
    });

    return Array.from(groups.entries())
        .map(([label, items]) => ({ label, items }))
        .slice(0, 3);
}

export default function SkillsSection({ skills }) {
    const getDeviconClass = (icon) => {
        if (!icon) return null;
        if (icon.startsWith('devicon-')) return icon;
        return `devicon-${icon}-plain`;
    };

    const skillCategories = normalizeSkillsInput(skills);

    return (
        <section id="skills" className="relative w-full py-20 md:py-28 flex justify-center items-center scroll-mt-15">
            <div className="max-w-[80%] 2xl:max-w-[85%] w-full relative z-10">
                <AnimatedContent
                    distance={80}
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
                    <h2 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-700 text-center font-retro-pixel tracking-wider mb-2">
                        Skills
                    </h2>
                    <p className="text-center text-white/50 text-sm font-retro-mono mb-14">
                        Technologies and tools I work with daily.
                    </p>
                </AnimatedContent>

                {skillCategories.length === 0 && (
                    <div className="text-center text-white/50 font-retro-mono text-sm">
                        No skills data available.
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {skillCategories.map((category, catIdx) => (
                        <AnimatedContent
                            key={category.label}
                            distance={60}
                            direction="vertical"
                            reverse={false}
                            duration={1}
                            ease="power3.out"
                            initialOpacity={0}
                            animateOpacity
                            scale={1}
                            threshold={0.1}
                            delay={catIdx * 0.15}
                        >
                            <div className="space-y-5">
                                <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-cyan-400/90 font-semibold font-retro-mono">
                                    {category.label}
                                </span>

                                <div className="flex flex-wrap gap-3">
                                    {category.items.map((skill, idx) => (
                                        <div
                                            key={`${skill.name}-${idx}`}
                                            className="group flex items-center gap-2.5 px-3 py-2 md:px-4 md:py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] hover:border-cyan-400/30 transition-all duration-300 cursor-default"
                                        >
                                            {skill.icon ? (
                                                <i className={`${getDeviconClass(skill.icon)} text-base md:text-lg text-white/90 group-hover:text-cyan-400 transition-colors duration-300`} />
                                            ) : (
                                                <span className="w-4 h-4 rounded-sm border border-cyan-400/40 text-[10px] leading-4 text-center text-cyan-300/70 font-retro-mono">
                                                    #
                                                </span>
                                            )}
                                            <span className="text-xs md:text-sm text-white/90 group-hover:text-white transition-colors duration-300 font-retro-mono">
                                                {skill.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </AnimatedContent>
                    ))}
                </div>
            </div>
        </section>
    );
}
