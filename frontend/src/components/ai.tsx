import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function AIVisual() {
  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden">
      <Suspense fallback={null}>
        <Spline
          scene="https://prod.spline.design/dXjY7HyMqvbI5TwW/scene.splinecode" 
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
