import { useState, useEffect } from 'react';

/**
 * useWebGL
 * Detects WebGL 1/2 support, touch devices, reduced motion preferences,
 * and classifies device performance tier for adaptive 3D rendering.
 */
export function useWebGL() {
  const [capabilities, setCapabilities] = useState({
    isSupported: true,
    isMobile: false,
    reducedMotion: false,
    qualityLevel: 'high', // 'high' | 'medium' | 'low' | 'none'
    maxParticles: 1000
  });

  useEffect(() => {
    // 1. Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const reducedMotion = mediaQuery.matches;

    // 2. Check mobile / touch capability
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrow = window.innerWidth < 768;
    const isMobile = isTouch || isNarrow;

    // 3. Test WebGL canvas context creation
    let isSupported = false;
    let qualityLevel = 'none';

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      isSupported = Boolean(gl && gl instanceof WebGLRenderingContext || (window.WebGL2RenderingContext && gl instanceof WebGL2RenderingContext));

      if (isSupported) {
        // Evaluate hardware parameters
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
        
        const isLowPowerGPU = /intel|mali|adreno 3|adreno 4|sgx/i.test(renderer);
        
        if (reducedMotion) {
          qualityLevel = 'low';
        } else if (isMobile || isLowPowerGPU) {
          qualityLevel = 'medium';
        } else {
          qualityLevel = 'high';
        }
      }
    } catch {
      isSupported = false;
      qualityLevel = 'none';
    }

    const maxParticles = 
      qualityLevel === 'high' ? 1200 :
      qualityLevel === 'medium' ? 450 :
      qualityLevel === 'low' ? 150 : 0;

    setCapabilities({
      isSupported,
      isMobile,
      reducedMotion,
      qualityLevel,
      maxParticles
    });

    const handleResize = () => {
      const narrow = window.innerWidth < 768;
      setCapabilities(prev => ({
        ...prev,
        isMobile: isTouch || narrow
      }));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return capabilities;
}

export default useWebGL;
