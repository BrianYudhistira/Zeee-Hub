import { useRef, useEffect, useState, useCallback } from 'react';
import { Renderer, Program, Mesh, Triangle, Vec2 } from 'ogl';

// ─── WebGL Shader: Flowing energy waves + nebula + volumetric glow ───
const vertex = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;

#define PI 3.14159265359

// ─── Noise functions ───
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 6; i++) {
    val += amp * noise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

// ─── Smooth flowing wave ───
float wave(vec2 uv, float t, float freq, float amp, float phase) {
  return amp * sin(uv.x * freq + t * 0.4 + phase + sin(uv.x * 2.0 + t * 0.2) * 0.5);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 centered = uv - 0.5;
  float aspect = uResolution.x / uResolution.y;
  centered.x *= aspect;

  float t = uTime * 0.15;

  // ─── Base: Deep space gradient ───
  vec3 deepBlack = vec3(0.02, 0.02, 0.04);
  vec3 darkNavy = vec3(0.03, 0.05, 0.12);
  vec3 midNavy = vec3(0.04, 0.08, 0.18);
  float gradY = smoothstep(0.0, 1.0, uv.y);
  vec3 base = mix(darkNavy, deepBlack, gradY * 0.8);

  // Subtle radial gradient from center
  float radial = length(centered) * 1.2;
  base = mix(base, midNavy * 0.6, smoothstep(0.8, 0.0, radial) * 0.3);

  // ─── Layer 1: Flowing nebula / smoke ───
  vec2 nebulaUV = centered * 2.0;
  float n1 = fbm(nebulaUV + vec2(t * 0.3, t * 0.1));
  float n2 = fbm(nebulaUV * 1.5 + vec2(-t * 0.2, t * 0.15) + n1 * 0.5);
  float n3 = fbm(nebulaUV * 0.8 + vec2(t * 0.1, -t * 0.25) + n2 * 0.3);

  vec3 nebula1Color = vec3(0.05, 0.15, 0.35); // Deep blue
  vec3 nebula2Color = vec3(0.08, 0.20, 0.45); // Navy blue
  vec3 nebula3Color = vec3(0.02, 0.25, 0.50); // Cyan-navy

  float nebulaMask = smoothstep(0.3, 0.7, n2) * smoothstep(1.0, 0.3, radial);
  vec3 nebula = mix(nebula1Color, nebula2Color, n1) * nebulaMask * 0.5;
  nebula += nebula3Color * smoothstep(0.5, 0.8, n3) * 0.2;

  base += nebula;

  // ─── Layer 2: Energy waves ───
  vec3 waveColor1 = vec3(0.1, 0.4, 0.9);  // Electric blue
  vec3 waveColor2 = vec3(0.0, 0.7, 1.0);   // Cyan
  vec3 waveColor3 = vec3(0.15, 0.3, 0.7);  // Muted blue

  // Multiple layered waves
  float w1 = wave(centered, t * 2.0, 4.0, 0.08, 0.0);
  float w2 = wave(centered, t * 1.5, 6.0, 0.05, 2.1);
  float w3 = wave(centered, t * 1.8, 3.0, 0.1, 4.2);

  float waveDist1 = abs(centered.y - w1);
  float waveDist2 = abs(centered.y - w2);
  float waveDist3 = abs(centered.y - w3);

  float waveGlow1 = smoothstep(0.08, 0.0, waveDist1) * 0.25;
  float waveGlow2 = smoothstep(0.06, 0.0, waveDist2) * 0.18;
  float waveGlow3 = smoothstep(0.12, 0.0, waveDist3) * 0.12;

  // Soft wide glow around waves
  float waveWideGlow1 = smoothstep(0.25, 0.0, waveDist1) * 0.08;
  float waveWideGlow2 = smoothstep(0.2, 0.0, waveDist2) * 0.06;

  base += waveColor1 * waveGlow1 + waveColor2 * waveGlow2 + waveColor3 * waveGlow3;
  base += waveColor1 * waveWideGlow1 * 0.4 + waveColor2 * waveWideGlow2 * 0.4;

  // ─── Layer 4: Dynamic glow pulse (center orb) ───
  float pulse = sin(uTime * 0.3) * 0.5 + 0.5;
  float orbDist = length(centered - vec2(0.0, -0.05));
  float orb = smoothstep(0.6, 0.0, orbDist) * (0.08 + pulse * 0.06);
  vec3 orbColor = vec3(0.05, 0.25, 0.6);
  base += orbColor * orb;

  // ─── Layer 5: Gradient mesh animation ───
  float mesh1 = sin(centered.x * 5.0 + t * 2.0) * cos(centered.y * 4.0 + t * 1.5) * 0.5 + 0.5;
  float mesh2 = sin(centered.x * 3.0 - t * 1.0) * cos(centered.y * 6.0 + t * 0.8) * 0.5 + 0.5;
  float meshBlend = smoothstep(0.6, 0.9, mesh1 * mesh2);
  base += vec3(0.03, 0.1, 0.2) * meshBlend * 0.15;

  // ─── Layer 6: Subtle mouse interaction glow ───
  vec2 mousePos = uMouse * vec2(aspect, 1.0);
  float mouseDist = length(centered - mousePos * 0.3);
  float mouseGlow = smoothstep(0.5, 0.0, mouseDist) * 0.08;
  base += vec3(0.1, 0.3, 0.7) * mouseGlow;

  // ─── Vignette ───
  float vignette = 1.0 - smoothstep(0.4, 1.2, radial);
  base *= vignette * 0.85 + 0.15;

  // ─── Final color adjustments ───
  base = pow(base, vec3(0.95)); // Slight gamma lift
  base = clamp(base, 0.0, 1.0);

  gl_FragColor = vec4(base, 1.0);
}
`;

// ─── Floating Particles Layer (Canvas 2D) ───
function FloatingParticles({ count = 80 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        speedX: (Math.random() - 0.5) * 0.15,
        speedY: (Math.random() - 0.5) * 0.1 - 0.05,
        opacity: Math.random() * 0.5 + 0.1,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.7 ? 195 : 215,
      });
    }
    particlesRef.current = particles;

    let time = 0;
    const animate = () => {
      time += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        const pulse = Math.sin(time * p.pulseSpeed * 60 + p.pulseOffset) * 0.3 + 0.7;
        const alpha = p.opacity * pulse;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 70%, ${alpha})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 70%, 50%, ${alpha * 0.3})`);
        gradient.addColorStop(1, `hsla(${p.hue}, 60%, 30%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 85%, ${alpha * 0.8})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}

// ─── Main FuturisticBackground Component ───
export default function FuturisticBackground({
  speed = 1,
  particleCount = 80,
  interactive = true,
  resolutionScale = 0.75,
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: -((e.clientY / window.innerHeight) * 2 - 1),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size to the full window, not parent
    const renderer = new Renderer({
      dpr: Math.min(window.devicePixelRatio, 2),
      canvas,
      antialias: false,
    });

    const gl = renderer.gl;
    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Vec2() },
        uMouse: { value: new Vec2() },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      // Use window dimensions directly for guaranteed full coverage
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Set internal render resolution (lower for performance)
      renderer.setSize(w * resolutionScale, h * resolutionScale);
      // IMPORTANT: OGL's setSize() also sets canvas.style.width/height to the scaled size,
      // which makes the canvas physically smaller than the viewport.
      // Override CSS back to 100% so the canvas stretches to fill the entire viewport.
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      program.uniforms.uResolution.value.set(w * resolutionScale, h * resolutionScale);
    };

    window.addEventListener('resize', resize);
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    resize();

    setIsLoaded(true);

    const start = performance.now();
    let frame = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    const loop = () => {
      const elapsed = ((performance.now() - start) / 1000) * speed;
      program.uniforms.uTime.value = elapsed;

      smoothMouseX += (mouseRef.current.x - smoothMouseX) * 0.03;
      smoothMouseY += (mouseRef.current.y - smoothMouseY) * 0.03;
      program.uniforms.uMouse.value.set(smoothMouseX, smoothMouseY);

      renderer.render({ scene: mesh });
      frame = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [speed, resolutionScale, interactive, handleMouseMove]);

  // All sizing uses inline styles with 100vw/100vh to guarantee full viewport coverage
  // regardless of Tailwind purging, parent constraints, or scrollbar issues
  return (
    <>
      {/* Force dark background on html/body to prevent any white flash or bleed */}
      <style>{`
        html, body {
          background-color: #050510 !important;
        }
        @keyframes ambientFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
          33% { transform: translate(3vw, 2vw) scale(1.1); opacity: 0.8; }
          66% { transform: translate(-2vw, 4vw) scale(0.95); opacity: 0.5; }
        }
        @keyframes ambientFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
          50% { transform: translate(-4vw, -3vw) scale(1.15); opacity: 0.7; }
        }
        @keyframes ambientPulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.2); opacity: 0.7; }
        }
      `}</style>

      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 0,
          overflow: 'hidden',
          backgroundColor: '#050510',
        }}
      >
        {/* Layer 1: WebGL Shader Background — full viewport canvas */}
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',
          }}
        />

        {/* Layer 2: Floating Particles */}
        <FloatingParticles count={particleCount} />

        {/* Layer 3: CSS Ambient Glow Orbs */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {/* Top-left ambient orb */}
          <div
            style={{
              position: 'absolute',
              width: '40vw',
              height: '40vw',
              top: '-10vw',
              left: '-10vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(10,60,140,0.12) 0%, transparent 70%)',
              animation: 'ambientFloat1 20s ease-in-out infinite',
            }}
          />
          {/* Bottom-right ambient orb */}
          <div
            style={{
              position: 'absolute',
              width: '50vw',
              height: '50vw',
              bottom: '-15vw',
              right: '-15vw',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,100,180,0.1) 0%, transparent 70%)',
              animation: 'ambientFloat2 25s ease-in-out infinite',
            }}
          />
          {/* Center ambient pulse */}
          <div
            style={{
              position: 'absolute',
              width: '30vw',
              height: '30vw',
              top: '30%',
              left: '35%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,150,255,0.05) 0%, transparent 60%)',
              animation: 'ambientPulse 8s ease-in-out infinite',
            }}
          />
        </div>

        {/* Layer 4: Vignette overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Layer 5: Top/Bottom gradient fades */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '8rem',
            pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(5,5,16,0.6) 0%, transparent 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8rem',
            pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(5,5,16,0.6) 0%, transparent 100%)',
          }}
        />
      </div>
    </>
  );
}
