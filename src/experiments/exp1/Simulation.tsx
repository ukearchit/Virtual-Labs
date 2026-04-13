import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";

export function Exp1Simulation() {
  const [inputPayload, setInputPayload] = useState("1111111111");
  const [stuffedPayload, setStuffedPayload] = useState<{bit: string, isStuffed: boolean}[]>([]);
  const [framedPayload, setFramedPayload] = useState<{bit: string, type: 'flag' | 'data' | 'stuffed'}[]>([]);
  const [receivedPayload, setReceivedPayload] = useState<string>("");
  const [step, setStep] = useState(0); // 0: input, 1: stuffed, 2: framed, 3: received
  const [animatingIndex, setAnimatingIndex] = useState(-1);

  const handleStuffBits = async () => {
    setStep(1);
    let count = 0;
    const result: {bit: string, isStuffed: boolean}[] = [];
    
    // Animate the stuffing process
    for (let i = 0; i < inputPayload.length; i++) {
      const bit = inputPayload[i];
      result.push({ bit, isStuffed: false });
      setStuffedPayload([...result]);
      setAnimatingIndex(result.length - 1);
      
      if (bit === '1') {
        count++;
        if (count === 5) {
          await new Promise(r => setTimeout(r, 500)); // Pause to show 5 ones
          result.push({ bit: '0', isStuffed: true });
          setStuffedPayload([...result]);
          setAnimatingIndex(result.length - 1);
          count = 0;
        }
      } else {
        count = 0;
      }
      await new Promise(r => setTimeout(r, 200));
    }
    setAnimatingIndex(-1);
  };

  const handleAddFlags = () => {
    const flag = "01111110".split('').map(b => ({ bit: b, type: 'flag' as const }));
    const data = stuffedPayload.map(b => ({ bit: b.bit, type: (b.isStuffed ? 'stuffed' : 'data') as 'stuffed' | 'data' }));
    setFramedPayload([...flag, ...data, ...flag]);
    setStep(2);
  };

  const handleUnstuff = async () => {
    setStep(3);
    setReceivedPayload("");
    
    // Extract data part
    const dataPart = framedPayload.filter(b => b.type !== 'flag');
    let count = 0;
    let result = "";
    
    for (let i = 0; i < dataPart.length; i++) {
      const b = dataPart[i];
      setAnimatingIndex(i);
      
      if (b.bit === '1') {
        count++;
        result += b.bit;
      } else {
        if (count === 5 && b.type === 'stuffed') {
          // It's a stuffed 0, skip it
          await new Promise(r => setTimeout(r, 500)); // Pause to show skipping
          count = 0;
          continue;
        } else {
          count = 0;
          result += b.bit;
        }
      }
      setReceivedPayload(result);
      await new Promise(r => setTimeout(r, 200));
    }
    setAnimatingIndex(-1);
  };

  const reset = () => {
    setStep(0);
    setStuffedPayload([]);
    setFramedPayload([]);
    setReceivedPayload("");
    setAnimatingIndex(-1);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sender</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 items-center">
            <Input 
              value={inputPayload} 
              onChange={(e) => {
                const val = e.target.value.replace(/[^01]/g, '');
                setInputPayload(val);
                if (step > 0) reset();
              }}
              placeholder="Enter binary payload"
              className="font-mono text-lg tracking-widest max-w-md"
              maxLength={20}
            />
            <Button onClick={handleStuffBits} disabled={step > 0 || !inputPayload}>
              Apply Bit Stuffing
            </Button>
          </div>

          {step >= 1 && (
            <div className="p-4 bg-muted rounded-md min-h-[80px] flex items-center flex-wrap gap-1">
              <span className="text-sm font-semibold mr-4">Stuffed Payload:</span>
              <AnimatePresence>
                {stuffedPayload.map((item, idx) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0, 
                      scale: animatingIndex === idx ? 1.2 : 1,
                      color: item.isStuffed ? '#ef4444' : 'inherit'
                    }}
                    className={`font-mono text-xl font-bold ${item.isStuffed ? 'text-red-500' : ''}`}
                  >
                    {item.bit}
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}

          {step >= 1 && (
            <Button onClick={handleAddFlags} disabled={step > 1 || animatingIndex !== -1}>
              Add Flags & Transmit
            </Button>
          )}

          {step >= 2 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md min-h-[80px] flex items-center flex-wrap gap-1 border border-blue-200 dark:border-blue-800">
              <span className="text-sm font-semibold mr-4 text-blue-800 dark:text-blue-200">Transmitted Frame:</span>
              {framedPayload.map((item, idx) => (
                <span
                  key={idx}
                  className={`font-mono text-xl font-bold ${
                    item.type === 'flag' ? 'text-white bg-blue-600 dark:bg-blue-500 px-0.5 rounded-sm mx-[1px]' : 
                    item.type === 'stuffed' ? 'text-red-500' : ''
                  }`}
                >
                  {item.bit}
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {step >= 2 && (
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader className="bg-green-50 dark:bg-green-950/50">
            <CardTitle className="text-green-800 dark:text-green-400 flex justify-between items-center">
              Receiver
              <Button size="sm" variant="outline" onClick={handleUnstuff} disabled={step > 2}>
                Receive & Un-stuff
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {step >= 3 && (
              <div className="p-4 bg-muted rounded-md min-h-[80px] flex items-center flex-wrap gap-1">
                <span className="text-sm font-semibold mr-4">Recovered Payload:</span>
                <span className="font-mono text-xl font-bold tracking-widest">
                  {receivedPayload}
                </span>
                {animatingIndex === -1 && receivedPayload === inputPayload && (
                  <Badge className="ml-auto bg-green-500">Success: Matches Original</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
