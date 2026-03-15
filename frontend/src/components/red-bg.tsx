import Spline from '@splinetool/react-spline/next';
import { Suspense } from 'react';

export default function RedBackground() {
    return (
        <div className="w-full h-full absolute inset-0 z-0 overflow-hidden">
            <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center bg-black">
                    <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                </div>
            }>
                <div className="w-full h-full">
                    <Spline
                        scene="https://prod.spline.design/oppLkSBMKKxz1GTL/scene.splinecode"
                        className="w-full h-full"
                    />
                </div>
            </Suspense>
        </div>
    );
}
