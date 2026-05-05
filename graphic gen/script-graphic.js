const svg = document.getElementById("canvas");

// Palette logic removed in favor of direct CSS variables and custom input

let currentCanvasWidth = 0;
let currentCanvasHeight = 0;

const ANCHOR_SIZE = 24;
const RELAY_SIZE = 14;
const SIGNAL_SIZE = 8;

function updateVal(id) {
    const val = document.getElementById(id).value;
    document.getElementById(id + "Val").innerText = id === 'grid' ? val + 'px' : val;
}

function toggleCustomSize() {
    const sizeSelect = document.getElementById("canvas-size");
    if (!sizeSelect) return;
    const customGroup = document.getElementById("custom-size-group");
    if (sizeSelect.value === "custom") {
        customGroup.style.display = "block";
    } else {
        customGroup.style.display = "none";
    }
}

function getProbability(nx, ny, mode) {
    switch (mode) {
        case 'hero-right':
            if (nx < 0.35) return 0;
            return Math.pow((nx - 0.35) / 0.65, 1.8);
        case 'hero-center':
            let distCenter = Math.sqrt(Math.pow(nx - 0.5, 2) + Math.pow(ny - 0.5, 2));
            return Math.max(0, 1 - distCenter * 2.5);
        case 'diagonal':
            let distToDiag = Math.abs((1 - nx) - ny) / Math.sqrt(2);
            if (distToDiag > 0.35) return 0;
            return 1 - (distToDiag / 0.35);
        case 'symmetric-split':
            return Math.pow(1 - Math.sin(nx * Math.PI), 3);
        case 'cluster':
            let centers = [
                { cx: 0.7, cy: 0.4, w: 1.0 },
                { cx: 0.3, cy: 0.7, w: 0.7 },
                { cx: 0.8, cy: 0.8, w: 0.5 }
            ];
            let maxProb = 0;
            centers.forEach(c => {
                let dist = Math.sqrt(Math.pow(nx - c.cx, 2) + Math.pow(ny - c.cy, 2));
                let prob = Math.max(0, c.w - dist * 2.5);
                if (prob > maxProb) maxProb = prob;
            });
            return maxProb;
        case 'corner-nodes':
            let dx = Math.min(nx, 1 - nx);
            let dy = Math.min(ny, 1 - ny);
            let distCorner = Math.sqrt(dx*dx + dy*dy);
            return Math.max(0, 1 - distCorner * 4);
        case 'horizontal':
            let band = Math.sin(ny * Math.PI * 4); // 2 full bands
            return band > 0.6 ? 0.9 : 0.02;
        case 'perimeter':
            let edgeDistX = Math.abs(nx - 0.5);
            let edgeDistY = Math.abs(ny - 0.5);
            let maxEdgeDist = Math.max(edgeDistX, edgeDistY);
            return maxEdgeDist > 0.35 ? 0.8 : 0;
        default:
            return 0.5;
    }
}

