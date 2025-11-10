import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// Pin locations on the globe (lat, lon)
const pins = [
  { name: 'Projects', color: '#74c69d', lat: 40, lon: -30, link: '#projects' },
  { name: 'Blog', color: '#48cae4', lat: 20, lon: 60, link: '#blog' },
  { name: 'About', color: '#fcbf49', lat: -20, lon: 120, link: '#about' },
  { name: 'Bookshelf', color: '#90e0ef', lat: -40, lon: -90, link: '#bookshelf' },
  { name: 'Contact', color: '#f77f00', lat: 60, lon: 150, link: '#contact' },
];

// Convert lat/lon to 3D coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// 3D Pin marker component with stem and top
function Pin({ position, color, name }: { position: THREE.Vector3; color: string; name: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Mesh>(null);

  // Pulse animation for the top sphere
  useFrame((state) => {
    if (topRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
      topRef.current.scale.set(scale, scale, scale);
    }
  });

  // Calculate the direction from origin to position for stem orientation
  const direction = position.clone().normalize();
  const stemLength = 0.3;
  const stemPosition = position.clone().add(direction.clone().multiplyScalar(stemLength / 2));

  // Create a quaternion to rotate the cylinder to point outward
  const quaternion = new THREE.Quaternion();
  quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

  return (
    <group ref={groupRef}>
      {/* Pin stem */}
      <mesh position={stemPosition} quaternion={quaternion}>
        <cylinderGeometry args={[0.02, 0.02, stemLength, 8]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pin top (sphere) */}
      <mesh
        ref={topRef}
        position={position.clone().add(direction.clone().multiplyScalar(stemLength))}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.3}
          roughness={0.3}
        />
        {/* Glow effect */}
        <pointLight color={color} intensity={3} distance={0.8} />
      </mesh>
    </group>
  );
}

