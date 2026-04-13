import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, Router, Server, ArrowRight, ArrowLeft } from 'lucide-react';

interface Packet {
  id: number;
  srcIp: string;
  srcPort: string;
  destIp: string;
  destPort: string;
  data: string;
  direction: 'outbound' | 'inbound';
  stage: number; // 0: PC to Router, 1: Router to Server, 2: Server to Router, 3: Router to PC
}

interface NatEntry {
  insideLocalIp: string;
  insideLocalPort: string;
  insideGlobalIp: string;
  insideGlobalPort: string;
  outsideGlobalIp: string;
  outsideGlobalPort: string;
}

export function Exp3Simulation() {
  const [natTable, setNatTable] = useState<NatEntry[]>([]);
  const [activePacket, setActivePacket] = useState<Packet | null>(null);
  const [step, setStep] = useState(0);

  const ROUTER_PUBLIC_IP = "203.0.113.1";
  const SERVER_IP = "8.8.8.8";

  const pcs = [
    { id: 1, ip: "192.168.1.10" },
    { id: 2, ip: "192.168.1.11" },
    { id: 3, ip: "192.168.1.12" },
  ];

  const handleSendRequest = (pcIp: string) => {
    const srcPort = Math.floor(Math.random() * 10000 + 50000).toString();
    setActivePacket({
      id: Date.now(),
      srcIp: pcIp,
      srcPort: srcPort,
      destIp: SERVER_IP,
      destPort: "80",
      data: "HTTP GET /",
      direction: 'outbound',
      stage: 0
    });
    setStep(1);
  };

  const handleNextStep = () => {
    if (!activePacket) return;

    if (activePacket.stage === 0) {
      // Packet reaches router, translate it
      const newPort = Math.floor(Math.random() * 10000 + 10000).toString();
      
      setNatTable(prev => [...prev, {
        insideLocalIp: activePacket.srcIp,
        insideLocalPort: activePacket.srcPort,
        insideGlobalIp: ROUTER_PUBLIC_IP,
        insideGlobalPort: newPort,
        outsideGlobalIp: activePacket.destIp,
        outsideGlobalPort: activePacket.destPort
      }]);

      setActivePacket({
        ...activePacket,
        srcIp: ROUTER_PUBLIC_IP,
        srcPort: newPort,
        stage: 1
      });
      setStep(2);
    } else if (activePacket.stage === 1) {
      // Server replies
      setActivePacket({
        ...activePacket,
        srcIp: activePacket.destIp,
        srcPort: activePacket.destPort,
        destIp: activePacket.srcIp,
        destPort: activePacket.srcPort,
        data: "HTTP 200 OK",
        direction: 'inbound',
        stage: 2
      });
      setStep(3);
    } else if (activePacket.stage === 2) {
      // Router receives reply, translates back
      const entry = natTable.find(e => e.insideGlobalPort === activePacket.destPort);
      if (entry) {
        setActivePacket({
          ...activePacket,
          destIp: entry.insideLocalIp,
          destPort: entry.insideLocalPort,
          stage: 3
        });
        setStep(4);
      }
    } else if (activePacket.stage === 3) {
      // Packet reaches PC
      setActivePacket(null);
      setStep(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Network Topology
              {activePacket && (
                <Button onClick={handleNextStep}>
                  {step === 1 ? "Inspect at Router" : 
                   step === 2 ? "Forward to Server" : 
                   step === 3 ? "Inspect Reply at Router" : 
                   "Forward to PC"}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[300px] bg-muted/50 rounded-lg border p-4 flex items-center justify-between">
              
              {/* Private Network */}
              <div className="flex flex-col gap-4">
                {pcs.map(pc => (
                  <div key={pc.id} className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSendRequest(pc.ip)}
                      disabled={activePacket !== null}
                      className="w-32 flex flex-col h-auto py-2"
                    >
                      <Monitor className="w-6 h-6 mb-1" />
                      <span className="text-xs">{pc.ip}</span>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Router */}
              <div className="flex flex-col items-center">
                <div className="bg-primary text-primary-foreground p-4 rounded-full">
                  <Router className="w-8 h-8" />
                </div>
                <span className="mt-2 text-sm font-semibold">NAT Router</span>
                <span className="text-xs text-muted-foreground">{ROUTER_PUBLIC_IP}</span>
              </div>

              {/* Internet */}
              <div className="flex flex-col items-center">
                <div className="bg-blue-500 text-white p-4 rounded-lg">
                  <Server className="w-8 h-8" />
                </div>
                <span className="mt-2 text-sm font-semibold">Web Server</span>
                <span className="text-xs text-muted-foreground">{SERVER_IP}</span>
              </div>

              {/* Animated Packet */}
              <AnimatePresence>
                {activePacket && (
                  <motion.div
                    key={activePacket.id + activePacket.stage}
                    initial={{ 
                      x: activePacket.stage === 0 ? 0 : 
                         activePacket.stage === 1 ? 200 : 
                         activePacket.stage === 2 ? 400 : 200,
                      y: activePacket.stage === 0 ? (activePacket.srcIp === pcs[0].ip ? -80 : activePacket.srcIp === pcs[1].ip ? 0 : 80) : 0,
                      opacity: 0 
                    }}
                    animate={{ 
                      x: activePacket.stage === 0 ? 200 : 
                         activePacket.stage === 1 ? 400 : 
                         activePacket.stage === 2 ? 200 : 0,
                      y: activePacket.stage === 3 ? (activePacket.destIp === pcs[0].ip ? -80 : activePacket.destIp === pcs[1].ip ? 0 : 80) : 0,
                      opacity: 1 
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-[120px] top-[130px] bg-yellow-300 border-2 border-yellow-500 p-2 rounded shadow-lg z-10 flex items-center gap-1"
                  >
                    {activePacket.direction === 'outbound' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                    <span className="text-xs font-bold">Pkt</span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Packet Inspector</CardTitle>
          </CardHeader>
          <CardContent>
            {activePacket ? (
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Source</div>
                  <div>IP: <span className="font-bold text-blue-600 dark:text-blue-400">{activePacket.srcIp}</span></div>
                  <div>Port: <span className="font-bold">{activePacket.srcPort}</span></div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Destination</div>
                  <div>IP: <span className="font-bold text-green-600 dark:text-green-400">{activePacket.destIp}</span></div>
                  <div>Port: <span className="font-bold">{activePacket.destPort}</span></div>
                </div>
                <div className="bg-muted p-3 rounded-md">
                  <div className="text-xs text-muted-foreground mb-1">Payload</div>
                  <div>{activePacket.data}</div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                Click a PC to send a request
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live NAT Table</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Inside Local (Private)</TableHead>
                <TableHead>Inside Global (Public)</TableHead>
                <TableHead>Outside Global (Server)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {natTable.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No active translations</TableCell>
                </TableRow>
              ) : (
                natTable.map((entry, idx) => (
                  <TableRow key={idx}>
                    <TableCell className="font-mono">{entry.insideLocalIp}:{entry.insideLocalPort}</TableCell>
                    <TableCell className="font-mono text-blue-600 dark:text-blue-400">{entry.insideGlobalIp}:{entry.insideGlobalPort}</TableCell>
                    <TableCell className="font-mono text-green-600 dark:text-green-400">{entry.outsideGlobalIp}:{entry.outsideGlobalPort}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