function generatePathString(points, radius) {
    if (radius === 0 || points.length < 3) {
        return `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    }
    
    let d = `M ${points[0].x} ${points[0].y} `;
    for (let i = 1; i < points.length - 1; i++) {
        let prev = points[i-1];
        let curr = points[i];
        let next = points[i+1];
        
        let dx1 = curr.x - prev.x; let dy1 = curr.y - prev.y;
        let len1 = Math.sqrt(dx1*dx1 + dy1*dy1);
        let ux1 = dx1/len1; let uy1 = dy1/len1;
        
        let dx2 = next.x - curr.x; let dy2 = next.y - curr.y;
        let len2 = Math.sqrt(dx2*dx2 + dy2*dy2);
        let ux2 = dx2/len2; let uy2 = dy2/len2;
        
        let actualRadius = Math.min(radius, len1/2, len2/2);
        
        if (actualRadius <= 0.1) {
            d += `L ${curr.x} ${curr.y} `;
            continue;
        }

        let cornerStartX = curr.x - ux1 * actualRadius;
        let cornerStartY = curr.y - uy1 * actualRadius;
        
        let cornerEndX = curr.x + ux2 * actualRadius;
        let cornerEndY = curr.y + uy2 * actualRadius;
        
        d += `L ${cornerStartX} ${cornerStartY} `;
        d += `Q ${curr.x} ${curr.y} ${cornerEndX} ${cornerEndY} `;
    }
    d += `L ${points[points.length-1].x} ${points[points.length-1].y}`;
    return d;
}

function generate() {
    const density = parseFloat(document.getElementById("density").value);
    const grid = parseInt(document.getElementById("grid").value);
    const mode = document.getElementById("mode").value;
    const style = document.getElementById("style").value;
    const showGrid = document.getElementById("showGrid").checked;
    const showConnections = document.getElementById("showConnections").checked;
    const enableMotion = document.getElementById("motion").checked;
    
    const paletteData = {
        bg: document.getElementById('custom-bg').value,
        grid: document.getElementById('custom-grid').value,
        conn: document.getElementById('custom-conn').value,
        anchor: document.getElementById('custom-anchor').value,
        relay: document.getElementById('custom-relay').value,
        signal: document.getElementById('custom-signal').value
    };

    let width = svg.clientWidth;
    let height = svg.clientHeight;
    let isFixedSize = false;
    
    const sizeSelect = document.getElementById("canvas-size");
    if (sizeSelect) {
        const val = sizeSelect.value;
        if (val === "custom") {
            width = parseInt(document.getElementById("custom-width").value) || 1920;
            height = parseInt(document.getElementById("custom-height").value) || 1080;
            isFixedSize = true;
        } else if (val === "hero") { width = 1440; height = 800; isFixedSize = true; }
        else if (val === "mobile") { width = 390; height = 844; isFixedSize = true; }
        else if (val === "social") { width = 1080; height = 1080; isFixedSize = true; }
        else if (val === "print") { width = 2480; height = 3508; isFixedSize = true; }
    }

    if (isFixedSize) {
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        document.getElementById("canvasWrap").style.backgroundColor = "#050505";
        document.body.style.backgroundColor = "#050505";
    } else {
        svg.removeAttribute("viewBox");
        document.getElementById("canvasWrap").style.backgroundColor = paletteData.bg;
        document.body.style.backgroundColor = paletteData.bg;
    }

    currentCanvasWidth = width;
    currentCanvasHeight = height;

    const cols = Math.floor(width / grid);
    const rows = Math.floor(height / grid);
    
    const offsetX = (width - cols * grid) / 2;
    const offsetY = (height - rows * grid) / 2;

    svg.innerHTML = `
        <style>
            @keyframes drawLine { to { stroke-dashoffset: 0; } }
            @keyframes popNode { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            .anim-line { animation: drawLine 1.5s cubic-bezier(0.25, 1, 0.5, 1) both; }
            .anim-node { animation: popNode 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) both; }
        </style>
        <rect width="100%" height="100%" fill="${paletteData.bg}" />
        <g id="grid-layer"></g>
        <g id="connections-layer"></g>
        <g id="nodes-layer"></g>
    `;

    const gridLayer = document.getElementById("grid-layer");
    const connectionsLayer = document.getElementById("connections-layer");
    const nodesLayer = document.getElementById("nodes-layer");

    // 1. Draw Grid
    if (showGrid) {
        for (let i = 0; i <= cols; i++) {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", offsetX + i * grid);
            line.setAttribute("y1", offsetY);
            line.setAttribute("x2", offsetX + i * grid);
            line.setAttribute("y2", offsetY + rows * grid);
            line.setAttribute("stroke", paletteData.grid);
            line.setAttribute("stroke-width", "1");
            gridLayer.appendChild(line);
        }
        for (let j = 0; j <= rows; j++) {
            let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", offsetX);
            line.setAttribute("y1", offsetY + j * grid);
            line.setAttribute("x2", offsetX + cols * grid);
            line.setAttribute("y2", offsetY + j * grid);
            line.setAttribute("stroke", paletteData.grid);
            line.setAttribute("stroke-width", "1");
            gridLayer.appendChild(line);
        }
    }

    // 2. Generate Nodes
    let nodes = [];
    let occupied = new Set();
    function getCell(c, r) { return `${c},${r}`; }

    const maxNodes = (cols + 1) * (rows + 1);
    const targetNodeCount = Math.max(8, Math.floor(maxNodes * (density * 0.15)));
    
    const anchorCount = 2 + Math.floor(Math.random() * 3);
    const relayCount = Math.floor(targetNodeCount * 0.3);
    const signalCount = targetNodeCount - anchorCount - relayCount;

    const rolesToPlace = [
        ...Array(anchorCount).fill({ role: 'anchor', size: ANCHOR_SIZE }),
        ...Array(relayCount).fill({ role: 'relay', size: RELAY_SIZE }),
        ...Array(signalCount).fill({ role: 'signal', size: SIGNAL_SIZE })
    ];

    rolesToPlace.forEach(nodeDef => {
        let attempts = 0;
        while (attempts < 50) {
            attempts++;
            let c = Math.floor(Math.random() * (cols + 1));
            let r = Math.floor(Math.random() * (rows + 1));

            if (occupied.has(getCell(c, r))) continue;

            let prob = getProbability(c / cols, r / rows, mode);
            if (Math.random() < prob) {
                occupied.add(getCell(c, r));
                
                // Reserve spacing for anchors
                if (nodeDef.role === 'anchor') {
                    occupied.add(getCell(c+1, r)); occupied.add(getCell(c-1, r));
                    occupied.add(getCell(c, r+1)); occupied.add(getCell(c, r-1));
                }

                nodes.push({
                    c, r,
                    x: offsetX + c * grid,
                    y: offsetY + r * grid,
                    size: nodeDef.size,
                    role: nodeDef.role,
                    color: paletteData[nodeDef.role],
                    connectionCount: 0
                });
                break;
            }
        }
    });

    // 3. Generate Connections
    let connections = [];
    
    nodes.forEach(n => {
        let maxConns = n.role === 'anchor' ? 3 : n.role === 'relay' ? 2 : 1;
        let attempts = 0;
        
        while (n.connectionCount < maxConns && attempts < 20) {
            attempts++;
            let target = nodes[Math.floor(Math.random() * nodes.length)];
            if (target === n) continue;
            
            let targetMaxConns = target.role === 'anchor' ? 3 : target.role === 'relay' ? 2 : 1;
            if (target.connectionCount >= targetMaxConns) continue;
            
            let dist = Math.abs(n.c - target.c) + Math.abs(n.r - target.r);
            if (dist > cols * 0.6) continue; // Keep connections localized
            
            n.connectionCount++;
            target.connectionCount++;
            
            let points = [{x: n.x, y: n.y}];
            let routeType = Math.floor(Math.random() * 2); // 0 = 1 turn, 1 = 2 turns
            
            if (n.x === target.x || n.y === target.y) {
                // Straight line
            } else if (routeType === 0) {
                // 1 turn
                if (Math.random() < 0.5) {
                    points.push({x: target.x, y: n.y});
                } else {
                    points.push({x: n.x, y: target.y});
                }
            } else {
                // 2 turns
                if (Math.random() < 0.5) {
                    let minC = Math.min(n.c, target.c);
                    let maxC = Math.max(n.c, target.c);
                    let midC = minC + Math.floor(Math.random() * (maxC - minC + 1));
                    let midX = offsetX + midC * grid;
                    points.push({x: midX, y: n.y});
                    points.push({x: midX, y: target.y});
                } else {
                    let minR = Math.min(n.r, target.r);
                    let maxR = Math.max(n.r, target.r);
                    let midR = minR + Math.floor(Math.random() * (maxR - minR + 1));
                    let midY = offsetY + midR * grid;
                    points.push({x: n.x, y: midY});
                    points.push({x: target.x, y: midY});
                }
            }
            points.push({x: target.x, y: target.y});
            
            // Filter duplicate consecutive points
            let filteredPoints = [];
            for (let p of points) {
                if (filteredPoints.length === 0) {
                    filteredPoints.push(p);
                } else {
                    let last = filteredPoints[filteredPoints.length - 1];
                    if (last.x !== p.x || last.y !== p.y) {
                        filteredPoints.push(p);
                    }
                }
            }

            let strokeWidth = Math.max(
                n.role === 'anchor' ? 3 : n.role === 'relay' ? 2 : 1,
                target.role === 'anchor' ? 3 : target.role === 'relay' ? 2 : 1
            );

            connections.push({
                points: filteredPoints,
                strokeWidth,
                color: paletteData.conn
            });
        }
    });

    // 4. Render Connections
    if (showConnections) {
        connections.forEach((conn, index) => {
            let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let d = generatePathString(conn.points, style === "rounded" ? 12 : 0);
            path.setAttribute("d", d);
            path.setAttribute("stroke", conn.color);
            path.setAttribute("stroke-width", conn.strokeWidth);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-linejoin", "miter");
            path.setAttribute("stroke-linecap", "square");
            
            connectionsLayer.appendChild(path);
            
            if (enableMotion) {
                let length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
                path.classList.add("anim-line");
                path.style.animationDelay = `${index * 0.03}s`;
            }
        });
    }

    // 5. Render Nodes
    nodes.forEach((n, index) => {
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", n.x - n.size / 2);
        rect.setAttribute("y", n.y - n.size / 2);
        rect.setAttribute("width", n.size);
        rect.setAttribute("height", n.size);
        rect.setAttribute("fill", n.color);
        
        if (enableMotion) {
            rect.style.transformOrigin = `${n.x}px ${n.y}px`;
            rect.classList.add("anim-node");
            rect.style.animationDelay = `${index * 0.02 + 0.4}s`;
        }
        
        nodesLayer.appendChild(rect);
    });
}

function getSVGSource() {
    const svgNode = document.getElementById("canvas").cloneNode(true);

    svgNode.setAttribute("width", currentCanvasWidth);
    svgNode.setAttribute("height", currentCanvasHeight);
    if (!svgNode.hasAttribute("viewBox")) {
        svgNode.setAttribute("viewBox", `0 0 ${currentCanvasWidth} ${currentCanvasHeight}`);
    }

    // Animation styles only matter for the live preview — strip them so static
    // exports don't end up with paths offset out of view.
    svgNode.querySelectorAll('style').forEach(el => el.remove());

    svgNode.querySelectorAll('.anim-line, .anim-node').forEach(el => {
        el.classList.remove('anim-line', 'anim-node');
        el.style.removeProperty('stroke-dasharray');
        el.style.removeProperty('stroke-dashoffset');
        el.style.removeProperty('animation-delay');
        el.style.removeProperty('transform-origin');
        if (!el.getAttribute('style')) el.removeAttribute('style');
    });

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgNode);

    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    return source;
}

function downloadSVG() {
    let source = getSVGSource();

    const blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "identity-composition.svg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function downloadPNG() {
    let source = getSVGSource();
    
    const width = currentCanvasWidth;
    const height = currentCanvasHeight;
    
    const blob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
    const url = URL.createObjectURL(blob);
    
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement("canvas");
        // 2x scale for higher quality PNG export
        canvas.width = width * 2;
        canvas.height = height * 2;
        const ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        
        const pngUrl = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = pngUrl;
        a.download = "identity-composition.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };
    img.src = url;
}

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

function easeOutBack(x) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

async function downloadGIF() {
    const btn = document.getElementById("btn-gif");
    const originalText = btn.innerText;
    btn.innerText = "Preparing...";
    btn.disabled = true;

    try {
        if (!window.GIF) {
            throw new Error("gif.js library not loaded");
        }

        // Load gif.js worker to avoid CDN CORS issues
        const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js';
        const response = await fetch(workerSrc);
        const text = await response.text();
        const workerBlob = new Blob([text], {type: 'application/javascript'});
        const workerUrl = URL.createObjectURL(workerBlob);

        let gifWidth = currentCanvasWidth;
        let gifHeight = currentCanvasHeight;
        
        // Cap max dimension to 800 for reasonable GIF sizes and performance
        const maxDim = 800;
        if (gifWidth > maxDim || gifHeight > maxDim) {
            if (gifWidth > gifHeight) {
                gifHeight = Math.round(gifHeight * (maxDim / gifWidth));
                gifWidth = maxDim;
            } else {
                gifWidth = Math.round(gifWidth * (maxDim / gifHeight));
                gifHeight = maxDim;
            }
        }
        
        const svgNode = document.getElementById("canvas").cloneNode(true);
        svgNode.querySelectorAll('style').forEach(el => el.remove());
        
        const lines = Array.from(svgNode.querySelectorAll('#connections-layer path'));
        const nodes = Array.from(svgNode.querySelectorAll('#nodes-layer rect'));
        
        let maxTime = 0;
        const lineDelays = lines.map((_, i) => i * 0.03);
        const nodeDelays = nodes.map((_, i) => i * 0.02 + 0.4);
        
        if (lines.length > 0) maxTime = Math.max(maxTime, lineDelays[lines.length-1] + 1.5);
        if (nodes.length > 0) maxTime = Math.max(maxTime, nodeDelays[nodes.length-1] + 0.5);
        
        // Add 1s pause at the end
        maxTime += 1.0;
        
        const fps = 30;
        const frameDelay = 1000 / fps;
        const totalFrames = Math.ceil(maxTime * fps);
        
        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: gifWidth,
            height: gifHeight,
            workerScript: workerUrl
        });

        const lineLengths = lines.map(p => {
            const orig = document.querySelectorAll('#connections-layer path')[lines.indexOf(p)];
            return orig.getTotalLength();
        });

        const canvas = document.createElement("canvas");
        canvas.width = gifWidth;
        canvas.height = gifHeight;
        const ctx = canvas.getContext("2d");

        for (let frame = 0; frame < totalFrames; frame++) {
            let t = frame / fps;
            btn.innerText = `Rendering ${Math.round((frame/totalFrames)*100)}%`;

            lines.forEach((path, i) => {
                let delay = lineDelays[i];
                let progress = Math.max(0, Math.min(1, (t - delay) / 1.5));
                let offset = lineLengths[i] * (1 - easeOutCubic(progress));
                path.style.strokeDasharray = lineLengths[i];
                path.style.strokeDashoffset = offset;
            });

            nodes.forEach((rect, i) => {
                let delay = nodeDelays[i];
                let progress = (t - delay) / 0.5;
                if (progress <= 0) {
                    rect.style.transform = "scale(0)";
                    rect.style.opacity = "0";
                } else if (progress >= 1) {
                    rect.style.transform = "scale(1)";
                    rect.style.opacity = "1";
                } else {
                    let scale = easeOutBack(progress);
                    let opacity = Math.min(1, progress * 2);
                    rect.style.transform = `scale(${scale})`;
                    rect.style.opacity = opacity;
                }
            });

            svgNode.setAttribute("width", gifWidth);
            svgNode.setAttribute("height", gifHeight);
            if (!svgNode.hasAttribute("viewBox")) {
                svgNode.setAttribute("viewBox", `0 0 ${currentCanvasWidth} ${currentCanvasHeight}`);
            }

            const serializer = new XMLSerializer();
            let source = serializer.serializeToString(svgNode);
            if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }

            const imgBlob = new Blob([source], {type: "image/svg+xml;charset=utf-8"});
            const url = URL.createObjectURL(imgBlob);
            
            await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const bg = document.getElementById('custom-bg').value;
                    ctx.fillStyle = bg;
                    ctx.fillRect(0, 0, gifWidth, gifHeight);
                    ctx.drawImage(img, 0, 0, gifWidth, gifHeight);
                    gif.addFrame(ctx, {delay: frameDelay, copy: true});
                    URL.revokeObjectURL(url);
                    resolve();
                };
                img.src = url;
            });
        }

        btn.innerText = "Encoding GIF...";

        gif.on('finished', function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "identity-animation.gif";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            btn.innerText = originalText;
            btn.disabled = false;
        });

        gif.render();

    } catch (err) {
        console.error("GIF export failed:", err);
        btn.innerText = "Error!";
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

// Initialize
document.querySelectorAll('select').forEach(el => {
    el.addEventListener('change', generate);
});
document.querySelectorAll('input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', generate);
});
document.querySelectorAll('input[type="color"]').forEach(el => {
    el.addEventListener('input', generate);
});



window.addEventListener("resize", () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(generate, 200);
});

toggleCustomSize();
generate();