// Cloud patches - scattered chunky clouds
function Clouds() {
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Rotate clouds slowly
  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0003;
    }
  });

  // Create chunky cloud material with scattered patches
  const cloudMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Noise functions
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 3; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          // Create blocky, chunky cloud patches
          float scale = 4.0;
          vec2 pos = vUv * scale;

          // Base cloud pattern
          float clouds = fbm(pos);

          // Make it blockier by quantizing (creates steps)
          clouds = floor(clouds * 5.0) / 5.0;

          // Lower threshold for more visible clouds
          clouds = smoothstep(0.4, 0.6, clouds);

          // Add larger blocky shapes
          float blockSize = 0.6;
          vec2 blockPos = floor(pos / blockSize) * blockSize;
          float blocks = random(blockPos);
          blocks = step(0.45, blocks); // More blocks have clouds (was 0.6)

          // Combine with base clouds
          clouds *= blocks;

          // Make sure we have discrete patches
          if (clouds < 0.2) {
            clouds = 0.0;
          } else {
            clouds = 1.0; // Hard edge - either cloud or no cloud
          }

          // Lighting effect
          vec3 lightDir = normalize(vec3(1.0, 0.5, 1.0));
          float lighting = max(dot(vNormal, lightDir), 0.0) * 0.3 + 0.7;

          // Slight shadow on bottom for 3D effect
          float shadow = step(vNormal.z, -0.2) * 0.25;
          lighting -= shadow;

          // Fade at extreme viewing angles
          float viewFade = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
          clouds *= (1.0 - viewFade * 0.6);

          // Bright white puffy clouds
          vec3 cloudColor = vec3(1.0, 1.0, 1.0) * lighting;
          float alpha = clouds * 0.9;

          gl_FragColor = vec4(cloudColor, alpha);
        }
      `,
    });
  }, []);

  // Hover above surface
  return (
    <Sphere ref={cloudsRef} args={[2.08, 64, 64]} material={cloudMaterial} />
  );
}

// Planet component with detailed terrain
function Planet() {
  const globeRef = useRef<THREE.Mesh>(null);

  // Slow rotation
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.0005;
    }
  });

  // Create realistic planet shader with terrain
  const planetMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;

        // Nature-inspired colors
        vec3 deepOcean = vec3(0.0, 0.45, 0.65);    // #007399
        vec3 shallowOcean = vec3(0.0, 0.71, 0.85); // #00b4d8
        vec3 beach = vec3(0.93, 0.89, 0.71);        // #eee3b5
        vec3 grassland = vec3(0.45, 0.73, 0.53);   // #74c69d
        vec3 forest = vec3(0.25, 0.57, 0.44);      // #40916c
        vec3 darkForest = vec3(0.18, 0.42, 0.31);  // #2d6a4f
        vec3 mountain = vec3(0.35, 0.33, 0.31);    // #595550
        vec3 snow = vec3(0.95, 0.95, 0.97);        // #f2f2f7

        // Multi-octave noise
        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }

        float noise(vec2 st) {
          vec2 i = floor(st);
          vec2 f = fract(st);
          float a = random(i);
          float b = random(i + vec2(1.0, 0.0));
          float c = random(i + vec2(0.0, 1.0));
          float d = random(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 st) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 6; i++) {
            value += amplitude * noise(st);
            st *= 2.0;
            amplitude *= 0.5;
          }
          return value;
        }

        void main() {
          // Create elevation map
          float elevation = fbm(vUv * 4.0);

          // Add more detail at different scales
          elevation += noise(vUv * 16.0) * 0.1;
          elevation += noise(vUv * 32.0) * 0.05;

          // Latitude affects temperature (affects colors)
          float latitude = abs(vUv.y - 0.5) * 2.0;

          vec3 color;

          // Ocean
          if (elevation < 0.45) {
            color = mix(deepOcean, shallowOcean, elevation / 0.45);
          }
          // Beach
          else if (elevation < 0.48) {
            color = mix(shallowOcean, beach, (elevation - 0.45) / 0.03);
          }
          // Grassland
          else if (elevation < 0.55) {
            color = mix(beach, grassland, (elevation - 0.48) / 0.07);
          }
          // Forest
          else if (elevation < 0.65) {
            float forestMix = (elevation - 0.55) / 0.1;
            color = mix(grassland, forest, forestMix);
            // Add variation
            color = mix(color, darkForest, noise(vUv * 20.0) * 0.3);
          }
          // Mountains
          else if (elevation < 0.75) {
            color = mix(forest, mountain, (elevation - 0.65) / 0.1);
          }
          // Snow peaks
          else {
            color = mix(mountain, snow, (elevation - 0.75) / 0.25);
          }

          // Polar ice caps
          if (latitude > 0.85) {
            color = mix(color, snow, (latitude - 0.85) / 0.15);
          }

          // Add subtle atmospheric glow
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
          vec3 glowColor = vec3(0.45, 0.83, 0.67);
          color = mix(color, glowColor, fresnel * 0.2);

          // Add slight ambient variation
          color *= 0.9 + noise(vUv * 50.0) * 0.1;

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });
  }, []);

  // Update time uniform
  useFrame((state) => {
    if (globeRef.current && globeRef.current.material instanceof THREE.ShaderMaterial) {
      globeRef.current.material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Main planet sphere with terrain */}
      <Sphere ref={globeRef} args={[2, 128, 128]} material={planetMaterial} />

      {/* Cloud layer */}
      <Clouds />

      {/* Pins */}
      {pins.map((pin) => {
        const position = latLonToVector3(pin.lat, pin.lon, 2.0);
        return <Pin key={pin.name} position={position} color={pin.color} name={pin.name} />;
      })}
    </group>
  );
}

// Enhanced starfield with more variety
function Starfield() {
  const starsRef = useRef<THREE.Points>(null);

  // Generate stars with varying sizes
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(3000 * 3);
    const sizes = new Float32Array(3000);

    for (let i = 0; i < 3000; i++) {
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Varying star sizes
      sizes[i] = Math.random() * 0.08 + 0.02;
    }
    return { positions, sizes };
  }, []);

  // Subtle flicker
  useFrame((state) => {
    if (starsRef.current) {
      const material = starsRef.current.material as THREE.PointsMaterial;
      material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        transparent
        opacity={1.0}
        sizeAttenuation
        vertexColors={false}
      />
    </points>
  );
}

// Main Globe component
export default function Globe() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced lighting for realistic look */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} castShadow />
        <pointLight position={[-5, 2, -3]} intensity={0.4} color="#48cae4" />
        <hemisphereLight args={['#ffffff', '#60a5fa', 0.4]} />

        {/* Starfield */}
        <Starfield />

        {/* Planet with terrain and clouds */}
        <Planet />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
