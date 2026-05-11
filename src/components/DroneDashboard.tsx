'use client';

import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import Hls from 'hls.js';

interface Telemetry {
  lat: number;
  lng: number;
  altitude: number;
  battery: number;
  speed: number;
}

const HOST = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const socket = io(`http://${HOST}:4000`);

export const DroneDashboard: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Setup Video Stream
    if (videoRef.current && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(`http://${HOST}:8000/live/autelv2/index.m3u8`);
      hls.attachMedia(videoRef.current);
    }

    // 2. Setup WebSocket untuk Telemetri
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('drone-telemetry', (data: Telemetry) => {
      setTelemetry(data);
    });

    return () => {
      socket.off('drone-telemetry');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  // Fungsi untuk menentukan warna baterai
  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600';
    if (battery > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBatteryBgColor = (battery: number) => {
    if (battery > 60) return 'from-green-50 to-green-100';
    if (battery > 30) return 'from-yellow-50 to-yellow-100';
    return 'from-red-50 to-red-100';
  };

  return (
    <div className="dashboard-container">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-slide-in">
          <h1 className="text-4xl font-bold text-white mb-2">Drone Live Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
            <p className="text-slate-400">
              {isConnected ? '✓ Terhubung ke Server' : '✗ Terputus dari Server'}
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Kolom Utama: Video Stream - Span 3 columns */}
          <div className="lg:col-span-3 animate-slide-in">
            <div className="card-solid overflow-hidden">
              {/* Video Header */}
              <div className="video-header flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">📹 Live Stream</h2>
                  <p className="text-slate-400 text-sm mt-1">Feed Kamera Drone Real-time</p>
                </div>
                <div className="status-badge status-live">
                  <span className="status-indicator bg-red-500"></span>
                  <span>SIARAN LANGSUNG</span>
                </div>
              </div>
              
              {/* Video Player */}
              <div className="bg-black relative overflow-hidden min-h-[500px]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  className="w-full h-full object-cover" 
                />
                {/* Overlay jika video tidak berjalan */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity">
                  <div className="text-center text-white">
                    <p className="text-lg mb-2">🎥 Streaming...</p>
                    <p className="text-sm text-slate-300">Menunggu koneksi video</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Samping: Info Drone - Span 1 column */}
          <div className="lg:col-span-1 space-y-6 animate-slide-in">
            
            {/* Quick Status Cards */}
            <div className="card-solid p-6">
              <h3 className="text-slate-600 text-sm font-bold uppercase tracking-wider mb-6">Status Cepat</h3>
              
              {/* Battery Card */}
              <div className={`metric-box bg-gradient-to-br ${getBatteryBgColor(telemetry?.battery || 0)} mb-4`}>
                <span className="metric-label">Baterai</span>
                <div className="flex items-baseline gap-1">
                  <span className={`metric-value ${getBatteryColor(telemetry?.battery || 0)}`}>
                    {telemetry?.battery || 0}
                  </span>
                  <span className="metric-unit">%</span>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      (telemetry?.battery || 0) > 60 ? 'bg-green-500' :
                      (telemetry?.battery || 0) > 30 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${telemetry?.battery || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Altitude Card */}
              <div className="metric-box bg-gradient-to-br from-blue-50 to-blue-100">
                <span className="metric-label">Ketinggian</span>
                <div className="flex items-baseline gap-1">
                  <span className="metric-value text-blue-600">
                    {telemetry?.altitude || 0}
                  </span>
                  <span className="metric-unit">m</span>
                </div>
              </div>
            </div>

            {/* Speed & Location Card */}
            <div className="card-solid p-6">
              <h3 className="text-slate-600 text-sm font-bold uppercase tracking-wider mb-4">Lokasi & Kecepatan</h3>
              
              {/* Speed */}
              <div className="mb-4 p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <p className="text-xs text-purple-600 font-semibold mb-1">Kecepatan</p>
                <p className="text-2xl font-bold text-purple-700">{telemetry?.speed || 0} <span className="text-sm">km/h</span></p>
              </div>

              {/* Coordinates */}
              <div className="space-y-2">
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">Latitude</p>
                  <p className="text-lg font-mono text-slate-700">{(telemetry?.lat || 0).toFixed(6)}</p>
                </div>
                <div className="p-2 bg-slate-100 rounded border border-slate-200">
                  <p className="text-xs text-slate-500 font-semibold">Longitude</p>
                  <p className="text-lg font-mono text-slate-700">{(telemetry?.lng || 0).toFixed(6)}</p>
                </div>
              </div>
            </div>

            {/* Connection Status */}
            <div className={`card-solid p-4 border-l-4 ${isConnected ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10'}`}>
              <p className="text-xs font-semibold text-slate-400 mb-2">SERVER STATUS</p>
              <p className={`text-sm font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-lg text-center text-slate-400 text-sm">
          <p>🚁 Drone Streaming System | Last Update: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};
