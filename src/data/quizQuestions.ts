export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer (0, 1, or 2)
  explanation?: string;
}

export const holmesQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Vad är adressen till Sherlock Holmes hem?",
    options: ["221A Baker Street", "221B Baker Street", "221C Baker Street"],
    correctAnswer: 1,
    explanation: "221B Baker Street är den berömda adressen där Holmes och Watson bor."
  },
  {
    id: 2,
    question: "Vad heter Sherlock Holmes bästa vän och assistent?",
    options: ["Dr. Watson", "Inspector Lestrade", "Mrs. Hudson"],
    correctAnswer: 0,
    explanation: "Dr. John Watson är Holmes trofaste vän och partner i alla äventyr."
  },
  {
    id: 3,
    question: "Vilket instrument spelar Sherlock Holmes?",
    options: ["Piano", "Fiol", "Flöjt"],
    correctAnswer: 1,
    explanation: "Holmes spelar fiol när han funderar över komplicerade fall."
  },
  {
    id: 4,
    question: "Vad är Sherlock Holmes mest kända uttryck?",
    options: ["Fantastiskt!", "Elementärt!", "Otroligt!"],
    correctAnswer: 1,
    explanation: "Elementärt, min käre Watson! är Holmes signaturfras."
  },
  {
    id: 5,
    question: "Vem är Sherlock Holmes värsta fiende?",
    options: ["Professor Moriarty", "Colonel Moran", "Irene Adler"],
    correctAnswer: 0,
    explanation: "Professor Moriarty kallas 'Brottets Napoleon' och är Holmes ärkefiende."
  },
  {
    id: 6,
    question: "Vad röker Sherlock Holmes oftast?",
    options: ["Cigaretter", "Pipa", "Cigarrer"],
    correctAnswer: 1,
    explanation: "Holmes är känd för sin pipa som han ofta röker när han funderar."
  },
  {
    id: 7,
    question: "Vem skrev Sherlock Holmes-böckerna?",
    options: ["Charles Dickens", "Arthur Conan Doyle", "Agatha Christie"],
    correctAnswer: 1,
    explanation: "Sir Arthur Conan Doyle skapade Sherlock Holmes 1887."
  },
  {
    id: 8,
    question: "Vilken typ av hatt bär Sherlock Holmes oftast?",
    options: ["Bowler hat", "Deerstalker", "Top hat"],
    correctAnswer: 1,
    explanation: "Deerstalker-hatten är Holmes klassiska huvudbonad för fältarbete."
  },
  {
    id: 9,
    question: "Vad heter husvärdinna på 221B Baker Street?",
    options: ["Mrs. Hudson", "Mrs. Turner", "Mrs. Mortimer"],
    correctAnswer: 0,
    explanation: "Mrs. Hudson är den tålmodiga husvärdinna som står ut med Holmes och Watson."
  },
  {
    id: 10,
    question: "I vilken första berättelse introducerades Sherlock Holmes?",
    options: ["A Study in Scarlet", "The Sign of Four", "The Adventures of Sherlock Holmes"],
    correctAnswer: 0,
    explanation: "A Study in Scarlet (1887) var den första Holmes-berättelsen."
  },
  {
    id: 11,
    question: "Vilken är Holmes favoritmetod för deduktion?",
    options: ["Intuition", "Observation och logik", "Gissningar"],
    correctAnswer: 1,
    explanation: "Holmes använder noggrann observation kombinerat med logisk deduktion."
  },
  {
    id: 12,
    question: "Vad kallas Holmes grupp av gatubarn som hjälper honom?",
    options: ["Baker Street Boys", "The Irregulars", "Street Kids"],
    correctAnswer: 1,
    explanation: "Baker Street Irregulars är Holmes nätverk av gatubarn som samlar information."
  },
  {
    id: 13,
    question: "Vilken kvinnlig karaktär kallade Holmes 'The Woman'?",
    options: ["Mrs. Hudson", "Mary Morstan", "Irene Adler"],
    correctAnswer: 2,
    explanation: "Irene Adler från 'A Scandal in Bohemia' är den enda kvinna som imponerat på Holmes."
  },
  {
    id: 14,
    question: "Vilket ämne studerade Dr. Watson innan han blev läkare?",
    options: ["Medicin", "Juridik", "Militärtjänst"],
    correctAnswer: 2,
    explanation: "Watson tjänstgjorde som militärläkare i Afghanistan innan han träffade Holmes."
  },
  {
    id: 15,
    question: "Vad är Holmes bror Mycroft känd för?",
    options: ["Att vara detektiv", "Att arbeta för regeringen", "Att vara musiker"],
    correctAnswer: 1,
    explanation: "Mycroft Holmes arbetar för brittiska regeringen och är ännu smartare än Sherlock."
  }
];

// Function to get random questions
export const getRandomQuestions = (count: number = 10): QuizQuestion[] => {
  const shuffled = [...holmesQuizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};