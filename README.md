# 🕵️‍♂️ TraceNow — Neural Network Forensic Analyzer

TraceNow is a **real-time Deep Packet Inspection (DPI), Flow Analysis, and Network Visualization Suite** built for **digital investigators, SOC analysts, and cybersecurity researchers**.  
It bridges the gap between **low-level packet capture** and **high-level behavioral intelligence**, acting as a centralized **Nerve Center for network integrity, privacy, and threat monitoring**.

---

## ⚡ Unique Forensic Capabilities

- 🧠 **Nerve Center Dashboard** — high-volatility UI for rapid incident response  
- 🔄 **Live Flow Data Visualization** — visualizes packet-to-packet communication paths  
- 🌐 **3D Network Tracker Graph** — interactive mapping of live data flows & threat nodes  
- 🔍 **Deep Packet Dissection** — TCP, UDP, TLSv1.3, HTTP protocol inspection  
- 📊 **Behavioral Integrity Index** — real-time **Privacy Integrity Score (0–100)**  
- 🌍 **Geolocation Intelligence** — global packet origin & destination tracking  
- 📘 **Forensic Guide Panel** — investigator-friendly protocol explanations & flags  
- 🔐 **Session-Isolated Monitoring** — secure multi-investigator analysis using Socket.io rooms   

---


## 📸 Application Screenshots



| Feature | Screenshot | Description |
|------|-----------|------------|
| 🧠 **Nerve Center Dashboard** | <img width="1906" height="913" alt="Screenshot 2026-02-23 114949" src="https://github.com/user-attachments/assets/d3475414-05e7-4720-b29d-2c9324cf07cb" /> | Real-time uplink status, protocol health & alerts |
| 🌍 **Geolocation Intelligence** | <img width="1916" height="918" alt="Screenshot 2026-02-23 115011" src="https://github.com/user-attachments/assets/797a1ed4-1e3f-4b48-a832-1a8a32dcf5e5" /> | Visual mapping of packet origins and destinations |
| 📈 **Behavioral Tracking** | <img width="1907" height="917" alt="Screenshot 2026-02-23 115040" src="https://github.com/user-attachments/assets/34580700-89d0-40bb-a360-a2fdf305c71e" /> | Anomaly detection & integrity scoring |
| 🧬 **3D Tracker Graph** | <img width="1913" height="920" alt="Screenshot 2026-02-23 115027" src="https://github.com/user-attachments/assets/28f37307-d958-4812-826c-e16559d98273" /> | Interactive threat-node visualization |
| 📘 **Forensic Guide Panel** | <img width="1914" height="918" alt="Screenshot 2026-02-23 115055" src="https://github.com/user-attachments/assets/6c337cb3-2dfc-4121-ad15-f0b273f06415" /> | Investigator-focused packet interpretation |

---

## 🧬 Behavioral & Geolocation Analysis

### 🔍 Behavioral Integrity Index
- Detects unencrypted payloads
- Flags protocol anomalies
- Tracks abnormal session behavior
- Produces a **Privacy Integrity Score (0–100)**

### 🌍 Geolocation Tracking
- IP-based origin mapping
- Suspicious region correlation
- Visual threat clustering

---

## 🛠️ Forensic Technology Stack

| Layer | Technology |
|----|-----------|
| 🎨 Frontend | React 19 + Vite |
| 💅 Styling | Tailwind CSS + Framer Motion |
| 🧠 Backend | Node.js + Express |
| ⚡ Real-Time Engine | Socket.io |
| 🔬 Analysis Engine | TShark (Wireshark Core) |
| 📊 Visualization | D3.js + WebGL |

---

## 🧩 System Architecture
> **Data Flow Overview:** From raw packet capture to real-time forensic intelligence
<p align="center">
  <img width="1024" alt="TraceNow System Architecture" src="https://github.com/user-attachments/assets/a2aaa85f-6622-4a99-8410-93dc8b4c5270" />
</p>


---

## 🚀 Installation & Local Deployment

> ⚠️ **Local execution only**  
Cloud platforms cannot access low-level network interfaces.

---

### 🔧 Prerequisites

**Windows**
- Install Wireshark
- Enable **Npcap (WinPcap-compatible mode)**

**Linux**
```bash
sudo apt install tshark libpcap-dev

git clone https://github.com/your-username/TraceNow.git

cd backend
npm install

cd ../frontend
npm install --legacy-peer-deps

# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```
## 🛡️ Ethics & Legal Disclaimer

TraceNow is developed **strictly for educational, research, and authorized forensic purposes**.

This tool is designed to analyze **network traffic on systems and networks that you own or have explicit permission to inspect**. Any unauthorized interception, monitoring, or analysis of network data **without consent** may violate applicable cyber laws and regulations.

By using TraceNow, you agree to:
- Operate the tool only in **legally authorized environments**
- Respect **privacy, data protection, and ethical cybersecurity practices**
- Assume full responsibility for compliance with local and international laws

⚖️ The developer(s) and contributors **assume no liability** for misuse, damage, or legal consequences resulting from the use of this software.

Use responsibly. Analyze ethically. Investigate legally.


