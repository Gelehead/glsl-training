const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');
const errorDiv = document.getElementById('error');
const fpsSpan = document.getElementById('fps');
const timeSpan = document.getElementById('time');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load shader from external file
async function loadShader() {
    try {
        const response = await fetch('shader.frag');
        return await response.text();
    } catch (e) {
        errorDiv.textContent = 'Failed to load shader.frag';
        errorDiv.style.display = 'block';
        return null;
    }
}

const vertexShaderSource = `#version 300 es
in vec4 position;
void main() { gl_Position = position; }
`;

function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const info = gl.getShaderInfoLog(shader);
        errorDiv.textContent = 'Shader compilation error:\n\n' + info;
        errorDiv.style.display = 'block';
        console.error(info);
        return null;
    }
    errorDiv.style.display = 'none';
    return shader;
}

async function init() {
    const fragmentSource = await loadShader();
    if (!fragmentSource) return;

    const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentSource);
    
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        errorDiv.textContent = 'Program link error:\n\n' + gl.getProgramInfoLog(program);
        errorDiv.style.display = 'block';
        return;
    }

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1, 1, 1,
    ]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLoc = gl.getUniformLocation(program, 'iResolution');
    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iMouseLoc = gl.getUniformLocation(program, 'iMouse');

    let mouseX = 0, mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = canvas.height - e.clientY;
    });

    const startTime = Date.now();
    let frameCount = 0;
    let lastFpsUpdate = startTime;

    function render() {
        const now = Date.now();
        const time = (now - startTime) / 1000;
        
        gl.useProgram(program);
        gl.uniform2f(iResolutionLoc, canvas.width, canvas.height);
        gl.uniform1f(iTimeLoc, time);
        gl.uniform4f(iMouseLoc, mouseX, mouseY, 0, 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        frameCount++;
        if (now - lastFpsUpdate > 500) {
            fpsSpan.textContent = Math.round(frameCount * 1000 / (now - lastFpsUpdate));
            timeSpan.textContent = time.toFixed(1);
            frameCount = 0;
            lastFpsUpdate = now;
        }
        
        requestAnimationFrame(render);
    }
    render();
}

init();
