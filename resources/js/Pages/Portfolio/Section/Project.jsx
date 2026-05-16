import AnimatedContent from "@/Components/Animations/UI/AnimatedContent";

export default function ProjectSection({ projects }) {
    return (
        <section id="project" className='min-h-[90vh] h-auto w-full flex justify-center font-retro-mono scroll-mt-24 '>
            <div className='max-w-[80%] 2xl:max-w-[85%] w-full'>
                <div className='flex flex-col'>
                    <AnimatedContent
                        distance={50}
                        direction="vertical"
                        reverse={true}
                        duration={1.2}
                        ease="power3.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1}
                        threshold={0}
                        delay={0.4}
                    >
                        <h2 className="text-4xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-700 text-center font-retro-pixel tracking-wider">Project</h2>
                        <p className="text-center italic text-white/90 font-retro-mono">A showcase of my work and projects.</p>
                    </AnimatedContent>
                    <div className='relative w-full h-auto py-10'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch'>
                            {projects.map((project, index) => (
                                <AnimatedContent
                                    key={index}
                                    distance={50}
                                    direction="vertical"
                                    reverse={false}
                                    duration={1.2}
                                    ease="power3.out"
                                    initialOpacity={0}
                                    animateOpacity
                                    scale={1}
                                    threshold={0}
                                    delay={0 + (index % 3) * 0.2}
                                >
                                    <div className='group relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/70 via-gray-800/50 to-gray-900/60 border border-gray-700/40 p-5 flex flex-col transition-all duration-500 hover:scale-[1.02] hover:border-cyan-400/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.45)] cursor-pointer'>
                                        {/* Glow / light layers */}
                                        <div className='pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500'>
                                            <div className='absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/25 via-blue-500/15 to-indigo-500/25 blur-xl'></div>
                                            <div className='absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_25%_20%,rgba(6,182,212,0.3),transparent_60%),radial-gradient(circle_at_80%_75%,rgba(79,70,229,0.3),transparent_60%)] mix-blend-screen'></div>
                                        </div>

                                        {/* Image wrapper */}
                                        <div className='relative mb-4'>
                                            <div className='aspect-video w-full overflow-hidden rounded-xl ring-1 ring-gray-600/40 group-hover:ring-cyan-400/40 transition-all duration-500'>
                                                <img
                                                    src={project.image_url || `/storage/${project.image_path}`}
                                                    alt={project.title}
                                                    width={600}
                                                    height={400}
                                                    className='h-full w-auto max-w-full object-contain mx-auto transition-transform duration-500 group-hover:scale-105'
                                                />
                                            </div>
                                            <div className='absolute inset-0 rounded-2xl bg-gradient-to-t from-gray-900/40 via-transparent to-transparent pointer-events-none'></div>
                                        </div>

                                        {/* Content */}
                                        <h3 className='text-lg sm:text-xl font-semibold bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent tracking-wide mb-2 font-retro-pixel'>
                                            {project.title}
                                        </h3>
                                        <p className='text-gray-300 text-sm leading-relaxed flex-1 font-retro-mono'>
                                            {project.description}
                                        </p>
                                        <div className='mt-4 flex flex-wrap gap-2'>
                                            {(project.tech_stacks && project.tech_stacks.length > 0
                                                ? project.tech_stacks.map((ts, i) => (
                                                    <span
                                                        key={i}
                                                        className='text-[10px] md:text-[11px] uppercase tracking-wide font-medium px-2 py-1 rounded-md text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] transition-colors duration-300 font-retro-mono inline-flex items-center gap-1.5'
                                                    >
                                                        {ts.icon && <i className={`devicon-${ts.icon}-plain text-[12px]`} />}
                                                        {ts.name}
                                                    </span>
                                                ))
                                                : project.tech_stack?.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className='text-[10px] md:text-[11px] uppercase tracking-wide font-medium px-2 py-1 rounded-md text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] transition-colors duration-300 font-retro-mono'
                                                    >
                                                        {tech}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                        <div className='mt-5 flex items-center justify-between text-xs'>
                                            <a
                                                href={project.source_url}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 transition-colors font-retro-mono'
                                            >
                                                <span>View Repo</span>
                                                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' className='w-4 h-4'>
                                                    <path d='M7 17L17 7' />
                                                    <path d='M7 7h10v10' />
                                                </svg>
                                            </a>
                                            <a
                                                href={`/me/projects/${project.id}`}
                                                target='_blank'
                                                rel='noopener noreferrer'>
                                                <span className='opacity-0 group-hover:opacity-100 text-cyan-300 transition-opacity duration-500 font-retro-mono'>Explore →</span>
                                            </a>

                                        </div>

                                        {/* Foreground subtle overlay */}
                                        <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-gray-900/10 to-gray-900/40 pointer-events-none'></div>
                                    </div>
                                </AnimatedContent>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}