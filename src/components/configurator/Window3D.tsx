import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { OpeningType } from '@/types/window-config';

interface Window3DProps {
  type: OpeningType;
}

const SwingWindow = ({ type }: { type: 'in-swing' | 'out-swing' }) => {
  const openAngle = type === 'in-swing' ? -0.6 : 0.6;
  const hingeX = -1.4;
  
  return (
    <group>
      {/* Window Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#8b9dc3" />
      </mesh>
      
      {/* Frame Opening */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[2.6, 3.6, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Hinged Window Panel */}
      <group position={[hingeX, 0, type === 'in-swing' ? 0.15 : 0.15]} rotation={[0, openAngle, 0]}>
        {/* Panel Frame */}
        <mesh position={[1.3, 0, 0]}>
          <boxGeometry args={[2.6, 3.6, 0.15]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        
        {/* Glass Pane */}
        <mesh position={[1.3, 0, 0.08]}>
          <boxGeometry args={[2.2, 3.2, 0.02]} />
          <meshStandardMaterial 
            color="#93c5fd" 
            transparent 
            opacity={0.4}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Handle */}
        <mesh position={[type === 'in-swing' ? 2.4 : 0.2, 0, 0.15]}>
          <cylinderGeometry args={[0.08, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Hinge indicators */}
      <mesh position={[hingeX, 1.5, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[hingeX, -1.5, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

const HungWindow = ({ type }: { type: 'double-hung' | 'single-hung' }) => {
  const topSashOffset = type === 'double-hung' ? -0.3 : 0;
  const bottomSashOffset = 0.3;
  
  return (
    <group>
      {/* Window Frame */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3, 4, 0.2]} />
        <meshStandardMaterial color="#8b9dc3" />
      </mesh>
      
      {/* Frame Opening */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[2.6, 3.6, 0.02]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      
      {/* Center Rail */}
      <mesh position={[0, 0, 0.15]}>
        <boxGeometry args={[2.6, 0.15, 0.1]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      
      {/* Top Sash */}
      <group position={[0, 0.9 + topSashOffset, 0.18]}>
        {/* Top Sash Frame */}
        <mesh>
          <boxGeometry args={[2.4, 1.6, 0.12]} />
          <meshStandardMaterial color={type === 'double-hung' ? "#cbd5e1" : "#94a3b8"} />
        </mesh>
        
        {/* Top Glass */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[2.1, 1.3, 0.02]} />
          <meshStandardMaterial 
            color="#93c5fd" 
            transparent 
            opacity={0.4}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Top Lock/Handle */}
        {type === 'double-hung' && (
          <mesh position={[0, -0.6, 0.13]}>
            <boxGeometry args={[0.3, 0.08, 0.08]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
          </mesh>
        )}
      </group>
      
      {/* Bottom Sash */}
      <group position={[0, -0.9 + bottomSashOffset, 0.2]}>
        {/* Bottom Sash Frame */}
        <mesh>
          <boxGeometry args={[2.4, 1.6, 0.12]} />
          <meshStandardMaterial color="#cbd5e1" />
        </mesh>
        
        {/* Bottom Glass */}
        <mesh position={[0, 0, 0.07]}>
          <boxGeometry args={[2.1, 1.3, 0.02]} />
          <meshStandardMaterial 
            color="#93c5fd" 
            transparent 
            opacity={0.4}
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
        
        {/* Bottom Lock/Handle */}
        <mesh position={[0, 0.6, 0.13]}>
          <boxGeometry args={[0.3, 0.08, 0.08]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      
      {/* Sliding Track Indicators */}
      <mesh position={[1.2, type === 'double-hung' ? 0.9 : -0.9, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1.2, type === 'double-hung' ? 0.9 : -0.9, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

const Window3D = ({ type }: Window3DProps) => {
  const isSwing = type === 'in-swing' || type === 'out-swing';
  
  return (
    <div className="w-full h-32 rounded-lg overflow-hidden bg-gradient-to-b from-sky-100 to-sky-50">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -5, -5]} intensity={0.3} />
        {isSwing ? (
          <SwingWindow type={type as 'in-swing' | 'out-swing'} />
        ) : (
          <HungWindow type={type as 'double-hung' | 'single-hung'} />
        )}
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 2.5}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </div>
  );
};

export default Window3D;