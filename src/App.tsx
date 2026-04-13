/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Exp1 } from './experiments/exp1/Exp1';
import { Exp2 } from './experiments/exp2/Exp2';
import { Exp3 } from './experiments/exp3/Exp3';
import { Exp4 } from './experiments/exp4/Exp4';
import { Network, Activity, Globe, TrendingUp, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function App() {
  const [activeExp, setActiveExp] = useState(1);

  const experiments = [
    { id: 1, title: 'HDLC Bit Stuffing', icon: <Network className="w-5 h-5" />, component: <Exp1 /> },
    { id: 2, title: 'TCP vs UDP', icon: <Activity className="w-5 h-5" />, component: <Exp2 /> },
    { id: 3, title: 'NAT Traversal', icon: <Globe className="w-5 h-5" />, component: <Exp3 /> },
    { id: 4, title: 'TCP Congestion', icon: <TrendingUp className="w-5 h-5" />, component: <Exp4 /> },
  ];

  const NavItems = () => (
    <div className="space-y-2">
      {experiments.map((exp) => (
        <Button
          key={exp.id}
          variant={activeExp === exp.id ? "secondary" : "ghost"}
          className="w-full justify-start gap-3 text-left h-auto py-3"
          onClick={() => setActiveExp(exp.id)}
        >
          {exp.icon}
          <span className="font-medium">{exp.title}</span>
        </Button>
      ))}
    </div>
  );

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Network className="w-6 h-6" />
            Virtual Labs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Computer Networks</p>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <NavItems />
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card">
          <h1 className="text-lg font-bold flex items-center gap-2 text-primary">
            <Network className="w-5 h-5" />
            Virtual Labs
          </h1>
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">Experiments</h2>
              </div>
              <div className="p-4">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col">
          {experiments.find(e => e.id === activeExp)?.component}
        </main>
      </div>
    </div>
  );
}
