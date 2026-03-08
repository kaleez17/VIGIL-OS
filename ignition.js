const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const crypto = require('crypto');

let sentinel = null;
let manualKill = false;
let failedAttempts = 0;

if (!fs.existsSync('./vault')) fs.mkdirSync('./vault');

function getHash(file) {
    try { return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
    catch { return null; }
}

function verifyAndRepair() {
    const files = ['server.js', 'ignition.js'];
    files.forEach(file => {
        const vaultPath = `./vault/${file}.safe`;
        if (!fs.existsSync(vaultPath)) { fs.copyFileSync(file, vaultPath); }
        else if (getHash(file) !== getHash(vaultPath)) {
            console.log(`[INTEGRITY] RESTORING_SYSTEM_FILE: ${file}`);
            fs.copyFileSync(vaultPath, file);
        }
    });
}

function startSentinel() {
    if (sentinel) return;
    manualKill = false;
    verifyAndRepair();
    console.log("[SUPERVISOR] SPARKING_SINGULARITY_v31...");
    sentinel = spawn('node', ['server.js'], { stdio: 'inherit' });
    sentinel.on('exit', () => {
        sentinel = null;
        if (!manualKill) setTimeout(startSentinel, 1500);
    });
}

startSentinel();

http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (req.url === '/reactivate') { startSentinel(); res.end(JSON.stringify({status:"READY"})); }
    if (req.url === '/signal_kill') { manualKill = true; res.end(JSON.stringify({status:"ACK"})); }
    if (req.url === '/failed_attempt') {
        failedAttempts++;
        if (failedAttempts >= 3) {
            fs.rmSync('./vault', { recursive: true, force: true });
            process.exit(1);
        }
        res.end();
    }
}).listen(3001);

setInterval(verifyAndRepair, 10000);