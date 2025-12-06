// Generates Victorian mystery case names for chat history

const caseTypes = [
  "The Case of",
  "The Mystery of",
  "The Affair of",
  "The Adventure of",
  "The Problem of",
  "The Riddle of",
  "The Secret of",
];

const subjects = [
  "the Missing Algorithm",
  "the Vanishing Variables",
  "the Encrypted Message",
  "the Hidden Protocol",
  "the Lost Function",
  "the Binary Phantom",
  "the Recursive Loop",
  "the Silent Bug",
  "the Shadowy Exception",
  "the Cryptic Error",
  "the Infinite Recursion",
  "the Null Pointer",
  "the Memory Leak",
  "the Race Condition",
  "the Stack Overflow",
  "the Deadlock Dilemma",
  "the Buffer Underflow",
  "the Type Confusion",
  "the Integer Overflow",
  "the Segmentation Fault",
  "the Dangling Reference",
  "the Unhandled Promise",
  "the Floating Point",
  "the Quantum Bit",
  "the Neural Network",
  "the API Enigma",
  "the Database Anomaly",
  "the Cloud Conundrum",
  "the Blockchain Puzzle",
  "the Regex Mystery",
];

// Generate a consistent mystery name based on chat ID
export const generateMysteryName = (chatId: string): string => {
  // Use chatId to generate a consistent but pseudo-random index
  let hash = 0;
  for (let i = 0; i < chatId.length; i++) {
    hash = ((hash << 5) - hash) + chatId.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }

  const caseIndex = Math.abs(hash) % caseTypes.length;
  const subjectIndex = Math.abs(hash >> 8) % subjects.length;

  return `${caseTypes[caseIndex]} ${subjects[subjectIndex]}`;
};

// Get a mystery case number from timestamp
export const getCaseNumber = (chatId: string): string => {
  // Extract timestamp-like part or generate from hash
  const match = chatId.match(/\d+/);
  if (match) {
    const timestamp = match[0];
    return `Case #${timestamp.slice(-6)}`;
  }

  // Fallback: generate from hash
  let hash = 0;
  for (let i = 0; i < chatId.length; i++) {
    hash = ((hash << 5) - hash) + chatId.charCodeAt(i);
    hash = hash & hash;
  }
  return `Case #${Math.abs(hash).toString().slice(0, 6)}`;
};
