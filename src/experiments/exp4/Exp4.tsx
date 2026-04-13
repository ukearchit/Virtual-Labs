import React from 'react';
import { ExperimentLayout } from '@/components/ExperimentLayout';
import { Quiz } from '@/components/Quiz';
import { Exp4Simulation } from './Simulation';

const theory = (
  <div className="space-y-4 text-base leading-relaxed">
    <h3 className="text-xl font-semibold">TCP Congestion Control</h3>
    <p>
      TCP Congestion Control prevents a sender from overwhelming the network infrastructure (routers and links) with too much data. It uses a variable called the Congestion Window (<code>cwnd</code>) to determine how many packets can be sent without waiting for an acknowledgment.
    </p>

    <h4 className="text-lg font-medium mt-6">1. Phases of Congestion Control</h4>
    <ul className="list-disc list-inside space-y-2">
      <li><strong>Slow Start:</strong> The <code>cwnd</code> starts small (e.g., 1 MSS) and doubles every RTT until it reaches the slow start threshold (<code>ssthresh</code>).</li>
      <li><strong>Congestion Avoidance:</strong> Once <code>ssthresh</code> is reached, <code>cwnd</code> grows linearly (adds 1 MSS per RTT) to probe for network capacity safely.</li>
      <li><strong>Fast Retransmit & Fast Recovery:</strong> If 3 duplicate ACKs are received, TCP assumes mild congestion, halves the <code>ssthresh</code>, and retransmits the missing packet without waiting for a timeout.</li>
    </ul>

    <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
{`Congestion Window (cwnd) over Time:
cwnd
 |       /|
 |      / |     Linear Growth (Congestion Avoidance)
 |     /  |    /|
 |    /   |   / |
 |   /    |  /  | <-- 3 Duplicate ACKs (Fast Recovery)
 |  /     | /   |
 | /      |/    |
 |/             | <-- Timeout (Back to Slow Start)
 +------------------------ Time`}
    </div>

    <h4 className="text-lg font-medium mt-6">2. Reaction to Packet Loss</h4>
    <p>
      If a timeout occurs (severe congestion), TCP assumes the network is heavily congested. It aggressively drops the <code>cwnd</code> back to 1, halves the <code>ssthresh</code>, and begins the Slow Start process over again to probe the network state from scratch.
    </p>
  </div>
);

const preTestQuestions = [
  {
    id: 1,
    text: "What is the primary goal of TCP Congestion Control?",
    options: [
      { id: "a", text: "To encrypt the data payload" },
      { id: "b", text: "To prevent the sender from overwhelming the receiver" },
      { id: "c", text: "To prevent the sender from overwhelming the network" },
      { id: "d", text: "To increase the speed of UDP packets" }
    ],
    correctAnswer: "c"
  },
  {
    id: 2,
    text: "What variable determines the amount of data TCP can send into the network unacknowledged?",
    options: [
      { id: "a", text: "Receiver Window (rwnd)" },
      { id: "b", text: "Congestion Window (cwnd)" },
      { id: "c", text: "Maximum Segment Size (MSS)" },
      { id: "d", text: "Round Trip Time (RTT)" }
    ],
    correctAnswer: "b"
  },
  {
    id: 3,
    text: "What is the initial phase of TCP congestion control called?",
    options: [
      { id: "a", text: "Congestion Avoidance" },
      { id: "b", text: "Fast Recovery" },
      { id: "c", text: "Fast Retransmit" },
      { id: "d", text: "Slow Start" }
    ],
    correctAnswer: "d"
  },
  {
    id: 4,
    text: "How does TCP detect a lost packet?",
    options: [
      { id: "a", text: "Only by a timeout" },
      { id: "b", text: "Only by receiving duplicate ACKs" },
      { id: "c", text: "By a timeout or receiving 3 duplicate ACKs" },
      { id: "d", text: "The router sends an ICMP error message" }
    ],
    correctAnswer: "c"
  },
  {
    id: 5,
    text: "What does MSS stand for?",
    options: [
      { id: "a", text: "Maximum Segment Size" },
      { id: "b", text: "Minimum Sending Speed" },
      { id: "c", text: "Multiple Stream Synchronization" },
      { id: "d", text: "Main Server Socket" }
    ],
    correctAnswer: "a"
  }
];

