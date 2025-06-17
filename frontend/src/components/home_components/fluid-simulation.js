// Based on https://github.com/PavelDoGreat/WebGL-Fluid-Simulation
// Adapted for React component usage

export default class FluidSimulation {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = {
      SIM_RESOLUTION: 128,
      DENSITY_DISSIPATION: 0.98,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE: 0.8,
      CURL: 10,
      SPLAT_RADIUS: 0.25,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 10,
      PAUSED: false,
      BACK_COLOR: { r: 0, g: 0, b: 0 },
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 256,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: true,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 1.0,
      ...options
    };

    this.mouse = { x: 0, y: 0, dx: 0, dy: 0, moved: false };
    this.prevTime = 0;
    this.splatStack = [];
    this.colorUpdateTimer = 0;
    this.resizeTimeout = null;

    this.initGL();
    this.initShaders();
    this.initFramebuffers();
    this.initTextures();
    this.initBlur();
    this.resize();
    this.bindEvents();
    this.startAnimation();
  }

  initGL() {
    this.gl = this.canvas.getContext('webgl2') || 
              this.canvas.getContext('webgl') || 
              this.canvas.getContext('experimental-webgl');
    if (!this.gl) throw new Error('WebGL not supported');
    
    this.ext = {
      formatRGBA: null,
      halfFloatTexType: null,
      supportLinearFiltering: null
    };

    // Detect extensions
    this.ext.formatRGBA = this.gl.getExtension('EXT_color_buffer_float');
    if (!this.ext.formatRGBA) {
      this.ext.formatRGBA = this.gl.getExtension('OES_texture_float');
      this.ext.halfFloatTexType = this.gl.UNSIGNED_BYTE;
    } else {
      this.ext.halfFloatTexType = this.gl.HALF_FLOAT;
    }
    
    this.ext.supportLinearFiltering = this.gl.getExtension('OES_texture_float_linear');
  }

  initShaders() {
    this.programs = {
      advection: this.createProgram(baseVertexShader, advectionFragmentShader),
      divergence: this.createProgram(baseVertexShader, divergenceFragmentShader),
      curl: this.createProgram(baseVertexShader, curlFragmentShader),
      vorticity: this.createProgram(baseVertexShader, vorticityFragmentShader),
      pressure: this.createProgram(baseVertexShader, pressureFragmentShader),
      gradientSubtract: this.createProgram(baseVertexShader, gradientSubtractFragmentShader),
      splat: this.createProgram(baseVertexShader, splatFragmentShader),
      display: this.createProgram(baseVertexShader, displayFragmentShader),
      bloomPrefilter: this.createProgram(baseVertexShader, bloomPrefilterFragmentShader),
      bloomBlur: this.createProgram(baseVertexShader, bloomBlurFragmentShader),
      bloomFinal: this.createProgram(baseVertexShader, bloomFinalFragmentShader),
      sunraysMask: this.createProgram(baseVertexShader, sunraysMaskFragmentShader),
      sunrays: this.createProgram(baseVertexShader, sunraysFragmentShader)
    };
  }

  createProgram(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = this.compileShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = this.compileShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    
    const program = this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    
    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      throw new Error('Program link error: ' + this.gl.getProgramInfoLog(program));
    }
    
    return program;
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error('Shader compile error: ' + this.gl.getShaderInfoLog(shader));
    }
    
    return shader;
  }

  initFramebuffers() {
    const simRes = this.getResolution(this.options.SIM_RESOLUTION);
    const dyeRes = this.getResolution(this.options.SIM_RESOLUTION);
    
    this.framebuffers = {
      velocity: this.createFBO(simRes.width, simRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST),
      divergence: this.createFBO(simRes.width, simRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST),
      curl: this.createFBO(simRes.width, simRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST),
      pressure: this.createFBO(simRes.width, simRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST),
      dye: this.createFBO(dyeRes.width, dyeRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST),
      dyeOld: this.createFBO(dyeRes.width, dyeRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST)
    };
    
    if (this.options.BLOOM) {
      const bloomRes = this.getResolution(this.options.BLOOM_RESOLUTION);
      this.framebuffers.bloom = this.createFBO(bloomRes.width, bloomRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST);
    }
    
    if (this.options.SUNRAYS) {
      const sunraysRes = this.getResolution(this.options.SUNRAYS_RESOLUTION);
      this.framebuffers.sunrays = this.createFBO(sunraysRes.width, sunraysRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST);
      this.framebuffers.sunraysTemp = this.createFBO(sunraysRes.width, sunraysRes.height, this.ext.formatRGBA, this.ext.halfFloatTexType, this.gl.NEAREST);
    }
  }

  createFBO(width, height, internalFormat, type, filter) {
    const gl = this.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, width, height, 0, gl.RGBA, type, null);
    
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    return {
      texture,
      fbo,
      width,
      height
    };
  }

  getResolution(resolution) {
    const aspectRatio = this.canvas.width / this.canvas.height;
    if (aspectRatio > 1) {
      return {
        width: resolution,
        height: Math.round(resolution / aspectRatio)
      };
    } else {
      return {
        width: Math.round(resolution * aspectRatio),
        height: resolution
      };
    }
  }

  initTextures() {
    this.textures = {
      dye: this.createTexture(),
      velocity: this.createTexture(),
      divergence: this.createTexture(),
      curl: this.createTexture(),
      pressure: this.createTexture()
    };
  }

  createTexture() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    return texture;
  }

  initBlur() {
    if (this.options.BLOOM) {
      this.blurPrograms = [];
      for (let i = 0; i < this.options.BLOOM_ITERATIONS; i++) {
        this.blurPrograms.push({
          x: this.createProgram(baseVertexShader, blurFragmentShader),
          y: this.createProgram(baseVertexShader, blurFragmentShader)
        });
      }
    }
  }

  bindEvents() {
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.clientX - rect.left) / this.canvas.clientWidth;
      this.mouse.y = (e.clientY - rect.top) / this.canvas.clientHeight;
      this.mouse.moved = true;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = (e.touches[0].clientX - rect.left) / this.canvas.clientWidth;
      this.mouse.y = (e.touches[0].clientY - rect.top) / this.canvas.clientHeight;
      this.mouse.moved = true;
    });

    window.addEventListener('resize', () => {
      if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(() => this.resize(), 100);
    });
  }

  startAnimation() {
    this.prevTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
  }

  update(currentTime) {
    const dt = Math.min((currentTime - this.prevTime) / 1000, 0.016);
    this.prevTime = currentTime;
    
    if (!this.options.PAUSED) {
      this.step(dt);
    }
    
    this.render();
    this.animationFrame = requestAnimationFrame(this.update.bind(this));
  }

  step(dt) {
    this.gl.disable(this.gl.BLEND);
    
    // Advection
    this.advect(this.framebuffers.velocity, this.framebuffers.velocity, dt);
    this.advect(this.framebuffers.dye, this.framebuffers.dye, dt);
    
    // Apply forces
    if (this.mouse.moved) {
      this.splat(this.mouse.x, this.mouse.y, this.mouse.dx, this.mouse.dy);
      this.mouse.moved = false;
    }
    
    // Vorticity
    this.curl();
    this.vorticity(dt);
    
    // Divergence
    this.divergence();
    
    // Pressure
    for (let i = 0; i < this.options.PRESSURE_ITERATIONS; i++) {
      this.pressure();
    }
    
    // Gradient subtract
    this.gradientSubtract();
    
    // Update color
    this.colorUpdateTimer += dt;
    if (this.colorUpdateTimer > this.options.COLOR_UPDATE_SPEED) {
      this.colorUpdateTimer = 0;
      if (this.options.COLORFUL) {
        this.updateColor();
      }
    }
  }

  render() {
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.options.TRANSPARENT) {
      this.gl.clearColor(0, 0, 0, 0);
    } else {
      this.gl.clearColor(
        this.options.BACK_COLOR.r,
        this.options.BACK_COLOR.g,
        this.options.BACK_COLOR.b,
        1
      );
    }
    
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // Display
    this.display();
    
    // Bloom
    if (this.options.BLOOM) {
      this.bloom();
    }
    
    // Sunrays
    if (this.options.SUNRAYS) {
      this.sunrays();
    }
  }

  // ... Additional methods for advection, splat, curl, vorticity, divergence, 
  // pressure, gradient subtract, display, bloom, sunrays would go here ...

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.clientWidth * dpr;
    this.canvas.height = this.canvas.clientHeight * dpr;
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    
    // Reinitialize framebuffers
    this.initFramebuffers();
  }

  destroy() {
    cancelAnimationFrame(this.animationFrame);
    
    // Clean up WebGL resources
    Object.values(this.programs).forEach(program => {
      this.gl.deleteProgram(program);
    });
    
    Object.values(this.framebuffers).forEach(fbo => {
      this.gl.deleteFramebuffer(fbo.fbo);
      this.gl.deleteTexture(fbo.texture);
    });
    
    Object.values(this.textures).forEach(texture => {
      this.gl.deleteTexture(texture);
    });
    
    // Remove event listeners
    this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
    this.canvas.removeEventListener('touchmove', this.touchMoveHandler);
    window.removeEventListener('resize', this.resizeHandler);
  }
}

// Shader code would be defined here or imported from separate files
const baseVertexShader = `...`;
const advectionFragmentShader = `...`;
// ... all other shaders ...