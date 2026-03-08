
    const root = document.getElementById('vigil-root');
    const nC = document.getElementById('neural-canvas');
    const nCtx = nC.getContext('2d');
    const mC = document.getElementById('matrix-canvas');
    const mCtx = mC.getContext('2d');

    function resize() {
        nC.width = mC.width = window.innerWidth;
        nC.height = mC.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function toggleTheme() {
        const current = root.getAttribute('data-theme');
        root.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
    }

    // Memory Map Initialization
    const fragGrid = document.getElementById('frag-grid');
    for(let i=0; i<40; i++) {
        const cell = document.createElement('div');
        cell.className = 'frag-cell';
        fragGrid.appendChild(cell);
    }

    function updateMemoryMap(memPercent) {
        const cells = document.querySelectorAll('.frag-cell');
        cells.forEach(cell => {
            const rand = Math.random() * 100;
            if (rand < memPercent * 0.4) cell.style.background = 'var(--danger)';
            else if (rand < memPercent) cell.style.background = 'var(--neon)';
            else cell.style.background = '#111';
        });
    }

    // Matrix Rain
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const drops = new Array(Math.floor(window.innerWidth/20)).fill(1);

    function drawMatrix() {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; mCtx.fillRect(0, 0, mC.width, mC.height);
        mCtx.fillStyle = getComputedStyle(root).getPropertyValue('--money');
        drops.forEach((y, i) => {
            mCtx.fillText(chars[Math.floor(Math.random()*chars.length)], i*20, y*20);
            if(y*20 > mC.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        });
    }

    let pts = [];
    for(let i=0; i<40; i++) pts.push({x: Math.random()*nC.width, y: Math.random()*nC.height, vx: Math.random()-0.5, vy: Math.random()-0.5});

    function drawNeural(speed) {
        nCtx.clearRect(0,0,nC.width, nC.height);
        nCtx.strokeStyle = getComputedStyle(root).getPropertyValue('--neon');
        pts.forEach(p => {
            p.x += p.vx * speed; p.y += p.vy * speed;
            if(p.x<0 || p.x>nC.width) p.vx *= -1;
            if(p.y<0 || p.y>nC.height) p.vy *= -1;
            nCtx.beginPath(); nCtx.arc(p.x, p.y, 1, 0, Math.PI*2); nCtx.stroke();
        });
    }

    // The Core Handshake Logic
    async function sync() {
        try {
            const res = await fetch('http://localhost:3000/stats');
            const data = await res.json();
            document.getElementById('cpu-hero').innerText = data.cpu + "%";
            document.getElementById('temp-display').innerText = data.temp + "°C";
            document.getElementById('mem-val').innerText = data.mem + "%";
            document.getElementById('matrix-canvas').style.opacity = data.mem > 85 ? "0.6" : "0";
            document.getElementById('geo-info').innerText = `${data.geo.origin} // ${data.geo.lat}`;
            updateMemoryMap(parseFloat(data.mem));
            drawNeural(1 + (data.cpu / 10));
        } catch { 
            document.getElementById('cpu-hero').innerText = "OFFLINE";
            updateMemoryMap(10);
            drawNeural(1);
        }
    }

    async function execute() {
        const command = document.getElementById('cmd-input').value;
        const password = document.getElementById('pass').value;
        const out = document.getElementById('shell-output');
        if(!command) return;
        
        out.classList.add('glitch-text');
        setTimeout(() => out.classList.remove('glitch-text'), 500);

        try {
            const res = await fetch('http://localhost:3000/execute', { 
                method: 'POST', body: JSON.stringify({command, password}),
                headers: {'Content-Type': 'application/json'}
            });
            const d = await res.json();
            out.innerText += `\n> ${command}\n${d.output}`;
            out.scrollTop = out.scrollHeight;
        } catch { out.innerText += `\n> ERROR: BACKEND_UNREACHABLE`; }
    }

    async function kill() {
        const password = document.getElementById('pass').value;
        const out = document.getElementById('shell-output');
        if(!password) { out.innerText += `\n> ERROR: PASS_REQUIRED`; return; }

        try {
            const res = await fetch('http://localhost:3000/terminate', { 
                method: 'POST', body: JSON.stringify({password}),
                headers: {'Content-Type': 'application/json'}
            });
            if(res.ok) {
                document.getElementById('cpu-hero').innerText = "DEAD";
                root.style.filter = "grayscale(1) brightness(0.3)";
            }
        } catch { out.innerText += `\n> ERROR: TERMINATE_FAILED`; }
    }

    setInterval(sync, 1000);
    setInterval(drawMatrix, 50);