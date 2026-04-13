import React from 'react';
import { ExperimentLayout } from '@/components/ExperimentLayout';
import { Quiz } from '@/components/Quiz';
import { Exp2Simulation } from './Simulation';

const theory = (
  <div className="space-y-4 text-base leading-relaxed">
    <p>
      The Transport Layer provides logical communication between application processes running on different hosts. The two most common protocols are TCP and UDP. Choosing between them depends on the application's tolerance for delay versus data loss.
    </p>

    <h4 className="text-lg font-medium mt-6">1. Transmission Control Protocol (TCP)</h4>
    <p>
      TCP is connection-oriented. It uses a 3-way handshake, sequence numbers, and acknowledgments to ensure 100% reliable data delivery. If a packet is lost, TCP pauses the data stream to retransmit the missing packet. It also provides congestion control and flow control.
    </p>
    <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
{`TCP 3-Way Handshake:
Client                        Server
  | ------ SYN (seq=x) ------>  |
  | <--- SYN-ACK (seq=y,       |
  |           ack=x+1) -------  |
  | ---- ACK (ack=y+1) ------>  |`}
    </div>

    <h4 className="text-lg font-medium mt-6">2. User Datagram Protocol (UDP)</h4>
    <p>
      UDP is connectionless. It simply fires datagrams at the destination as fast as possible without waiting for acknowledgments. It does not guarantee delivery or ordering. If a packet is lost, UDP ignores it and processes the next incoming packet.
    </p>
    <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
{`UDP Data Flow:
Client                        Server
  | ------ Data Packet ------>  |
  | ------ Data Packet ------>  |
  | <----- Data Packet -------  |`}
    </div>

    <h4 className="text-lg font-medium mt-6">3. Comparison & Use Cases</h4>
    <p>
      Use TCP for web browsing (HTTP), email (SMTP), and file transfer (FTP) where perfect reliability is required. Use UDP for live video streaming, VoIP, and online gaming where speed is prioritized and occasional packet loss is acceptable. In high-frequency trading, UDP is often preferred for market data feeds because receiving the most recent price immediately is more valuable than waiting for an older, delayed price update.
    </p>
  </div>
);

const preTestQuestions = [
  {
    id: 1,
    text: "Which layer of the OSI model do TCP and UDP operate on?",
    options: [
      { id: "a", text: "Network Layer" },
      { id: "b", text: "Transport Layer" },
      { id: "c", text: "Data Link Layer" },
      { id: "d", text: "Application Layer" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    text: "Which protocol provides reliable, ordered, and error-checked delivery of a stream of bytes?",
    options: [
      { id: "a", text: "UDP" },
      { id: "b", text: "ICMP" },
      { id: "c", text: "TCP" },
      { id: "d", text: "IP" }
    ],
    correctAnswer: "c"
  },
  {
    id: 3,
    text: "What is the first step in establishing a TCP connection?",
    options: [
      { id: "a", text: "Sending an ACK packet" },
      { id: "b", text: "Sending a SYN packet" },
      { id: "c", text: "Sending a FIN packet" },
      { id: "d", text: "Sending data directly" }
    ],
    correctAnswer: "b"
  },
  {
    id: 4,
    text: "Which protocol is best suited for live video streaming?",
    options: [
      { id: "a", text: "TCP" },
      { id: "b", text: "HTTP" },
      { id: "c", text: "FTP" },
      { id: "d", text: "UDP" }
    ],
    correctAnswer: "d"
  },
  {
    id: 5,
    text: "Does UDP guarantee packet ordering?",
    options: [
      { id: "a", text: "Yes, always" },
      { id: "b", text: "No, it does not" },
      { id: "c", text: "Only if configured manually" },
      { id: "d", text: "Only for small files" }
    ],
    correctAnswer: "b"
  }
];

const procedure = (
  <ol className="list-decimal list-inside space-y-4 text-base">
    <li><strong>Select Protocol:</strong> Choose either 'TCP' or 'UDP' from the toggle switch in the simulation controls.</li>
    <li><strong>Set Network Conditions:</strong> Adjust the slider for 'Packet Drop Rate Percentage' (0-20%).</li>
    <li><strong>Start Stream:</strong> Click 'Begin Data Stream' to simulate a live financial ticker feed sending rapid data points to a receiver graph.</li>
    <li><strong>Observe Behavior:</strong> Watch how UDP handles packet drops (missing plot points but real-time updates) versus TCP (data pauses, then spikes as retransmitted packets arrive out-of-sync with real time).</li>
  </ol>
);

const postTestQuestions = [
  {
    id: 1,
    text: "In a live, high-frequency data stream, what is the major drawback of TCP's reliability mechanism?",
    options: [
      { id: "a", text: "It uses too much CPU power" },
      { id: "b", text: "Retransmission delays can make subsequent data stale" },
      { id: "c", text: "It cannot handle large payloads" },
      { id: "d", text: "It encrypts data too slowly" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    text: "What happens in TCP if an acknowledgment for a packet is not received?",
    options: [
      { id: "a", text: "The connection is immediately terminated" },
      { id: "b", text: "The sender retransmits the packet" },
      { id: "c", text: "The sender skips to the next packet" },
      { id: "d", text: "The receiver drops the entire session" }
    ],
    correctAnswer: "b"
  },
  {
    id: 3,
    text: "Why is UDP generally faster than TCP?",
    options: [
      { id: "a", text: "It uses a shorter cable" },
      { id: "b", text: "It compresses data automatically" },
      { id: "c", text: "It has no connection setup or error recovery overhead" },
      { id: "d", text: "It bypasses the network layer" }
    ],
    correctAnswer: "c"
  },
  {
    id: 4,
    text: "Which of the following applications typically uses UDP?",
    options: [
      { id: "a", text: "File Transfer Protocol (FTP)" },
      { id: "b", text: "Domain Name System (DNS) lookups" },
      { id: "c", text: "Secure Shell (SSH)" },
      { id: "d", text: "Hypertext Transfer Protocol (HTTP)" }
    ],
    correctAnswer: "b"
  },
  {
    id: 5,
    text: "In the TCP 3-way handshake, what packet follows the initial SYN packet?",
    options: [
      { id: "a", text: "ACK" },
      { id: "b", text: "FIN" },
      { id: "c", text: "SYN-ACK" },
      { id: "d", text: "RST" }
    ],
    correctAnswer: "c"
  }
];

const references = (
  <ul className="list-disc list-inside space-y-2">
    <li>Andrew S. Tanenbaum, <em>Computer Networks</em>, 4th Edition.</li>
    <li>Kurose & Ross, <em>Computer Networking: A Top-Down Approach</em>.</li>
  </ul>
);

export function Exp2() {
  return (
    <ExperimentLayout
      title="Experiment 2: Transport Layer - TCP vs. UDP for Real-Time Market Streams"
      aim="To evaluate and compare the behavior of TCP and UDP transport layer protocols, specifically focusing on how packet loss, sequencing, and latency impact real-time, high-frequency data streams."
      theory={theory}
      preTest={<Quiz questions={preTestQuestions} />}
      procedure={procedure}
      simulation={<Exp2Simulation />}
      postTest={<Quiz questions={postTestQuestions} />}
      references={references}
    />
  );
}
