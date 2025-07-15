import React, { useEffect, useRef, useState } from 'react';
import { Camera, Wifi, WifiOff, RotateCcw, Settings } from 'lucide-react';

const WebRTCVideoFeed = ({ serverUrl = "http://192.168.137.243:8080" }) => { // we will change the port for serverurl after checking real url
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const [connectionState, setConnectionState] = useState('disconnected');
    const [stats, setStats] = useState({ fps: 0, bytesReceived: 0 });
    const [error, setError] = useState(null);
    const [isReconnecting, setIsReconnecting] = useState(false);
    const frameCountRef = useRef(0);
    const fpsIntervalRef = useRef(null);
    const lastStatsRef = useRef(null);

    const createPeerConnection = () => {
        const pc = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }
            ]
        });

        pc.onconnectionstatechange = () => {
            console.log('Connection state:', pc.connectionState);
            setConnectionState(pc.connectionState);
            
            if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
                setError('Connection lost');
            }
        };

        pc.ontrack = (event) => {
            console.log('Received track:', event.track.kind);
            if (event.track.kind === 'video' && videoRef.current) {
                videoRef.current.srcObject = event.streams[0];
                setError(null);
                startStatsCollection(pc);
            }
        };

        pc.oniceconnectionstatechange = () => {
            console.log('ICE connection state:', pc.iceConnectionState);
        };

        return pc;
    };

    const startStatsCollection = (pc) => {
        const collectStats = async () => {
            try {
                const stats = await pc.getStats();
                let bytesReceived = 0;
                let fps = 0;

                stats.forEach(report => {
                    if (report.type === 'inbound-rtp' && report.kind === 'video') {
                        bytesReceived = report.bytesReceived || 0;
                        fps = report.framesPerSecond || 0;
                    }
                });

                setStats({ fps: Math.round(fps), bytesReceived });
            } catch (err) {
                console.error('Error collecting stats:', err);
            }
        };

        // Clear any existing interval
        if (fpsIntervalRef.current) {
            clearInterval(fpsIntervalRef.current);
        }

        // Collect stats every 2 seconds
        fpsIntervalRef.current = setInterval(collectStats, 2000);
    };

    const connectToServer = async () => {
        try {
            setError(null);
            setIsReconnecting(true);
            
            // Close existing connection
            if (pcRef.current) {
                pcRef.current.close();
            }

            // Create new peer connection
            const pc = createPeerConnection();
            pcRef.current = pc;

            // Create offer
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            // Send offer to server
            const response = await fetch(`${serverUrl}/offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sdp: offer.sdp,
                    type: offer.type
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const answer = await response.json();
            await pc.setRemoteDescription(new RTCSessionDescription(answer));

            console.log('WebRTC connection established');
            
        } catch (err) {
            console.error('Connection error:', err);
            setError(err.message);
            setConnectionState('failed');
        } finally {
            setIsReconnecting(false);
        }
    };

    const handleReconnect = () => {
        connectToServer();
    };

    useEffect(() => {
        connectToServer();

        // Cleanup on unmount
        return () => {
            if (pcRef.current) {
                pcRef.current.close();
            }
            if (fpsIntervalRef.current) {
                clearInterval(fpsIntervalRef.current);
            }
        };
    }, [serverUrl]);

    const getStatusColor = () => {
        switch (connectionState) {
            case 'connected': return 'text-green-500';
            case 'connecting': return 'text-yellow-500';
            case 'disconnected': return 'text-gray-500';
            default: return 'text-red-500';
        }
    };

    const getStatusIcon = () => {
        if (connectionState === 'connected') {
            return <Wifi className="w-4 h-4" />;
        } else {
            return <WifiOff className="w-4 h-4" />;
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden relative">
            {/* Video Element */}
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
                style={{ backgroundColor: '#000' }}
            />

            {/* Overlay with controls and status */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top status bar */}
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 pointer-events-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Camera className="w-5 h-5 text-white" />
                            <span className="text-white font-medium">Camera Feed</span>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            {/* Stats */}
                            <div className="flex items-center space-x-3 text-sm">
                                <span className="text-white">
                                    {stats.fps} FPS
                                </span>
                                <span className="text-white">
                                    {formatBytes(stats.bytesReceived)}
                                </span>
                            </div>
                            
                            {/* Connection Status */}
                            <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                                {getStatusIcon()}
                                <span className="text-sm capitalize">
                                    {connectionState}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pointer-events-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleReconnect}
                                disabled={isReconnecting}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-3 py-2 rounded-md text-sm flex items-center space-x-2 transition-colors"
                            >
                                <RotateCcw className={`w-4 h-4 ${isReconnecting ? 'animate-spin' : ''}`} />
                                <span>{isReconnecting ? 'Connecting...' : 'Reconnect'}</span>
                            </button>
                        </div>
                        
                        <div className="text-xs text-gray-300">
                            {serverUrl}
                        </div>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center text-white">
                            <WifiOff className="w-12 h-12 mx-auto mb-4 text-red-500" />
                            <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
                            <p className="text-gray-300 mb-4">{error}</p>
                            <button
                                onClick={handleReconnect}
                                disabled={isReconnecting}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 mx-auto transition-colors"
                            >
                                <RotateCcw className={`w-4 h-4 ${isReconnecting ? 'animate-spin' : ''}`} />
                                <span>{isReconnecting ? 'Connecting...' : 'Retry'}</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {connectionState === 'connecting' && !error && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                        <div className="text-center text-white">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                            <p className="text-gray-300">Connecting to camera...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Updated VideoFeed component
const VideoFeed = ({ serverUrl }) => {
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
            <WebRTCVideoFeed serverUrl={serverUrl} />
        </div>
    );
};

export default VideoFeed;