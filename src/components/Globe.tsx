import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Mock threat data with lat/long coordinates
const mockThreats = [
    { id: 1, lat: 40.7128, lon: -74.0060, severity: 'high' as const, country: 'USA' }, // New York
    { id: 2, lat: 51.5074, lon: -0.1278, severity: 'medium' as const, country: 'UK' }, // London
    { id: 3, lat: 35.6762, lon: 139.6503, severity: 'high' as const, country: 'Japan' }, // Tokyo
    { id: 4, lat: -33.8688, lon: 151.2093, severity: 'low' as const, country: 'Australia' }, // Sydney
    { id: 5, lat: 55.7558, lon: 37.6173, severity: 'high' as const, country: 'Russia' }, // Moscow
    { id: 6, lat: 28.6139, lon: 77.2090, severity: 'medium' as const, country: 'India' }, // Delhi
    { id: 7, lat: -23.5505, lon: -46.6333, severity: 'low' as const, country: 'Brazil' }, // São Paulo
    { id: 8, lat: 48.8566, lon: 2.3522, severity: 'medium' as const, country: 'France' }, // Paris
];

// Convert lat/long to 3D coordinates on sphere
function latLongToVector3(lat: number, lon: number, radius: number) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
}

interface ThreatMarkerProps {
    position: THREE.Vector3;
    severity: 'high' | 'medium' | 'low';
}

const ThreatMarker = ({ position, severity }: ThreatMarkerProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);

    const colorMap = {
        high: '#ef4444',
        medium: '#f59e0b',
        low: '#10b981',
    };

    useFrame((state) => {
        if (meshRef.current) {
            const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.4;
            meshRef.current.scale.set(scale, scale, scale);
        }
        if (glowRef.current) {
            const glowScale = 1.8 + Math.sin(state.clock.elapsedTime * 3) * 0.6;
            glowRef.current.scale.set(glowScale, glowScale, glowScale);
        }
    });

    return (
        <group position={position}>
            {/* Core marker */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial 
                    color={colorMap[severity]} 
                    transparent 
                    opacity={1}
                />
            </mesh>
            {/* Inner glow */}
            <mesh scale={2}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial
                    color={colorMap[severity]}
                    transparent
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            {/* Outer pulsing glow */}
            <mesh ref={glowRef}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial
                    color={colorMap[severity]}
                    transparent
                    opacity={0.3}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

// Arc connection between two points
interface ThreatArcProps {
    start: THREE.Vector3;
    end: THREE.Vector3;
    color: string;
}

const ThreatArc = ({ start, end, color }: ThreatArcProps) => {
    const curve = useMemo(() => {
        const midPoint = new THREE.Vector3()
            .addVectors(start, end)
            .multiplyScalar(0.5)
            .normalize()
            .multiplyScalar(1.3); // Arc height

        return new THREE.QuadraticBezierCurve3(start, midPoint, end);
    }, [start, end]);

    const points = curve.getPoints(50);
    const lineGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

    return (
        <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.8,
            linewidth: 3,
        }))} />
    );
};

const Earth = () => {
    const groupRef = useRef<THREE.Group>(null);
    
    // Load high-quality Earth textures
    const [colorMap, normalMap, specularMap] = useLoader(THREE.TextureLoader, [
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg',
        'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg'
    ]);
    
    useFrame(() => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.002;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Main Earth sphere with advanced materials */}
            <mesh>
                <sphereGeometry args={[1, 256, 256]} />
                <meshStandardMaterial
                    map={colorMap}
                    normalMap={normalMap}
                    normalScale={new THREE.Vector2(0.85, 0.85)}
                    roughnessMap={specularMap}
                    roughness={0.9}
                    metalness={0.1}
                />
            </mesh>
            {/* Subtle cloud layer */}
            <mesh scale={[1.003, 1.003, 1.003]}>
                <sphereGeometry args={[1, 128, 128]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.08}
                    roughness={1}
                    metalness={0}
                />
            </mesh>
            {/* Multi-layer atmosphere glow rings */}
            <mesh scale={[1.01, 1.01, 1.01]}>
                <sphereGeometry args={[1, 128, 128]} />
                <meshBasicMaterial
                    color="#10b981"
                    transparent
                    opacity={0.4}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <mesh scale={[1.025, 1.025, 1.025]}>
                <sphereGeometry args={[1, 96, 96]} />
                <meshBasicMaterial
                    color="#10b981"
                    transparent
                    opacity={0.3}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#059669"
                    transparent
                    opacity={0.2}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[1, 48, 48]} />
                <meshBasicMaterial
                    color="#047857"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
};

