import React from 'react';
import { ExperimentLayout } from '@/components/ExperimentLayout';
import { Quiz } from '@/components/Quiz';
import { Exp1Simulation } from './Simulation';

const theory = (
  <div className="space-y-4 text-base leading-relaxed">
    <p>
      In the Data Link Layer, raw streams of bits received from the physical layer must be organized into manageable, error-checked units called frames. High-Level Data Link Control (HDLC) is a popular bit-oriented protocol that uses a specific bit pattern—<code>01111110</code>—known as the Flag, to mark the beginning and the end of every frame.
    </p>

    <h4 className="text-lg font-medium mt-6">1. The Structure of an HDLC Frame</h4>
    <p>
      An HDLC frame encapsulates the network layer payload with routing, control, and error-checking information.
    </p>
    <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
{`+----------+---------+---------+------------------+---------+----------+
|   FLAG   | ADDRESS | CONTROL |     PAYLOAD      |   FCS   |   FLAG   |
| 01111110 |  8 bits |  8 bits |  Variable Length | 16 bits | 01111110 |
+----------+---------+---------+------------------+---------+----------+`}
    </div>

    <h4 className="text-lg font-medium mt-6">2. The Problem of Transparency</h4>
    <p>
      Because HDLC is a bit-oriented protocol, the payload can be any arbitrary sequence of bits (images, text, encrypted data). A critical problem arises if the payload data itself naturally contains the exact flag sequence (<code>01111110</code>). If this happens, the receiving hardware might incorrectly assume the frame has ended prematurely, leading to truncated data and dropped packets. The network must guarantee Data Transparency—the ability to send any data sequence without it being misinterpreted as a control command.
    </p>

    <h4 className="text-lg font-medium mt-6">3. The Bit Stuffing Algorithm (Sender Side)</h4>
    <p>
      To achieve transparency, the sender continuously monitors the payload bit stream before transmitting it.
    </p>
    <p>
      <strong>Rule:</strong> Every time the sender encounters five consecutive 1s in the payload, it automatically "stuffs" (inserts) a 0 immediately after them, regardless of what the next actual bit is.
    </p>
    <p>
      This guarantees that the sequence <code>01111110</code> will never appear inside the payload.
    </p>
    <div className="bg-muted p-4 rounded-md font-mono text-sm overflow-x-auto whitespace-pre">
{`Original Data Stream:    0 1 1 0 1 1 1 1 1 1 0 0 1
                                         ^ 
                                     (Five 1s detected)
                                         |
Stuffed Data Stream:     0 1 1 0 1 1 1 1 1 0 1 0 0 1
                                           ^
                                     (Zero inserted)`}
    </div>

    <h4 className="text-lg font-medium mt-6">4. The Receiver's Role (Destuffing)</h4>
    <p>
      When the receiver processes the incoming stream, it knows that the start and end of the frame are marked by <code>01111110</code>. Once inside the frame, it scans the incoming bits.
    </p>
    <p>
      <strong>Rule:</strong> If it detects five consecutive 1s, it checks the next bit.
    </p>
    <ul className="list-disc list-inside space-y-2">
      <li>If the next bit is a 0, the receiver recognizes it as a stuffed bit and discards it, restoring the original data.</li>
      <li>If the next bit is a 1 (making it six 1s) followed by a 0, the receiver recognizes the end-of-frame flag.</li>
    </ul>
  </div>
);

const preTestQuestions = [
  {
    id: 1,
    text: "What is the standard flag sequence used in HDLC framing?",
    options: [
      { id: "a", text: "11111111" },
      { id: "b", text: "01111110" },
      { id: "c", text: "10101010" },
      { id: "d", text: "00000000" }
    ],
    correctAnswer: "b"
  },
  {
    id: 2,
    text: "In bit stuffing, a zero is inserted after how many consecutive ones?",
    options: [
      { id: "a", text: "4" },
      { id: "b", text: "5" },
      { id: "c", text: "6" },
      { id: "d", text: "8" }
    ],
    correctAnswer: "b"
  },
  {
    id: 3,
    text: "Which layer of the OSI model is responsible for framing and bit stuffing?",
    options: [
      { id: "a", text: "Physical Layer" },
      { id: "b", text: "Data Link Layer" },
      { id: "c", text: "Network Layer" },
      { id: "d", text: "Transport Layer" }
    ],
    correctAnswer: "b"
  },
  {
    id: 4,
    text: "What type of protocol is HDLC?",
    options: [
      { id: "a", text: "Bit-oriented" },
      { id: "b", text: "Byte-oriented" },
      { id: "c", text: "Character-oriented" },
      { id: "d", text: "Message-oriented" }
    ],
    correctAnswer: "a"
  },
  {
    id: 5,
    text: "What does the receiver do when it sees five consecutive 1s followed by a 0 inside the frame payload?",
    options: [
      { id: "a", text: "Ends the frame processing" },
      { id: "b", text: "Discards the 0 as a stuffed bit" },
      { id: "c", text: "Asks the sender for a retransmission" },
      { id: "d", text: "Replaces the 0 with a 1" }
    ],
    correctAnswer: "b"
  }
];

