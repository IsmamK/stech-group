// Modified from PavelDoGreat's original script
// https://github.com/PavelDoGreat/WebGL-Fluid-Simulation

// This version exposes a global function for React: `startFluidSimulation(canvas)`

window.startFluidSimulation = function (canvas) {
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 0.97,
    VELOCITY_DISSIPATION: 0.98,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.007,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    PAUSED: false
  };

  if (!canvas) {
    console.error('No canvas provided for fluid simulation.');
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pointers = [];
  const pointerPrototype = {
    id: -1,
    down: false,
    moved: false,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    color: [30, 0, 300]
  };

  const gl = canvas.getContext('webgl2', { alpha: config.TRANSPARENT });

  if (!gl) {
    alert('WebGL 2 not supported.');
    return;
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);

  function getRandomColor() {
    let c = hsv2rgb(Math.random(), 1.0, 1.0);
    return [c.r * 255, c.g * 255, c.b * 255];
  }

  function hsv2rgb(h, s, v) {
    let r, g, b;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        r = v, g = t, b = p; break;
      case 1:
        r = q, g = v, b = p; break;
      case 2:
        r = p, g = v, b = t; break;
      case 3:
        r = p, g = q, b = v; break;
      case 4:
        r = t, g = p, b = v; break;
      case 5:
        r = v, g = p, b = q; break;
    }

    return { r, g, b };
  }

  function splatPointer(pointer) {
    let dx = pointer.dx * config.SPLAT_FORCE;
    let dy = pointer.dy * config.SPLAT_FORCE;
    if (Math.abs(dx) < 1e-3 && Math.abs(dy) < 1e-3) return;
    // Replace with your internal fluid method call
    // For demonstration, just log
    console.log(`Splat at (${pointer.x}, ${pointer.y}) with color`, pointer.color);
  }

  // Mock splat simulation for demo (replace with real simulation if using full Pavel's shader setup)
  function updatePointers() {
    for (let pointer of pointers) {
      if (pointer.moved) {
        pointer.moved = false;
        splatPointer(pointer);
      }
    }
  }

  function animate() {
    updatePointers();
    requestAnimationFrame(animate);
  }

  animate();

  function updatePointerMoveData(pointer, x, y) {
    pointer.dx = (x - pointer.x) * 5;
    pointer.dy = (y - pointer.y) * 5;
    pointer.x = x;
    pointer.y = y;
    pointer.moved = true;
  }

  canvas.addEventListener('mousedown', e => {
    let pointer = pointers.find(p => p.id === 0);
    if (!pointer) {
      pointer = { ...pointerPrototype, id: 0 };
      pointers.push(pointer);
    }
    pointer.down = true;
    pointer.color = getRandomColor();
    updatePointerMoveData(pointer, e.offsetX / canvas.width, 1 - e.offsetY / canvas.height);
  });

  canvas.addEventListener('mousemove', e => {
    const pointer = pointers.find(p => p.id === 0);
    if (!pointer || !pointer.down) return;
    updatePointerMoveData(pointer, e.offsetX / canvas.width, 1 - e.offsetY / canvas.height);
  });

  window.addEventListener('mouseup', () => {
    const pointer = pointers.find(p => p.id === 0);
    if (pointer) pointer.down = false;
  });
};