const GlobeScene = () => {
    const threatMarkers = mockThreats.map((threat) => ({
        ...threat,
        position: latLongToVector3(threat.lat, threat.lon, 1.02),
    }));

    // Create arcs between random threat pairs
    const arcs = useMemo(() => {
        const connections = [
            { from: 0, to: 1, color: '#0ea5e9' }, // NYC to London
            { from: 1, to: 2, color: '#0ea5e9' }, // London to Tokyo
            { from: 2, to: 4, color: '#ec4899' }, // Tokyo to Moscow
            { from: 4, to: 5, color: '#f59e0b' }, // Moscow to Delhi
            { from: 3, to: 2, color: '#10b981' }, // Sydney to Tokyo
            { from: 6, to: 0, color: '#0ea5e9' }, // São Paulo to NYC
            { from: 7, to: 1, color: '#ec4899' }, // Paris to London
            { from: 5, to: 3, color: '#f59e0b' }, // Delhi to Sydney
        ];

        return connections.map(conn => ({
            start: threatMarkers[conn.from].position,
            end: threatMarkers[conn.to].position,
            color: conn.color,
        }));
    }, [threatMarkers]);

    return (
        <>
            {/* Professional 3-point lighting setup */}
            <ambientLight intensity={0.4} color="#b0c4de" />
            
            {/* Key light - main illumination */}
            <directionalLight position={[5, 3, 5]} intensity={2} color="#ffffff" castShadow />
            
            {/* Fill light - soften shadows */}
            <directionalLight position={[-3, 1, -2]} intensity={0.8} color="#e0f2fe" />
            
            {/* Rim lights - edge definition */}
            <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" distance={10} />
            <pointLight position={[0, 0, -5]} intensity={0.6} color="#10b981" distance={10} />
            
            {/* Accent lights for atmosphere */}
            <pointLight position={[3, 3, 0]} intensity={0.8} color="#0ea5e9" distance={8} />
            <pointLight position={[-3, -3, 0]} intensity={0.6} color="#10b981" distance={8} />
            
            {/* Hemisphere light for natural look */}
            <hemisphereLight groundColor="#080820" color="#87ceeb" intensity={0.5} />
            <Stars radius={120} depth={100} count={15000} factor={7} saturation={0.1} fade speed={0.8} />
            
            <Earth />
            
            {/* Threat markers */}
            {threatMarkers.map((threat) => (
                <ThreatMarker
                    key={threat.id}
                    position={threat.position}
                    severity={threat.severity}
                />
            ))}

            {/* Connection arcs */}
            {arcs.map((arc, idx) => (
                <ThreatArc
                    key={idx}
                    start={arc.start}
                    end={arc.end}
                    color={arc.color}
                />
            ))}

            <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={2}
                maxDistance={4}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.3}
                autoRotate
                autoRotateSpeed={0.3}
            />
        </>
    );
};

const Globe = () => {
    return (
        <div className="relative h-64 w-full overflow-hidden rounded-2xl bg-black shadow-inner">
            <Canvas
                camera={{ position: [0, 0, 3.2], fov: 45 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: '#000000' }}
            >
                <GlobeScene />
            </Canvas>
            
            {/* Stats Overlay */}
            <div className="absolute bottom-4 left-4 rounded-xl border border-white/10 bg-black/60 px-4 py-2 backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                    <span className="text-xs font-semibold text-white">
                        {mockThreats.length} Active Threats
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Globe;
