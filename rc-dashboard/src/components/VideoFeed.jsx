import React, { useEffect, useRef, useState } from 'react';
import { Camera, Wifi, WifiOff, RotateCcw } from 'lucide-react';

const WebRTCVideoFeed = ({ serverUrl }) => {
    const videoRef = useRef(null);
    const pcRef = useRef(null);
    const [connectionState, setConnectionState] = useState('disconnected');
    const [error, setError] = useState(null);

    const connectToServer = async () => {
        try {
            setError(null);
            setConnectionState('connecting');
            if (pcRef.current) pcRef.current.close();

            const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
            pcRef.current = pc;

            pc.onconnectionstatechange = () => setConnectionState(pc.connectionState);
            pc.ontrack = (event) => {
                if (event.track.kind === 'video' && videoRef.current) {
                    videoRef.current.srcObject = event.streams[0];
                }
            };
            
            // This line is crucial: it tells the connection to expect to receive video
            pc.addTransceiver('video', { direction: 'recvonly' });

            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            const response = await fetch(`${serverUrl}/offer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sdp: offer.sdp, type: offer.type })
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            const answer = await response.json();
            await pc.setRemoteDescription(new RTCSessionDescription(answer));

        } catch (err) {
            console.error('Connection error:', err);
            setError(err.message);
            setConnectionState('failed');
        }
    };

    useEffect(() => {
        connectToServer();
        return () => {
            if (pcRef.current) pcRef.current.close();
        };
    }, [serverUrl]);

    // UI Rendering...
    return (
        <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 flex items-center space-x-2 p-2 bg-black/50 rounded-lg">
                <div className={connectionState === 'connected' ? 'text-green-400' : 'text-red-400'}>
                    {connectionState === 'connected' ? <Wifi size={18} /> : <WifiOff size={18} />}
                </div>
                <span className="text-white text-sm capitalize">{connectionState}</span>
            </div>
            { (connectionState === 'failed' || error) && (
                 <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                    <WifiOff className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-semibold">Connection Failed</h3>
                    <button onClick={connectToServer} className="mt-4 px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">
                        <RotateCcw className="inline-block mr-2 w-4 h-4" />
                        Retry
                    </button>
                 </div>
            )}
        </div>
    );
};

export default WebRTCVideoFeed;