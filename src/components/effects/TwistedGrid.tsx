import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec2 uMouse;

  // Gold / Teal / Deep Blue palette
  vec3 gold = vec3(0.831, 0.686, 0.216);
  vec3 teal = vec3(0.165, 0.616, 0.561);
  vec3 deepBlue = vec3(0.082, 0.137, 0.275);

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i.x + i.y * 57.0);
    float b = hash(i.x + 1.0 + i.y * 57.0);
    float c = hash(i.x + (i.y + 1.0) * 57.0);
    float d = hash(i.x + 1.0 + (i.y + 1.0) * 57.0);
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float twistedGrid(vec2 uv, float time) {
    float scale = 24.0;
    vec2 p = uv * scale;

    float twist = sin(time * 0.08) * 0.4;
    float cosT = cos(twist);
    float sinT = sin(twist);
    mat2 rot = mat2(cosT, -sinT, sinT, cosT);
    p = rot * p;

    float wave = sin(p.x * 0.5 + time * 0.2) * cos(p.y * 0.5 + time * 0.15);
    p += wave * 0.35;

    vec2 grid = fract(p) - 0.5;
    float d = length(grid);

    float pattern = smoothstep(0.45, 0.38, d);

    float n = noise(uv * 3.0 + time * 0.05) * 0.12;
    pattern += n;

    return pattern;
  }

  float mouseField(vec2 uv, vec2 mouse) {
    float dist = length(uv - mouse);
    return smoothstep(0.5, 0.0, dist) * 0.25;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime;

    float pattern = twistedGrid(uv, time);

    vec2 mouse = uMouse;
    float mouseInfluence = mouseField(uv, mouse);
    pattern += mouseInfluence;

    vec3 color = mix(deepBlue, teal, pattern * 0.6);
    color = mix(color, gold, pattern * pattern * 0.35);

    float edgeGlow = smoothstep(0.0, 0.3, uv.x) * smoothstep(1.0, 0.7, uv.x);
    edgeGlow *= smoothstep(0.0, 0.3, uv.y) * smoothstep(1.0, 0.7, uv.y);
    color *= 0.7 + edgeGlow * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

export default function TwistedGrid() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.offsetWidth, container.offsetHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })

    const geometry = new THREE.PlaneGeometry(2, 2)
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let animationId: number
    const animate = () => {
      uniforms.uTime.value += 0.016
      uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouseRef.current.x, mouseRef.current.y),
        0.03
      )
      renderer.render(scene, camera)
      animationId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.offsetWidth
      const h = container.offsetHeight
      renderer.setSize(w, h)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) / rect.width
      mouseRef.current.y = 1 - (e.clientY - rect.top) / rect.height
    }

    window.addEventListener('resize', handleResize)
    container.addEventListener('mousemove', handleMouseMove)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  )
}