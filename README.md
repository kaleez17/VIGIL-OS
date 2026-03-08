# VIGIL-OS
Project Title: Vigilance Singularity (v33)
Subtitle: Autonomous Self-Healing Infrastructure & Hardware Sentinel
1. Executive Summary
Vigilance Singularity is a dual-layered, high-availability monitoring and control suite designed for mission-critical Windows environments. It leverages a Supervisor-Worker architecture to ensure 99.9% uptime, even in the event of process failure, file corruption, or unauthorized access attempts.

2. Architectural Core (The "God Mode" Layers)
A. Dual-Process Redundancy (Port 3000 & 3001)
Port 3001 (The Guardian): An immutable supervisor that monitors the health of the primary engine.

Port 3000 (The Sentinel): The execution layer that handles telemetry, thermal probing, and remote shell commands.

Auto-Failover: If the Sentinel (3000) crashes, the Guardian (3001) detects the exit code and re-sparks the core within 1.5 seconds.

B. The Cryptographic Vault (Integrity Shield)
SHA-256 Hashing: The system creates a digital fingerprint of all source code upon initial boot.

Self-Repair Engine: Every 10 seconds, the system audits itself. If any file (like server.js) is modified by a third party, it is instantly overwritten with a "Safe" copy from the vault.

C. Omnipotence Security (Anti-Tamper)
3-Strike Protocol: Unauthorized login attempts are logged by the Guardian.

Zero-Trace Wipe: On the third failed attempt, the system initiates a self-destruct of the Cryptographic Vault to protect intellectual property.

3. Live Hardware Telemetry
Precision CPU Mapping: Uses manual tick-delta calculations to provide accurate CPU load data on Windows systems.

8GB RAM Optimization: Includes a fragmentation pulse and "Matrix Rain" visual alerts when memory usage exceeds 85%.

Thermal Interceptor: Real-time thermal probing that triggers a "Frost Overlay" UI state if temperatures exceed safe operational thresholds (75°C).

4. Remote Command & Control
Encrypted Shell Relay: Provides a secure bridge to execute PowerShell commands directly through the browser HUD.

Global Threat Visualization: Simulates Geo-IP tracking of incoming connections to provide a high-level security overview.

5. Technical Stack
Backend: Node.js (V8 Engine).

Frontend: HTML5 Canvas, CSS3 (Neon-Kinetic UI), JavaScript (ES6+).

Security: SHA-256 Encryption, OS-Level Process Management.
