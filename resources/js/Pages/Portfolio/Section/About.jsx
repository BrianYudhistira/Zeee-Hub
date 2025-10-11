import AnimatedContent from "@/Components/Animations/UI/AnimatedContent";
import ScrambledText from "@/Components/Animations/Text/ScrambledText";
import SplitText from "@/Components/Animations/Text/SplitText";
import Magnet from "@/Components/Animations/UI/Magnet";
import PixelCard from "@/Components/Animations/UI/PixelCard";

export default function AboutSection({ userphoto }) {
  return (
    <section id="about" className="relative w-full min-h-screen flex justify-center items-center font-mono scroll-mt-15 mb-20 scroll-mt-3">
      <div className="max-w-[80%] 2xl:max-w-[85%] w-full relative z-10">
        <div className="flex flex-col">
          <div className="w-full p-3 md:p-5 xl:p-10">
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
                About Me
              </h2>
              <p className="text-center italic text-white/90">
                A brief introduction about myself and my journey.
              </p>
            </AnimatedContent>
          </div>
          <div className="flex flex-col xl:flex-row xl:items-center py-3">
            <div className="w-full xl:w-1/2">
              <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={true}
                duration={1.2}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.1}
                delay={0.5}
              >
                <div className="relative flex justify-center items-center">
                  <Magnet
                    padding={50}
                    disabled={false}
                    magnetStrength={5}
                    innerClassName="relative w-auto h-[200vh] md:h-[75vh] lg:h-[80vh] xl:h-[80vh] 2xl:h-[80vh] max-h-[250px] md:max-h-[450px] lg:max-h-[450px] xl:max-h-[450px] 2xl:max-h-[600px] aspect-[3/4] bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-xl border border-gray-600/40 rounded-3xl p-3 shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 hover:scale-[1.02] group"
                  >
                      <div className="absolute top-0 left-0 w-full h-full rounded-3xl overflow-hidden pointer-events-none">
                        <div className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-t-2 border-r-2 border-cyan-400/30 rounded-tr-2xl animate-pulse"></div>
                        <div className="absolute bottom-2 left-2 w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-b-2 border-l-2 border-cyan-400/30 rounded-bl-2xl animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    <PixelCard className="absolute w-full h-full overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900" variant="blue">
                      <img
                        src={userphoto}
                        alt="User Photo"
                        weight={400}
                        height={800}
                        className="absolute w-full h-full"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent pointer-events-none"></div>
                    </PixelCard>
                  </Magnet>
                </div>
              </AnimatedContent>
            </div>
            <div className="w-full xl:w-1/2 flex flex-col justify-center">
              <AnimatedContent
                distance={50}
                direction="horizontal"
                reverse={false}
                duration={1.2}
                ease="power3.out"
                initialOpacity={0}
                animateOpacity
                scale={1}
                threshold={0.1}
                delay={0.5}
              >
                <ScrambledText
                  className="text-base md:text-2xl xl:text-2xl p-4 text-center xl:text-left font-semibold leading-relaxed text-white/90 font-retro-mono"
                  radius={50}
                  duration={1.2}
                  speed={0.3}
                  scrambleChars={".;"}
                >
                  Hi! I'm Brian Yudhistira, a fresh Informatics Engineering graduate from Universitas Muhammadiyah Malang. I'm passionate about modern full stack web development using Laravel, Next.js, and Tailwind CSS. As a tech enthusiast with a 3.79 GPA, I love learning, innovating, and creating meaningful digital experiences.
                </ScrambledText>
              </AnimatedContent>
              <SplitText
                text="Tech Stack"
                className="text-cyan-300 mb-2 px-4 text-center md:text-left text-sm md:text-xl font-semibold tracking-wider font-retro-pixel"
                delay={100}
                duration={0.4}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0}
                textAlign=""
                rootMargin="-100px"
              />
              <div className="flex flex-wrap gap-5 justify-center md:justify-start p-4">
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={0}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={3}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">PHP</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={0.2}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={3}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">PHP</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={0.4}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={3}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">JavaScript</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={0.6}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={3}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">Kotlin</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={0.8}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={3}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">Laravel</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={1}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={5}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">NextJS</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={1.2}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={5}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">TailwindCSS</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={1.4}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={7}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">MySQL</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={1.6}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={7}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">Git</span>
                  </Magnet>
                </AnimatedContent>
                <AnimatedContent
                  distance={50}
                  direction="vertical"
                  reverse={false}
                  duration={1}
                  ease="bounce.out"
                  initialOpacity={0}
                  animateOpacity
                  scale={1.1}
                  threshold={0}
                  delay={2}
                >
                  <Magnet padding={50} disabled={false} magnetStrength={10}>
                    <span className="px-3 py-1 md:px-4 md:py-2 rounded-md text-sm md:text-base font-semibold tracking-wide text-cyan-200 bg-[#0a1b2e]/80 border-2 border-cyan-400 shadow-[4px_4px_0_0_#0e3a5b] hover:translate-x-[1px] hover:translate-y-[1px] transition-transform duration-200 font-retro-mono">Docker</span>
                  </Magnet>
                </AnimatedContent>
              </div>

              <div className="flex flex-col justify-center items-center xl:items-start mt-5 2xl:mt10 gap-3 px-4">
                <AnimatedContent
                    distance={50}
                    direction="vertical"
                    reverse={false}
                    duration={1}
                    ease="bounce.out"
                    initialOpacity={0}
                    animateOpacity
                    scale={1.1}
                    threshold={0}
                    delay={0}
                  >
                    <span className="text-xs md:text-base  text-gray-100/60 font-mono-retro">
                      Ready to hire? Find my CV or reach out
                    </span>
                    <div className="flex flex-row justify-center md:justify-start items-center gap-5 mt-4">
                      <AnimatedContent
                        distance={50}
                        direction="vertical"
                        reverse={false}
                        duration={1}
                        ease="bounce.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1.1}
                        threshold={0}
                        delay={0.2}
                      >
                        <a href="" download="Brian_Yudhistira_Resume.pdf"
                          className="w-32 md:w-48 h-auto text-cyan-200 bg-[#0a1b2e] border-2 border-cyan-400 rounded-md px-4 py-2 font-semibold tracking-wider shadow-[6px_6px_0_0_#0e3a5b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#0e3a5b] transition-all duration-200 text-center font-retro-pixel text-xs md:text-sm">
                          Download CV
                        </a>
                      </AnimatedContent>
                      <AnimatedContent
                        distance={50}
                        direction="vertical"
                        reverse={false}
                        duration={1}
                        ease="bounce.out"
                        initialOpacity={0}
                        animateOpacity
                        scale={1.1}
                        threshold={0}
                        delay={0.4}
                      >
                        <a href="#contact"
                          className="w-32 md:w-48 h-auto text-cyan-200 bg-[#0a1b2e] border-2 border-cyan-400 rounded-md px-4 py-2 font-semibold tracking-wider shadow-[6px_6px_0_0_#0e3a5b] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#0e3a5b] transition-all duration-200 text-center font-retro-pixel text-xs md:text-sm">
                          Contact Me
                        </a>
                      </AnimatedContent>
                    </div>
                </AnimatedContent>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}