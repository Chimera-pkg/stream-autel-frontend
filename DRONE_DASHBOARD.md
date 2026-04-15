---
agents:
  - name: Drone Dashboard
    description: Agent for managing and developing the Drone Live Dashboard component
    applyTo:
      - "**/components/DroneDashboard*"
      - "**/drone-dashboard.css"
      - "**/layout.tsx"
      - "**/page.tsx"
---

# Drone Dashboard Agent

## Overview
This agent manages the Drone Live Dashboard component, which displays:
- Real-time HLS video streaming from drone cameras
- Live telemetry data (battery, altitude, speed, location)
- WebSocket connection status monitoring
- Interactive UI with gradient cards and metrics

## Component Structure

### DroneDashboard.tsx
Located at: `src/components/DroneDashboard.tsx`

**Key Features:**
- **Video Stream**: HLS-based live video playback using hls.js
- **Telemetry Interface**: Real-time drone data with TypeScript types
- **WebSocket Connection**: Socket.io integration for live updates
- **Responsive Layout**: Grid-based design with mobile support
- **Visual Indicators**: Color-coded battery status, connection indicators

### Styles
Located at: `src/components/drone-dashboard.css`

**Includes:**
- Dashboard container styling with gradient background
- Card components with blur and transparency effects
- Metric boxes for telemetry display
- Status badges and indicators
- Slide-in animations
- Responsive breakpoints

## Dependencies Required

Before using this component, install:
```bash
npm install socket.io-client hls.js
npm install -D @types/socket.io-client
```

## Integration Steps

1. **Import Component**
   ```tsx
   import { DroneDashboard } from '@/components/DroneDashboard';
   ```

2. **Import Styles**
   ```tsx
   import '@/components/drone-dashboard.css';
   ```

3. **Add to Page**
   ```tsx
   export default function Page() {
     return <DroneDashboard />;
   }
   ```

## Configuration

### WebSocket Server
- Default connection: `http://localhost:4000`
- Event: `drone-telemetry`
- Expected data format:
  ```typescript
  {
    lat: number;
    lng: number;
    altitude: number;
    battery: number;
    speed: number;
  }
  ```

### HLS Stream
- Default stream URL: `http://localhost:8000/live/autelv2/index.m3u8`
- Modify in component's `useEffect` hook if using different server

## Telemetry Display

### Battery Indicator
- Green (>60%): Healthy
- Yellow (30-60%): Warning
- Red (<30%): Critical

### Metrics Displayed
- **Battery**: Percentage with progress bar
- **Altitude**: Height in meters (m)
- **Speed**: Velocity in km/h
- **Location**: Latitude/Longitude in decimal format
- **Connection**: Real-time server status

## Styling Customization

### Color Scheme
- Primary: Slate/Blue gradient background
- Accent: Green (connected), Red (disconnected/critical)
- Cards: Dark with white/10% border transparency

### Responsive Breakpoints
- Desktop (lg): 1024px+
- Tablet: 640px - 1024px
- Mobile: <640px

## Development Tips

1. **Testing Local Stream**
   - Ensure HLS source is accessible on port 8000
   - Check browser console for CORS or stream errors

2. **WebSocket Debugging**
   - Monitor Socket.io events in browser DevTools
   - Verify server sends data in correct format

3. **Performance**
   - Component uses `useRef` for video element (no re-renders)
   - Memoize heavy calculations if needed
   - Use `'use client'` directive for Next.js 16+ client component

## Common Issues

### Video Not Streaming
- Check HLS URL is accessible
- Verify CORS headers on streaming server
- Ensure `Hls.isSupported()` returns true

### Telemetry Not Updating
- Verify WebSocket connection (check console)
- Confirm server sends `drone-telemetry` events
- Check data format matches Telemetry interface

### Styling Broken
- Ensure Tailwind CSS is configured in `tailwind.config.ts`
- Import `drone-dashboard.css` before component usage
- Check for CSS specificity conflicts

## Future Enhancements

- Add map visualization for GPS coordinates
- Implement history graph for telemetry trends
- Add drone control panel
- Record and playback streaming
- Multi-drone support
- Alert system for critical battery levels
