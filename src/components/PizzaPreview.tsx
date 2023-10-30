import React from "react";
import { useGLTF } from "@react-three/drei";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { GLTF } from "three-stdlib";
import * as THREE from "three";

type GLTFResult = GLTF & {
  nodes: {
    piza_low_01Group259: THREE.Mesh;
  };
  materials: {
    lambert1: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

export function Pizza(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/pizza.glb") as GLTFResult;
  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.piza_low_01Group259.geometry}
        material={materials.lambert1}
        position={[0, 2.637, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={2.353}
      />
    </group>
  );
}

useGLTF.preload("/pizza.glb");

export default function PizzaPreview({ size }: { size: string }) {
  return (
    <Canvas shadows camera={{ position: [10, 0, 120], fov: 40 }}>
      <ambientLight intensity={3.5} />
      <pointLight position={[10, 10, 10]} />
      <Pizza scale={getScaleForSize(size)} rotation={[0, Math.PI / 2, 0]} />
      <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
    </Canvas>
  );

  function getScaleForSize(size: string) {
    if (size === "Small") {
      return 1.5;
    } else if (size === "Large") {
      return 1.8;
    } else {
      return 1.65;
    }
  }
}