const procedure = (
  <ol className="list-decimal list-inside space-y-4 text-base">
    <li><strong>Initialize:</strong> Set the initial <code>ssthresh</code> value (e.g., 16) using the slider.</li>
    <li><strong>Start Transmission:</strong> Click 'Auto Transmit' or 'Next Round' to begin.</li>
    <li><strong>Observe Growth:</strong> Watch the sender push 1 packet, get an ACK, push 2, get ACKs, push 4, etc. Monitor the live graph plotting <code>cwnd</code> over time.</li>
    <li><strong>Trigger Congestion:</strong> Click 'Force Router Drop' to simulate a congested network buffer.</li>
    <li><strong>Analyze Reaction:</strong> Observe the timeout, watch the <code>ssthresh</code> drop to half of the previous <code>cwnd</code>, and watch the <code>cwnd</code> reset to 1.</li>
  </ol>
);

const postTestQuestions = [
  {
    id: 1,
    text: "During Slow Start, how does the congestion window grow?",
    options: [
      { id: "a", text: "Linearly" },
      { id: "b", text: "Exponentially" },
      { id: "c", text: "It stays constant" },
      { id: "d", text: "Logarithmically" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    text: "What triggers the transition from Slow Start to Congestion Avoidance?",
    options: [
      { id: "a", text: "Reaching the ssthresh (Slow Start Threshold)" },
      { id: "b", text: "Receiving 3 duplicate ACKs" },
      { id: "c", text: "A timeout event" },
      { id: "d", text: "Reaching the maximum window size" }
    ],
    correctAnswer: "a"
  },
  {
    id: 3,
    text: "How does Congestion Avoidance increase the cwnd?",
    options: [
      { id: "a", text: "Exponentially, doubling every RTT" },
      { id: "b", text: "Linearly, adding 1 MSS per RTT" },
      { id: "c", text: "It does not increase the cwnd" },
      { id: "d", text: "It adds 10 MSS per RTT" }
    ],
    correctAnswer: "b"
  },
  {
    id: 4,
    text: "What action is taken upon receiving 3 duplicate ACKs in TCP Reno?",
    options: [
      { id: "a", text: "Slow Start" },
      { id: "b", text: "Connection Termination" },
      { id: "c", text: "Fast Retransmit and Fast Recovery" },
      { id: "d", text: "Ignore them and wait for a timeout" }
    ],
    correctAnswer: "c"
  },
  {
    id: 5,
    text: "What happens to the congestion window (cwnd) when a severe congestion event (timeout) occurs?",
    options: [
      { id: "a", text: "It is reduced by half" },
      { id: "b", text: "It is reduced by 1" },
      { id: "c", text: "It drops to 1 MSS" },
      { id: "d", text: "It remains the same, but retransmits" }
    ],
    correctAnswer: "c"
  }
];

const references = (
  <ul className="list-disc list-inside space-y-2">
    <li>Behrouz A. Forouzan, <em>Computer Networks: A Top-Down Approach</em>.</li>
    <li>RFC 5681, <em>TCP Congestion Control</em>.</li>
  </ul>
);

export function Exp4() {
  return (
    <ExperimentLayout
      title="Experiment 4: Transport Layer - TCP Congestion Control (Slow Start)"
      aim="To visualize and analyze the TCP Congestion Control mechanism, specifically the 'Slow Start' algorithm, demonstrating how a network prevents structural collapse by dynamically probing available bandwidth."
      theory={theory}
      preTest={<Quiz questions={preTestQuestions} />}
      procedure={procedure}
      simulation={<Exp4Simulation />}
      postTest={<Quiz questions={postTestQuestions} />}
      references={references}
    />
  );
}
