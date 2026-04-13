import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function Exp2Simulation() {
  const [protocol, setProtocol] = useState<'TCP' | 'UDP'>('TCP');
  const [dropRate, setDropRate] = useState([10]); // 0-20%
  const [isRunning, setIsRunning] = useState(false);
  
  const [sentPackets, setSentPackets] = useState<{id: number, value: number, status: 'sent' | 'dropped' | 'acked'}[]>([]);
  const [receivedData, setReceivedData] = useState<{time: number, value: number}[]>([]);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const packetIdRef = useRef(0);
  const timeRef = useRef(0);
  
  // TCP specific state
  const [waitingForAck, setWaitingForAck] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startStream = () => {
    setIsRunning(true);
    setSentPackets([]);
    setReceivedData([]);
    packetIdRef.current = 0;
    timeRef.current = 0;
    setWaitingForAck(null);

    timerRef.current = setInterval(() => {
      timeRef.current += 1;
      const t = timeRef.current;
      
      // Generate a stock price-like value
      const value = 100 + Math.sin(t / 5) * 20 + Math.random() * 5;
      const packetId = packetIdRef.current++;
      
      const isDropped = Math.random() * 100 < dropRate[0];

      setSentPackets(prev => {
        const newPackets = [...prev, { id: packetId, value, status: isDropped ? 'dropped' : 'sent' }];
        if (newPackets.length > 15) newPackets.shift();
        return newPackets;
      });

      if (protocol === 'UDP') {
        if (!isDropped) {
          setReceivedData(prev => {
            const newData = [...prev, { time: t, value }];
            if (newData.length > 50) newData.shift();
            return newData;
          });
        }
      } else {
        // TCP Logic
        setWaitingForAck(prevWaiting => {
          if (prevWaiting !== null) {
            // Currently blocked waiting for an ACK (Head of line blocking)
            // Simulate retransmission success after some delay
            if (Math.random() > 0.5) {
              // Retransmission successful
              setReceivedData(prev => {
                const newData = [...prev, { time: t, value: 100 + Math.sin(prevWaiting / 5) * 20 }]; // delayed value
                if (newData.length > 50) newData.shift();
                return newData;
              });
              return null; // Clear waiting state
            }
            return prevWaiting; // Still waiting
          } else {
            if (isDropped) {
              // Packet dropped, enter waiting state
              return packetId;
            } else {
              // Success
              setReceivedData(prev => {
                const newData = [...prev, { time: t, value }];
                if (newData.length > 50) newData.shift();
                return newData;
              });
              return null;
            }
          }
        });
      }
    }, 200); // 5 packets per second
  };

  const stopStream = () => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulation Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between max-w-md">
            <div className="flex items-center space-x-2">
              <Label htmlFor="protocol-toggle" className="text-lg font-semibold w-12 text-right">TCP</Label>
              <Switch 
                id="protocol-toggle" 
                checked={protocol === 'UDP'} 
                onCheckedChange={(c) => setProtocol(c ? 'UDP' : 'TCP')}
                disabled={isRunning}
              />
              <Label htmlFor="protocol-toggle" className="text-lg font-semibold w-12">UDP</Label>
            </div>
            
            <Button onClick={isRunning ? stopStream : startStream} variant={isRunning ? "destructive" : "default"}>
              {isRunning ? "Stop Stream" : "Begin Data Stream"}
            </Button>
          </div>

          <div className="space-y-2 max-w-md">
            <div className="flex justify-between">
              <Label>Packet Drop Rate: {dropRate[0]}%</Label>
            </div>
            <Slider 
              value={dropRate} 
              onValueChange={setDropRate} 
              max={20} 
              step={1}
              disabled={isRunning}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sender (Packets)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex flex-col justify-end space-y-2 overflow-hidden bg-muted p-4 rounded-md relative">
              {protocol === 'TCP' && waitingForAck !== null && (
                <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-800 p-2 text-sm rounded border border-red-300 z-10 font-semibold">
                  TCP Blocked: Waiting for ACK (Packet {waitingForAck})
                </div>
              )}
              {sentPackets.map((p) => (
                <div 
                  key={p.id} 
                  className={`p-2 rounded text-sm font-mono flex justify-between items-center transition-all ${
                    p.status === 'dropped' ? 'bg-red-200 text-red-900' : 'bg-blue-200 text-blue-900'
                  }`}
                >
                  <span>Pkt #{p.id}</span>
                  <span>Val: {p.value.toFixed(2)}</span>
                  <span className="text-xs uppercase">{p.status}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Receiver (Real-time Graph)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] bg-card border rounded-md p-4 relative overflow-hidden">
              {/* Simple SVG Graph */}
              <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
                <path 
                  d={`M ${receivedData.map((d, i) => `${i * 10},${200 - (d.value - 70) * 2}`).join(' L ')}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  className="text-primary"
                />
                {receivedData.map((d, i) => (
                  <circle 
                    key={d.time} 
                    cx={i * 10} 
                    cy={200 - (d.value - 70) * 2} 
                    r="3" 
                    className="fill-primary"
                  />
                ))}
              </svg>
              {receivedData.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Waiting for data...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
