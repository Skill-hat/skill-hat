"use client";

import CircularText from "./CircularText";
import PlasmaWave from "./loading/RippleGrid";


export default function Loader() {
  return (
    <div className="fixed inset-0 z-[99999] bg-black">
      {/* ✅ Proper container for RippleGrid */}
      <div className="relative w-full h-screen overflow-hidden">
        <PlasmaWave
          colors={["#ecedf1", "#060ef0"]}
          speed1={0.05}
          speed2={0.05}
          focalLength={0.8}
          bend1={1}
          bend2={0.5}
          dir2={1}
          rotationDeg={0}
        />
      </div>

      {/* 🔵 Center Content */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="scale-150 md:scale-[1.8] lg:scale-[2.2]">
          <CircularText
            text="WELCOME*TO*SKILLHAT*"
            spinDuration={25}
            className="text-white"
          />
        </div>
      </div>
    </div>
  );
}
