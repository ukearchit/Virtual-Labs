import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, HelpCircle, ListOrdered, PlayCircle, CheckCircle, BookMarked } from 'lucide-react';

interface ExperimentLayoutProps {
  title: string;
  aim: string;
  theory: React.ReactNode;
  preTest: React.ReactNode;
  procedure: React.ReactNode;
  simulation: React.ReactNode;
  postTest: React.ReactNode;
  references: React.ReactNode;
}

export function ExperimentLayout({
  title,
  aim,
  theory,
  preTest,
  procedure,
  simulation,
  postTest,
  references
}: ExperimentLayoutProps) {
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-none">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1 text-lg">{aim}</p>
      </div>
      
      <Tabs defaultValue="theory" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-6 flex-none">
          <TabsTrigger value="theory" className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Theory</span></TabsTrigger>
          <TabsTrigger value="pretest" className="flex items-center gap-2"><HelpCircle className="w-4 h-4" /> <span className="hidden sm:inline">Pre-test</span></TabsTrigger>
          <TabsTrigger value="procedure" className="flex items-center gap-2"><ListOrdered className="w-4 h-4" /> <span className="hidden sm:inline">Procedure</span></TabsTrigger>
          <TabsTrigger value="simulation" className="flex items-center gap-2"><PlayCircle className="w-4 h-4" /> <span className="hidden sm:inline">Simulation</span></TabsTrigger>
          <TabsTrigger value="posttest" className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> <span className="hidden sm:inline">Post-test</span></TabsTrigger>
          <TabsTrigger value="references" className="flex items-center gap-2"><BookMarked className="w-4 h-4" /> <span className="hidden sm:inline">References</span></TabsTrigger>
        </TabsList>
        
        <div className="flex-1 min-h-0 mt-4 border rounded-md bg-card text-card-foreground shadow-sm overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <TabsContent value="theory" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {theory}
              </TabsContent>
              <TabsContent value="pretest" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {preTest}
              </TabsContent>
              <TabsContent value="procedure" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {procedure}
              </TabsContent>
              <TabsContent value="simulation" className="m-0 focus-visible:outline-none focus-visible:ring-0 h-full">
                {simulation}
              </TabsContent>
              <TabsContent value="posttest" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {postTest}
              </TabsContent>
              <TabsContent value="references" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                {references}
              </TabsContent>
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  );
}
