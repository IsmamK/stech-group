// src/components/AnimationWrapper.js
import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const AnimationWrapper = ({ children, animationFiles = [] }) => {
  useEffect(() => {
    // Load ScrollMagic from CDN if not available
    const loadScrollMagic = () => {
      return new Promise((resolve) => {
        if (window.ScrollMagic) return resolve();
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/ScrollMagic.min.js';
        script.onload = () => {
          const gsapPlugin = document.createElement('script');
          gsapPlugin.src = 'https://cdnjs.cloudflare.com/ajax/libs/ScrollMagic/2.0.8/plugins/animation.gsap.min.js';
          gsapPlugin.onload = resolve;
          document.body.appendChild(gsapPlugin);
        };
        document.body.appendChild(script);
      });
    };

    const initAnimations = async () => {
      try {
        await loadScrollMagic();
        gsap.registerPlugin(ScrollTrigger);
        
        for (const file of animationFiles) {
          if (file) {
            const script = document.createElement('script');
script.src = `./js/animations/${file}.js`;
script.type = 'module';
document.body.appendChild(script);

          }
        }
      } catch (error) {
        console.error('Animation loading error:', error);
      }
    };

    initAnimations();

    return () => {
      ScrollTrigger.getAll().forEach(instance => instance.kill());
      gsap.globalTimeline.clear();
    };
  }, [animationFiles]);

  return children;
};