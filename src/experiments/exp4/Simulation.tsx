import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

export function Exp4Simulation() {
  const [ssthresh, setSsthresh] = useState(16);
  const [cwnd, setCwnd] = useState(1);
  const [round, setRound] = useState(0);
  const [history, setHistory] = useState<{round: number, cwnd: number, ssthresh: number, event: string}[]>([{round: 0, cwnd: 1, ssthresh: 16, event: 'Start'}]);
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [bufferLevel, setBufferLevel] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleNextRound = () => {
    setRound(r => r + 1);
    
    setCwnd(currentCwnd => {
      let nextCwnd = currentCwnd;
      let event = '';

      if (currentCwnd < ssthresh) {
        // Slow Start phase: exponential growth (doubles every RTT)
        nextCwnd = currentCwnd * 2;
        event = 'Slow Start';
        // But if doubling exceeds ssthresh, cap it or just let it cross. 
        // Standard says if cwnd >= ssthresh, enter congestion avoidance.
        // For simplicity, we just double. If it exceeds, next round will be CA.
      } else {
        // Congestion Avoidance phase: linear growth
        nextCwnd = currentCwnd + 1;
        event = 'Congestion Avoidance';
      }

      setBufferLevel(Math.min(100, (nextCwnd / 32) * 100)); // Visual buffer filling up

      setHistory(prev => [...prev, { round: prev.length, cwnd: nextCwnd, ssthresh, event }]);
      return nextCwnd;
    });
  };

  const handleForceDrop = () => {
    setRound(r => r + 1);
    const newSsthresh = Math.max(1, Math.floor(cwnd / 2));
    setSsthresh(newSsthresh);
    setCwnd(1);
    setBufferLevel(0);
    setHistory(prev => [...prev, { round: prev.length, cwnd: 1, ssthresh: newSsthresh, event: 'Timeout (Drop)' }]);
  };

  const handleReset = () => {
    setSsthresh(16);
    setCwnd(1);
    setRound(0);
    setBufferLevel(0);
    setHistory([{round: 0, cwnd: 1, ssthresh: 16, event: 'Start'}]);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsTransmitting(false);
  };

  const toggleAutoTransmit = () => {
    if (isTransmitting) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsTransmitting(false);
    } else {
      setIsTransmitting(true);
      timerRef.current = setInterval(() => {
        handleNextRound();
      }, 1000);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Calculate max values for graph scaling
  const maxRound = Math.max(10, history.length);
  const maxCwnd = 32;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Controls & Variables</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Initial ssthresh: {ssthresh}</Label>
              <Slider 
                value={[ssthresh]} 
                onValueChange={(val) => { if(round === 0) setSsthresh(val[0]); }} 
                max={32} 
                min={2}
                step={2}
                disabled={round > 0}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-muted p-3 rounded-md">
                <div className="text-xs text-muted-foreground">cwnd</div>
                <div className="text-2xl font-bold text-blue-600">{cwnd}</div>
              </div>
              <div className="bg-muted p-3 rounded-md">
                <div className="text-xs text-muted-foreground">ssthresh</div>
                <div className="text-2xl font-bold text-orange-500">{ssthresh}</div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button onClick={toggleAutoTransmit} variant={isTransmitting ? "secondary" : "default"}>
                {isTransmitting ? "Pause Auto" : "Auto Transmit"}
              </Button>
              <Button onClick={handleNextRound} disabled={isTransmitting} variant="outline">
                Next Round (RTT)
              </Button>
              <Button onClick={handleForceDrop} variant="destructive">
                Force Router Drop
              </Button>
              <Button onClick={handleReset} variant="ghost">
                Reset Simulation
              </Button>
            </div>

            <div className="mt-4">
              <Label>Router Buffer</Label>
              <div className="h-4 w-full bg-muted rounded-full overflow-hidden mt-2 border">
                <div 
                  className={`h-full transition-all duration-500 ${bufferLevel > 80 ? 'bg-red-500' : bufferLevel > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(100, bufferLevel)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Congestion Window (cwnd) vs Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full border-l-2 border-b-2 border-muted-foreground relative">
              {/* Y-axis labels */}
              {[0, 8, 16, 24, 32].map(val => (
                <div key={val} className="absolute -left-6 text-xs text-muted-foreground" style={{ bottom: `${(val / maxCwnd) * 100}%`, transform: 'translateY(50%)' }}>
                  {val}
                </div>
              ))}
              
              {/* Grid lines */}
              {[8, 16, 24, 32].map(val => (
                <div key={val} className="absolute w-full border-b border-dashed border-muted" style={{ bottom: `${(val / maxCwnd) * 100}%` }} />
              ))}

              {/* Graph line */}
              <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path
                  d={`M ${history.map((h, i) => `${(i / maxRound) * 100}% ${(1 - h.cwnd / maxCwnd) * 100}%`).join(' L ')}`}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  className="transition-all duration-500"
                />
                
                {history.map((h, i) => (
                  <circle
                    key={i}
                    cx={`${(i / maxRound) * 100}%`}
                    cy={`${(1 - h.cwnd / maxCwnd) * 100}%`}
                    r="4"
                    fill={h.event === 'Timeout (Drop)' ? '#ef4444' : '#2563eb'}
                    className="transition-all duration-500"
                  />
                ))}
              </svg>

              {/* Ssthresh line */}
              <div 
                className="absolute w-full border-b-2 border-orange-500 border-dashed transition-all duration-500"
                style={{ bottom: `${(ssthresh / maxCwnd) * 100}%` }}
              >
                <span className="absolute right-2 -top-5 text-xs text-orange-500 font-semibold">ssthresh</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
              <span>Round 0</span>
              <span>Round {maxRound}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
