import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import BIRDS from 'vanta/dist/vanta.birds.min'; // Import the Vanta.js effect you want to use
import NET from 'vanta/dist/vanta.net.min'; // Import the Vanta.js effect you want to use
import GLOBE from 'vanta/dist/vanta.globe.min'; // Import the Vanta.js effect you want to use

const VantaBackground = ({ effect, classes }) => {
    const vantaRef = useRef(null);
    let vantaEffect = null;
    useEffect(() => {
        switch (effect) {
            case 'birds':
                vantaEffect = BIRDS({
                    el: vantaRef.current,
                    THREE: THREE,
                    color2: 0x4a00ff,
                    quantity: 4.00,
                    backgroundAlpha: 1.00,
                    backgroundColor: 0x121212,
                });
                break;
            case 'net':
                vantaEffect = NET({
                    el: vantaRef.current,
                    THREE: THREE,
                    backgroundAlpha: 1.00,
                    backgroundColor: 0x121212,
                });
                break;
            case 'globe':
                vantaEffect = GLOBE({
                    el: vantaRef.current,
                    THREE: THREE,
                    backgroundAlpha: 1.00,
                    backgroundColor: 0x121212,
                });
                break;
            default:
                console.error('Invalid Vanta.js effect specified');
        }

        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [effect]);

    return <div ref={vantaRef} className={`${classes}`} />;
};


export default VantaBackground;
