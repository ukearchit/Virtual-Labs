import React from 'react';
import { ExperimentLayout } from '@/components/ExperimentLayout';
import { Quiz } from '@/components/Quiz';
import { Exp3Simulation } from './Simulation';

const theory = (
  <div className="space-y-4 text-base leading-relaxed">
    <h3 className="text-xl font-semibold">Network Address Translation (NAT)</h3>
    <p>
      Network Address Translation (NAT) is a method used to map multiple private IP addresses to a single public IP address before transferring the information onto the internet.
    </p>

    <h4 className="text-lg font-medium mt-6">1. The Need for NAT</h4>
    <p>
      Due to the exhaustion of IPv4 addresses, NAT allows an entire local area network (LAN) to use just one public IP address for internet access. Certain IP blocks (e.g., <code>192.168.x.x</code>, <code>10.x.x.x</code>) are reserved for private use and cannot be routed on the public internet.
    </p>
    <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
{`NAT Block Diagram:
Private Network                    NAT Router                    Public Internet
[Host 192.168.1.2] --\\                                       /-- [Server 8.8.8.8]
                      |-- [Internal: 192.168.1.1]           |
[Host 192.168.1.3] --/    [External: 203.0.113.5] ----------/`}
    </div>

    <h4 className="text-lg font-medium mt-6">2. How NAT Works (PAT)</h4>
    <p>
      Port Address Translation (PAT), also known as NAT Overload, is the most common form of NAT. When a private device requests a webpage, the router intercepts the packet. It replaces the device's private Source IP with the router's Public IP. To remember which device made the request, the router also assigns a unique Source Port number and records this mapping in a NAT Translation Table.
    </p>

    <h4 className="text-lg font-medium mt-6">3. NAT Traversal</h4>
    <p>
      Because NAT hides internal IPs, external servers cannot easily initiate connections to internal hosts. NAT Traversal techniques (like STUN, TURN, and ICE) are used by applications (like VoIP or P2P gaming) to discover their public IP and establish direct communication.
    </p>
  </div>
);

const preTestQuestions = [
  {
    id: 1,
    text: "What does NAT stand for?",
    options: [
      { id: "a", text: "Network Access Terminal" },
      { id: "b", text: "Network Address Translation" },
      { id: "c", text: "Node Allocation Table" },
      { id: "d", text: "Network Area Transfer" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    text: "Which of the following is a private IPv4 address?",
    options: [
      { id: "a", text: "8.8.8.8" },
      { id: "b", text: "192.168.1.50" },
      { id: "c", text: "172.217.14.206" },
      { id: "d", text: "1.1.1.1" }
    ],
    correctAnswer: "b"
  },
  {
    id: 3,
    text: "Why was NAT primarily developed?",
    options: [
      { id: "a", text: "To increase Wi-Fi speeds" },
      { id: "b", text: "To replace DNS" },
      { id: "c", text: "To mitigate IPv4 address exhaustion" },
      { id: "d", text: "To encrypt local traffic" }
    ],
    correctAnswer: "c"
  },
  {
    id: 4,
    text: "What device typically performs NAT in a home network?",
    options: [
      { id: "a", text: "Switch" },
      { id: "b", text: "Hub" },
      { id: "c", text: "Router" },
      { id: "d", text: "Modem" }
    ],
    correctAnswer: "c"
  },
  {
    id: 5,
    text: "Can a private IP address be routed on the public internet?",
    options: [
      { id: "a", text: "Yes, always" },
      { id: "b", text: "No, they are non-routable on the public internet" },
      { id: "c", text: "Only if it starts with 10." },
      { id: "d", text: "Only during off-peak hours" }
    ],
    correctAnswer: "b"
  }
];

const procedure = (
  <ol className="list-decimal list-inside space-y-4 text-base">
    <li><strong>Send Request:</strong> Click 'Send HTTP Request' from a PC (e.g., Private IP 192.168.1.10).</li>
    <li><strong>Inspect Packet at Router:</strong> The simulation pauses as the packet hits the NAT Router. Inspect the original IP header in the Packet Inspector.</li>
    <li><strong>View Translation:</strong> Click 'Forward to Server'. Watch the router modify the Source IP and Port, and record the entry in the dynamic NAT Table on the screen.</li>
    <li><strong>Return Path:</strong> Watch the external server reply, and observe the router use the NAT table to reverse the translation and route the packet back to the original PC.</li>
  </ol>
);

const postTestQuestions = [
  {
    id: 1,
    text: "What happens to the source IP address of a packet originating from a private network when it passes through a NAT router to the internet?",
    options: [
      { id: "a", text: "It remains unchanged" },
      { id: "b", text: "It is translated to the router's public IP address" },
      { id: "c", text: "It is encrypted" },
      { id: "d", text: "It is converted to an IPv6 address" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    text: "In Port Address Translation (PAT), what does the router use to differentiate between internal hosts?",
    options: [
      { id: "a", text: "Source MAC Address" },
      { id: "b", text: "Source IP Address" },
      { id: "c", text: "Source Port Number" },
      { id: "d", text: "Destination Port Number" }
    ],
    correctAnswer: "c"
  },
  {
    id: 3,
    text: "If an external server sends a packet to a NAT router without a corresponding active entry in the NAT table, what typically happens?",
    options: [
      { id: "a", text: "The router broadcasts it to all internal PCs" },
      { id: "b", text: "The router accepts it and opens a new connection" },
      { id: "c", text: "The router drops the packet" },
      { id: "d", text: "The router forwards it to the switch" }
    ],
    correctAnswer: "c"
  },
  {
    id: 4,
    text: "What is a common protocol used for NAT traversal?",
    options: [
      { id: "a", text: "STUN" },
      { id: "b", text: "HTTP" },
      { id: "c", text: "SMTP" },
      { id: "d", text: "FTP" }
    ],
    correctAnswer: "a"
  },
  {
    id: 5,
    text: "Which of the following applications struggles the most with strict NAT?",
    options: [
      { id: "a", text: "Web Browsing" },
      { id: "b", text: "Email" },
      { id: "c", text: "Peer-to-Peer (P2P) gaming" },
      { id: "d", text: "Video streaming (e.g., Netflix)" }
    ],
    correctAnswer: "c"
  }
];

const references = (
  <ul className="list-disc list-inside space-y-2">
    <li>Behrouz A. Forouzan, <em>TCP/IP Protocol Suite</em>, Tata McGraw Hill edition.</li>
    <li>RFC 1631, <em>The IP Network Address Translator (NAT)</em>.</li>
  </ul>
);

export function Exp3() {
  return (
    <ExperimentLayout
      title="Experiment 3: Network Layer - Network Address Translation (NAT) Traversal"
      aim="To simulate Network Address Translation (NAT) to understand how multiple devices on a private local network share a single public IPv4 address to access external internet resources."
      theory={theory}
      preTest={<Quiz questions={preTestQuestions} />}
      procedure={procedure}
      simulation={<Exp3Simulation />}
      postTest={<Quiz questions={postTestQuestions} />}
      references={references}
    />
  );
}
