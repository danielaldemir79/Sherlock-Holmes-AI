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
    question: "Vad heter Sherlock Holmes bror?",
    options: ["Mycroft", "Sherrinford", "Sigerson"],
    correctAnswer: 0,
    explanation: "Mycroft Holmes är Sherlocks äldre och ännu smartare bror."
  },
  {
    id: 15,
    question: "Vilken drog använde Holmes ibland när han var uttråkad?",
    options: ["Opium", "Kokain", "Morfin"],
    correctAnswer: 1,
    explanation: "Holmes använde en 7-procentig kokainlösning när han saknade intellektuell stimulans."
  },
  {
    id: 16,
    question: "Vad heter hunden i 'Baskervilles hund'?",
    options: ["Toby", "Hugo", "Det nämns inte"],
    correctAnswer: 2,
    explanation: "Hunden själv har inget namn i boken, den kallas bara för 'Hunden från Baskerville'."
  },
  {
    id: 17,
    question: "Vilket år publicerades den sista Holmes-novellen?",
    options: ["1914", "1927", "1930"],
    correctAnswer: 1,
    explanation: "Den sista samlingen 'The Case-Book of Sherlock Holmes' publicerades 1927."
  },
  {
    id: 18,
    question: "Vad heter polisinspektören som ofta ber Holmes om hjälp?",
    options: ["Gregson", "Lestrade", "Hopkins"],
    correctAnswer: 1,
    explanation: "G. Lestrade är den inspektör från Scotland Yard som oftast samarbetar med Holmes."
  },
  {
    id: 19,
    question: "Vad var Dr. Watsons yrke innan han träffade Holmes?",
    options: ["Advokat", "Militärläkare", "Journalist"],
    correctAnswer: 1,
    explanation: "Watson tjänstgjorde som militärläkare i Afghanistan innan han återvände till London."
  },
  {
    id: 20,
    question: "Vilken novell anses ofta vara den mest populära?",
    options: ["Det spräckliga bandet", "De fem apelsinkärnorna", "Den rödhåriga ligan"],
    correctAnswer: 0,
    explanation: "'The Speckled Band' (Det spräckliga bandet) röstas ofta fram som den bästa novellen."
  },
  {
    id: 21,
    question: "Vad heter klubben där Mycroft Holmes tillbringar sina dagar?",
    options: ["The Reform Club", "The Diogenes Club", "The Athenaeum"],
    correctAnswer: 1,
    explanation: "Diogenes Club är en klubb för de mest osociala männen i London."
  },
  {
    id: 22,
    question: "Hur många romaner (långa berättelser) skrevs om Holmes?",
    options: ["2", "4", "6"],
    correctAnswer: 1,
    explanation: "Det finns 4 romaner: A Study in Scarlet, The Sign of Four, The Hound of the Baskervilles och The Valley of Fear."
  },
  {
    id: 23,
    question: "Vad heter Holmes biodlarbok?",
    options: ["Practical Handbook of Bee Culture", "The Life of the Bee", "Bees of Sussex"],
    correctAnswer: 0,
    explanation: "Efter sin pensionering skrev Holmes 'Practical Handbook of Bee Culture, with Some Observations upon the Segregation of the Queen'."
  },
  {
    id: 24,
    question: "Vilket vapen bär Watson ofta med sig?",
    options: ["En revolver", "En batong", "En kniv"],
    correctAnswer: 0,
    explanation: "Watson bär ofta sin gamla tjänsterevolver när de ger sig ut på farliga uppdrag."
  },
  {
    id: 25,
    question: "Vad heter den fiktiva kampsport Holmes utövar?",
    options: ["Jujutsu", "Baritsu", "Boxning"],
    correctAnswer: 1,
    explanation: "Baritsu är den japanska brottningsteknik Holmes använde för att besegra Moriarty."
  },
  {
    id: 26,
    question: "I vilken stad utspelar sig 'A Study in Scarlet' delvis?",
    options: ["Salt Lake City", "New York", "San Francisco"],
    correctAnswer: 0,
    explanation: "Andra halvan av boken utspelar sig i Salt Lake City och handlar om mormoner."
  },
  {
    id: 27,
    question: "Vad heter Watsons första fru?",
    options: ["Mary Morstan", "Violet Hunter", "Helen Stoner"],
    correctAnswer: 0,
    explanation: "Mary Morstan introducerades i 'The Sign of Four' och blev senare Watsons fru."
  },
  {
    id: 28,
    question: "Vilket kodnamn använde Holmes under sitt uppehåll (The Great Hiatus)?",
    options: ["Sigerson", "Altamont", "Vernet"],
    correctAnswer: 0,
    explanation: "Han reste under namnet Sigerson, en norsk upptäcktsresande."
  },
  {
    id: 29,
    question: "Vad heter Holmes mormor enligt honom själv?",
    options: ["Vernet", "Adler", "Hudson"],
    correctAnswer: 0,
    explanation: "Holmes nämner att hans mormor var syster till den franske konstnären Vernet."
  },
  {
    id: 30,
    question: "Vilket föremål glömde Dr. Mortimer kvar hos Holmes i början av 'Baskervilles hund'?",
    options: ["En käpp", "En hatt", "En pipa"],
    correctAnswer: 0,
    explanation: "Han glömde sin promenadkäpp, vilket ledde till en klassisk deduktionsövning."
  },
  {
    id: 31,
    question: "Vilket ämne studerade Dr. Watson innan han blev läkare?",
    options: ["Medicin", "Juridik", "Militärtjänst"],
    correctAnswer: 0,
    explanation: "Watson studerade medicin vid University of London innan han gick in i armén."
  },
  {
    id: 32,
    question: "Vad är Holmes bror Mycroft känd för?",
    options: ["Att vara detektiv", "Att arbeta för regeringen", "Att vara musiker"],
    correctAnswer: 1,
    explanation: "Mycroft Holmes arbetar för brittiska regeringen och är ännu smartare än Sherlock."
  },
  {
    id: 33,
    question: "I vilken novell 'dör' Sherlock Holmes tillsammans med Moriarty?",
    options: ["Det sista problemet", "Det tomma huset", "Dödens dal"],
    correctAnswer: 0,
    explanation: "I 'The Final Problem' faller båda ner i Reichenbachfallen, men Holmes överlever."
  },
  {
    id: 34,
    question: "Vad var det 'spräckliga bandet' egentligen?",
    options: ["En scarf", "En orm", "Ett rep"],
    correctAnswer: 1,
    explanation: "Det var en giftig sumporm som användes som mordvapen."
  },
  {
    id: 35,
    question: "Vad förvarar Holmes i en persisk toffel på spiselkransen?",
    options: ["Pengar", "Pistol", "Tobak"],
    correctAnswer: 2,
    explanation: "Holmes har den excentriska vanan att förvara sin tobak i en gammal toffel."
  },
  {
    id: 36,
    question: "Var tillbringar Holmes sin pensionering?",
    options: ["London", "Sussex", "Skottland"],
    correctAnswer: 1,
    explanation: "Han drar sig tillbaka till en gård i Sussex Downs för att odla bin."
  },
  {
    id: 37,
    question: "Vad heter den klient som har rött hår i 'De rödhårigas förening'?",
    options: ["Jabez Wilson", "John Clay", "Vincent Spaulding"],
    correctAnswer: 0,
    explanation: "Jabez Wilson luras bort från sin pantbank med ett påhittat jobb för rödhåriga."
  },
  {
    id: 38,
    question: "Vilket föremål använder Holmes för att lura skytten i 'Det tomma huset'?",
    options: ["En skyltdocka", "En vaxbyst", "En kudde"],
    correctAnswer: 1,
    explanation: "Han placerar en vaxbyst av sig själv i fönstret för att locka fram överste Moran."
  },
  {
    id: 39,
    question: "Vad heter båten som de jagar på Themsen i 'De fyras tecken'?",
    options: ["Aurora", "Victoria", "Matilda"],
    correctAnswer: 0,
    explanation: "Skurkarna försöker fly i ångslupen Aurora."
  },
  {
    id: 40,
    question: "Vilken organisation skickar apelsinkärnor i 'De fem apelsinkärnorna'?",
    options: ["Maffian", "Ku Klux Klan", "Scowrers"],
    correctAnswer: 1,
    explanation: "Kärnorna är en varning från KKK."
  },
  {
    id: 41,
    question: "Vad heter Professor Moriarty i förnamn?",
    options: ["James", "John", "William"],
    correctAnswer: 0,
    explanation: "Hans fullständiga namn är Professor James Moriarty."
  },
  {
    id: 42,
    question: "Vilken typ av kod knäcker Holmes i 'De dansande gubbarna'?",
    options: ["Morse-kod", "Substitutionschiffer", "Osynligt bläck"],
    correctAnswer: 1,
    explanation: "De dansande figurerna är ett enkelt substitutionschiffer där varje gubbe är en bokstav."
  },
  {
    id: 43,
    question: "Vad heter det hemliga sällskapet i 'Fruktans dal'?",
    options: ["The Scowrers", "The Red Circle", "The Four"],
    correctAnswer: 0,
    explanation: "Scowrers är ett våldsamt sällskap som terroriserar en dal i USA."
  },
  {
    id: 44,
    question: "Vad fäster Holmes vid spiselkransen med en fällkniv?",
    options: ["En bild på Irene Adler", "Obetalda räkningar", "Oöppnade brev"],
    correctAnswer: 2,
    explanation: "Han spetsar sin oöppnade korrespondens på spiselkransen."
  },
  {
    id: 45,
    question: "Vilken sjukdom simulerar Holmes i 'Den döende detektiven'?",
    options: ["Malaria", "Tsumpa-feber", "Pest"],
    correctAnswer: 1,
    explanation: "Han låtsas ha drabbats av en exotisk asiatisk sjukdom för att lura en mördare att erkänna."
  }
];

// Function to get random questions
export const getRandomQuestions = (count: number = 10): QuizQuestion[] => {
  const shuffled = [...holmesQuizQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};