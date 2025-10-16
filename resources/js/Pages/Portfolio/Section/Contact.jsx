import GlareHover from '@/Components/Animations/UI/GlareHover';
import { AiOutlineMail } from 'react-icons/ai';
import { MdOutlineCall } from 'react-icons/md';
import { FaLinkedin, FaGithub,FaInstagram } from 'react-icons/fa6';

export default function ContactSection(){
    return(
        <section id="contact" className='flex flex-col items-center mx-auto py-20 scroll-mt-16 relative'>
            <div className='flex flex-col justify-center max-w-[80%] md:max-w-[75%] xl:max-w-[70%] w-full z-20'>
                <div className="flex flex-col justify-center items-center mb-10">
                    <span className='text-transparent text-4xl sm:text-6xl font-extrabold mb-5 bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-700 font-retro-pixel tracking-wider'>Get In Touch</span>
                    <p className='text-white text-lg text-center font-retro-mono'>Feel Free to contact me</p>

                </div>
                <div className="flex flex-col xl:flex-row w-full justify-center items-center xl:items-start">
                    <div className='xl:w-2/5 2xl:w-1/3 xl:flex flex-col space-y-5 items-center xl:items-start mb-10 xl:mb-0 order-2 md:order-1'>
                        <h2 className='hidden md:block text-white text-2xl lg:text-3xl font-extrabold text-center font-retro-pixel tracking-wider'>Contact Information</h2>
                        <GlareHover
                            glareColor="#ffffff"
                            width='325px'
                            height='78px'
                            glareOpacity={0.3}
                            glareAngle={-30}
                            glareSize={300}
                            transitionDuration={800}
                            playOnce={false}
                            className='hidden md:flex flex-row justify-start items-center backdrop-blur-sm rounded-lg px-4 py-3 cursor-pointer hover:scale-[1.02] transition-transform duration-300'
                        >
                            <div className='flex flex-row justify-start items-center cursor-pointer'>
                                <AiOutlineMail className='text-white text-4xl p-1 rounded-full bg-blue-400'/>
                                <div className='flex flex-col justify-center ml-4'>
                                    <span className='text-white text-sm md:text-base'>Email:</span>
                                    <span className='text-white text-sm md:text-base'>brianyudhistira1@gmail.com</span>
                                </div>
                            </div>
                        </GlareHover>
                        <GlareHover
                            glareColor="#ffffff"
                            width='325px'
                            height='78px'
                            glareOpacity={0.3}
                            glareAngle={-30}
                            glareSize={300}
                            transitionDuration={800}
                            playOnce={false}
                            className='hidden md:flex flex-row justify-start items-center backdrop-blur-sm rounded-lg px-4 py-3 cursor-pointer hover:scale-[1.02] transition-transform duration-300'
                        >
                            <div className='flex flex-row justify-start items-center cursor-pointer'>
                                <MdOutlineCall className='text-white text-2xl md:text-4xl p-1 text-center rounded-full bg-blue-400'/>
                                <div className='flex flex-col justify-center ml-4'>
                                    <span className='text-white text-sm md:text-base'>phone:</span>
                                    <span className='text-white text-sm md:text-base'>+62 812 7623 5784</span>
                                </div>
                            </div>
                        </GlareHover>
                        {/* <div className='flex flex-row hidden md:hidden bg-white/5 border border-white rounded-lg backdrop-blur-sm p-2 h-auto items-center justify-start px-10 gap-3 hover:shadow-lg hover:scale-105 transition-transform duration-300'>
                            <div className='flex flex-col justify-center items-center'>
                                <AiOutlineMail className='text-white text-3xl p-1 text-center rounded-full bg-blue-400'/>
                            </div>
                            <div className='flex flex-col h-auto text-white '>
                                <span className='text-sm md:text-lg'>Email:</span>
                                <span className='text-sm md:text-lg'>brianyudhistira1@gmail.com</span>
                            </div>
                        </div>
                        <div className='hidden md:hidden bg-white/5 border border-white rounded-lg backdrop-blur-sm p-2 h-auto items-center justify-start px-10 gap-3 hover:shadow-lg hover:scale-105 transition-transform duration-300'>
                            <div className='flex flex-col justify-center items-center'>
                                <MdOutlineCall className='text-white text-3xl p-1  rounded-full bg-blue-400'/>
                            </div>
                            <div className='flex flex-col h-auto text-white '>
                                <span className='text-sm md:text-lg'>Phone:</span>
                                <span className='text-sm md:text-lg'>+62 812 7623 5784</span>
                            </div>
                        </div> */}
                        <div className='flex w-full justify-center xl:justify-start items-center mt-6'>
                            <div className="flex flex-col gap-2 md:gap-3">
                                <div className='text-center xl:text-left'>
                                    <span className='text-white text-sm xl:text-lg mb-2'>Find me on</span>
                                </div>
                                <div className='flex flex-row gap-2 md:gap-3 items-center px-2'>
                                    <a href="https://linkedin.com/in/brianyudhistira" target="_blank" rel="noopener noreferrer"
                                        className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                                        <FaLinkedin
                                            className="relative text-white group-hover:text-[#0A66C2] transition-all duration-400 ease-out text-4xl md:text-5xl p-1 md:p-2 rounded-xl md:rounded-2xl bg-gradient-to-br group-hover:from-white group-hover:to-blue-50 backdrop-blur-sm transform group-hover:scale-105 group-hover:rotate-6 shadow-lg group-hover:shadow-xl group-hover:shadow-blue-400/25 border border-gray-600 group-hover:border-[#0A66C2] group-hover:-translate-y-3"
                                        />
                                    </a>
                                    <a href="https://github.com/brianyudhistira" target="_blank" rel="noopener noreferrer"
                                        className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                                        <FaGithub
                                            className="relative text-white group-hover:text-[#181717] transition-all duration-400 ease-out text-4xl md:text-5xl p-1 md:p-2 rounded-xl md:rounded-2xl bg-gradient-to-br group-hover:from-white group-hover:to-gray-50 backdrop-blur-sm transform group-hover:scale-105 group-hover:rotate-6 shadow-lg group-hover:shadow-xl group-hover:shadow-gray-400/25 border border-gray-600 group-hover:border-[#181717] group-hover:-translate-y-3"
                                        />
                                    </a>
                                    <a href="https://instagram.com/brianyudhistira" target="_blank" rel="noopener noreferrer"
                                        className="group relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-600/20 rounded-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out"></div>
                                        <FaInstagram
                                            className="relative text-white group-hover:text-[#E4405F] transition-all duration-400 ease-out text-4xl md:text-5xl p-1 md:p-2 rounded-xl md:rounded-2xl bg-gradient-to-br group-hover:from-white group-hover:to-pink-50 backdrop-blur-sm transform group-hover:scale-105 group-hover:rotate-6 shadow-lg group-hover:shadow-xl group-hover:shadow-pink-400/25 border border-gray-600 group-hover:border-[#E4405F] group-hover:-translate-y-3"
                                        />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full xl:w-1/2 flex flex-col justify-center bg-gradient-to-br from-white/10 to-white/5 p-7 rounded-xl backdrop-blur-lg border border-white/20 shadow-2xl order-1 md:order-2'>
                        <div className="mb-6">
                            <h3 className='text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-700 font-retro-pixel tracking-wider'>Send Message</h3>
                            <p className='text-gray-300 text-sm font-retro-mono'>Let's start a conversation</p>
                        </div>
                        <form className='w-full' action="https://formspree.io/f/mayvlrdo" method="POST">
                            <div className='flex flex-col space-y-6'>
                                <div className="relative group">
                                    <label className='text-base font-semibold text-white mb-2 block group-focus-within:text-cyan-300 transition-colors duration-300 font-retro-mono'>Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        placeholder=' your full name' 
                                        required 
                                        className='w-full text-sm px-3 py-2 md:px-4 md:py-3 rounded-md font-retro-mono text-gray-100 bg-gray-900/90 border-2 border-gray-400 hover:border-blue-400 focus:border-blue-500 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-200'
                                    />
                                </div>
                                <div className="relative group">
                                    <label className='text-base font-semibold text-white mb-2 block group-focus-within:text-cyan-300 transition-colors duration-300 font-retro-mono'>Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        placeholder='your.email@example.com' 
                                        required 
                                        className='w-full text-sm px-3 py-2 md:px-4 md:py-3 rounded-md font-retro-mono text-gray-100 bg-gray-900/90 border-2 border-gray-400 hover:border-blue-400 focus:border-blue-500 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-200'
                                    />
                                </div>
                                <div className="relative group">
                                    <label className='text-base font-semibold text-white mb-2 block group-focus-within:text-cyan-300 transition-colors duration-300 font-retro-mono'>Message</label>
                                    <textarea 
                                        name="message" 
                                        rows="4" 
                                        placeholder='Tell me something' 
                                        required 
                                        className='w-full text-sm px-3 py-2 md:px-4 md:py-3 rounded-md font-retro-mono text-gray-100 bg-gray-900/90 border-2 border-gray-400 hover:border-blue-400 focus:border-blue-500 placeholder-gray-400 focus:outline-none focus:ring-0 transition-all duration-200 resize-none'
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className='w-full text-gray-100 bg-gray-900 border-2 border-gray-400 rounded-md px-4 py-3 font-retro-pixel font-semibold tracking-wider hover:border-blue-400 transition-all duration-200 text-center'
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Send Message
                                        <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}