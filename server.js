const http = require('http');
const os = require('os');
const { exec } = require('child_process');

const ADMIN_PASS = "KUTTY_2026"; //

function getCPUUsage() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;
    for (let cpu of cpus) {
        user += cpu.times.user;
        nice += cpu.times.nice;
        sys += cpu.times.sys;
        idle += cpu.times.idle;
        irq += cpu.times.irq;
    }
    const total = user + nice + sys + idle + irq;
    return { idle, total };
}

let startTicks = getCPUUsage();

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'OPTIONS') { res.end(); return; }

    if (req.url === '/stats') {
        const endTicks = getCPUUsage();
        const idleDiff = endTicks.idle - startTicks.idle;
        const totalDiff = endTicks.total - startTicks.total;
        const cpuPercentage = (100 * (1 - idleDiff / totalDiff)).toFixed(1);
        startTicks = endTicks; 

        // RETAINED: GLOBAL_GEO_THREAT_SIMULATION
        res.end(JSON.stringify({
            cpu: cpuPercentage < 0 ? "0.1" : cpuPercentage,
            mem: ((1 - os.freemem() / os.totalmem()) * 100).toFixed(1), //
            temp: (32 + (cpuPercentage * 0.4)).toFixed(1), // GOD_MODE: LIVE_THERMAL_CALC
            geo: {
                lat: (Math.random() * 180 - 90).toFixed(2),
                origin: ["RU", "CN", "US", "IN"][Math.floor(Math.random()*4)]
            }
        }));
    }

    // RETAINED: REMOTE_SHELL_EXECUTOR
    if (req.url === '/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = JSON.parse(body);
            if (data.password === ADMIN_PASS) {
                exec(data.command, (err, stdout, stderr) => {
                    res.end(JSON.stringify({ output: stdout || stderr || "DONE" }));
                });
            } else {
                http.get('http://localhost:3001/failed_attempt');
                res.statusCode = 403;
                res.end(JSON.stringify({ output: "DENIED" }));
            }
        });
    }

    // RETAINED: MASTER_TERMINATE
    if (req.url === '/terminate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            if (JSON.parse(body).password === ADMIN_PASS) {
                http.get('http://localhost:3001/signal_kill', () => process.exit(0));
            }
        });
    }
});

server.listen(3000, () => console.log("[SENTINEL] THERMAL_ENGINE_v33_ONLINE"));