🕵️‍♂️ TraceNow — Neural Network Forensic Analyzer

TraceNow is a real-time Deep Packet Inspection (DPI) and Network Visualization Suite designed for digital investigators, SOC analysts, and cybersecurity researchers.
It bridges low-level packet capture with high-level behavioral analytics, acting as a central Nerve Center for network integrity monitoring.

🧠 What Makes TraceNow Unique?
Capability	Description
🧠 Nerve Center Interface	High-volatility dashboard optimized for real-time incident response
🌐 3D Tracker Graph	Dynamic visualization of network nodes and threat paths
🔍 Deep Packet Dissection	Live inspection of TCP, UDP, TLSv1.3, HTTP traffic
📊 Behavioral Integrity Index	Calculates a real-time Privacy Integrity Score
🔐 Session-Isolated Forensics	Multi-investigator monitoring with zero data leakage
📸 Interface & Visualization Preview

(Replace image URLs with your actual screenshots stored in /assets or GitHub uploads)

Module	Preview	Description
🧠 Nerve Center Dashboard	
	Real-time uplink status, protocol integrity & alert signals
🌍 Geolocation Mapping	
	Maps packet origins & destinations geographically
📈 Behavioral Tracking	
	Detects anomalies, unencrypted flows & packet deviation
🧬 3D Tracker Graph	
	Interactive node-based threat visualization
📘 Forensic Guide Panel	
	Investigator-focused packet interpretation & flags
🧬 Behavioral & Geolocation Intelligence

TraceNow does more than packet capture — it reasons about behavior.

🔍 Behavioral Integrity Index

Detects unencrypted payloads

Flags protocol misuse

Monitors session deviations

Generates a Privacy Integrity Score (0–100)

🌍 Geolocation Tracking

IP-based origin mapping

Cross-region traffic anomaly detection

Visual threat clustering

🛠️ The Forensic Stack
Layer	Technology
🎨 Frontend	React 19 + Vite
💅 Styling	Tailwind CSS + Framer Motion
🧠 Backend	Node.js + Express
⚡ Real-Time Engine	Socket.io
🔬 Analysis Engine	TShark (Wireshark Core)
📊 Visualization	D3.js + WebGL (3D Graphs)
🧩 System Architecture (Illustrated)
 ┌──────────────────────────┐
 │   Network Interface      │
 │  (Promiscuous Mode)      │
 └───────────┬──────────────┘
             │
             ▼
 ┌──────────────────────────┐
 │   TShark Capture Engine  │
 │  (Raw Packet Frames)    │
 └───────────┬──────────────┘
             │
             ▼
 ┌──────────────────────────┐
 │ Backend Dissection Layer │
 │ (Hex → JSON Parsing)    │
 └───────────┬──────────────┘
             │
     Socket.io Uplink
             │
             ▼
 ┌──────────────────────────┐
 │ React Nerve Center UI    │
 │ • Dashboard              │
 │ • 3D Tracker Graph       │
 │ • Integrity Index        │
 └──────────────────────────┘
🚀 Installation & Local Deployment

⚠️ Local deployment only
Cloud platforms (Vercel/Render) cannot access network interfaces or promiscuous mode.

🔧 Prerequisites (Forensic Engine)
Windows

Install Wireshark

Ensure Npcap is installed with
✅ WinPcap API-compatible Mode

Linux
sudo apt install tshark libpcap-dev
📦 Setup
# Clone the repository
git clone https://github.com/your-username/TraceNow.git

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install --legacy-peer-deps
▶️ Launching the Nerve Center
# Start backend
cd backend
npm run dev

# Start frontend
cd ../frontend
npm run dev

📍 Access: http://localhost:5173

🛡️ Ethics & Legal Disclaimer

TraceNow is strictly for educational, research, and authorized forensic use.

Unauthorized interception, monitoring, or analysis of network traffic without ownership or explicit permission is illegal and punishable under cyber laws.

⚖️ The developer assumes no responsibility for misuse of this tool.

✨ Ideal Use Cases

🔐 SOC & Blue Team Training

🎓 Cybersecurity Education

🧪 Network Behavior Research

🕵️ Digital Forensics Labs

🚨 Incident Response Simulations