const procedure = (
  <ol className="list-decimal list-inside space-y-4 text-base">
    <li><strong>Input Payload:</strong> Enter a binary string containing continuous sequences of 1s (e.g., <code>1111111111</code>).</li>
    <li><strong>Execute Sender Logic:</strong> Click 'Apply Bit Stuffing' to watch the algorithm scan the string and dynamically insert 0s.</li>
    <li><strong>Frame Construction:</strong> Watch the simulation append the <code>01111110</code> flags to the start and end of the stuffed payload.</li>
    <li><strong>Execute Receiver Logic:</strong> Click 'Transmit & Destuff' to watch the receiver scan the frame, strip the flags, and remove the stuffed 0s to recover the original payload.</li>
  </ol>
);

const postTestQuestions = [
  {
    id: 1,
    text: "If the original data is 0111111101, what will be the transmitted data after bit stuffing (excluding flags)?",
    options: [
      { id: "a", text: "01111101101" },
      { id: "b", text: "01111111001" },
      { id: "c", text: "0111110101" },
      { id: "d", text: "0111101101" }
    ],
    correctAnswer: "a"
  },
  {
    id: 2,
    text: "What is the primary purpose of bit stuffing?",
    options: [
      { id: "a", text: "To compress the data to save bandwidth" },
      { id: "b", text: "To encrypt the data for security" },
      { id: "c", text: "To prevent data from being mistaken for a control flag" },
      { id: "d", text: "To correct transmission errors" }
    ],
    correctAnswer: "c"
  },
  {
    id: 3,
    text: "After successful de-stuffing at the receiver, the length of the payload is:",
    options: [
      { id: "a", text: "Greater than the original payload" },
      { id: "b", text: "Less than the original payload" },
      { id: "c", text: "Exactly the same as the original payload" },
      { id: "d", text: "Depends on the number of flags" }
    ],
    correctAnswer: "c"
  },
  {
    id: 4,
    text: "If the original payload contains the sequence 0111110, what will the sender transmit (excluding flags)?",
    options: [
      { id: "a", text: "01111100" },
      { id: "b", text: "011111010" },
      { id: "c", text: "0111110" },
      { id: "d", text: "011111000" }
    ],
    correctAnswer: "a"
  },
  {
    id: 5,
    text: "Which component of the HDLC frame ensures that corrupted bits can be detected by the receiver?",
    options: [
      { id: "a", text: "The Flag sequence" },
      { id: "b", text: "The Address field" },
      { id: "c", text: "The Control field" },
      { id: "d", text: "The FCS (Frame Check Sequence)" }
    ],
    correctAnswer: "d"
  }
];

const references = (
  <ul className="list-disc list-inside space-y-2">
    <li>Behrouz A. Forouzan, <em>Computer Networks A Top down Approach</em>.</li>
  </ul>
);

export function Exp1() {
  return (
    <ExperimentLayout
      title="Experiment 1: Data Link Layer - HDLC Bit Stuffing & Framing"
      aim="To simulate the High-Level Data Link Control (HDLC) bit-stuffing mechanism to understand how hardware and software boundaries synchronize and separate data frames using specific bit patterns without confusing payload data for control flags."
      theory={theory}
      preTest={<Quiz questions={preTestQuestions} />}
      procedure={procedure}
      simulation={<Exp1Simulation />}
      postTest={<Quiz questions={postTestQuestions} />}
      references={references}
    />
  );
}
