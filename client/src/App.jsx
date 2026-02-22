// src/App.jsx
// useCapture is lifted here so both Navbar AND Dashboard share the same state.
// Navbar gets isCapturing + packetCount live. Dashboard gets everything else.

import React from 'react';
import Navbar    from './Components/Navbar';
import Dashboard from './pages/Dashboard';
import { useCapture } from './hooks/useCapture';

function App() {
  const capture = useCapture();

  return (
  <div className="flex flex-col h-screen overflow-hidden bg-cyber-bg">
    {/* Navbar sits at the top with a fixed height */}
    <Navbar 
      isCapturing={capture.isCapturing} 
      packetCount={capture.totalIntercepted} 
      connectionStatus={capture.connectionStatus} // IMPORTANT: Pass this!
    />
    
    {/* Dashboard fills the remaining space */}
    <div className="flex-1 overflow-hidden">
      <Dashboard capture={capture} />
    </div>
  </div>
);
}
export default App;