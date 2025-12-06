# Holmes AI

An interactive mystery-solving web app built with React, TypeScript, and Vite. Holmes AI features quiz-driven gameplay, deduction animations, sound effects, and an optional OpenAI-powered assistant.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0.8-purple)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.2-purple)

## Highlights

- **Mystery Quizzes**: Timed questions, results, and statistics (`src/components/quiz/*`).
- **Deduction Mode**: Animated deductions and visual effects.
- **Sound & Music**: Centralized audio management with toggles.
- **Case File Drawer**: Slide-out drawer for storyline and hints.
- **Optional AI Chat**: `ChatGpt.tsx` integrates OpenAI (development only).

## Prerequisites

- Node.js v18+ (LTS recommended)
- Yarn (via Corepack or npm)
- Optional: OpenAI API key for the chat component

## Quick Start

```powershell
# Clone and install
git clone https://github.com/danielaldemir79/Holmes-AI.git
cd Holmes-AI
yarn install

# Development
yarn dev

# Build and preview
yarn build
yarn preview
```

App starts at `http://localhost:5173`.

## Environment Variables

Create `.env` in the project root if using the AI chat:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

Note: This project’s OpenAI integration is browser-side and intended for local development only. Do not expose real keys in production.

## Scripts

- `yarn dev`: Start dev server
- `yarn build`: Production build to `dist/`
- `yarn preview`: Preview built app
- `yarn lint`: Run ESLint

## Project Structure

```
Holmes-AI/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── CaseFileDrawer.tsx
│   │   ├── ChatGpt.tsx
│   │   ├── DeductionAnimation.tsx
│   │   ├── DeductionMode.tsx
│   │   ├── DeductionToggle.tsx
│   │   ├── MusicToggle.tsx
│   │   ├── QuizDisplay.tsx
│   │   ├── QuizProvider.tsx
│   │   ├── ResponseMessage.tsx
│   │   ├── SideMenu.tsx
│   │   └── quiz/
│   │       ├── QuizLogic.tsx
│   │       ├── QuizQuestion.tsx
│   │       ├── QuizResults.tsx
│   │       └── QuizTimer.tsx
│   ├── contexts/
│   │   └── SoundContext.tsx
│   ├── data/
│   │   └── quizQuestions.ts
│   ├── hooks/
│   │   ├── useAudioManager.ts
│   │   ├── useDeduction.ts
│   │   └── useSoundEffects.ts
│   ├── models/
│   │   ├── QuizState.ts
│   │   └── ResponseMessageProps.ts
│   ├── styles/
│   │   ├── _bootswatch.scss
│   │   ├── _variables.scss
│   │   ├── caseFile.scss
│   │   └── deduction.scss
│   └── utils/
│       ├── ChatSerializer.ts
│       ├── mysteryNameGenerator.ts
│       ├── quizStatistics.ts
│       ├── soundEffects.ts
│       └── visualEffects.ts
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Configuration Notes

- **Bootstrap JS**: If you use Bootstrap’s interactive components, install Popper:
  ```powershell
  yarn add @popperjs/core
  ```
- **OpenAI Chat**: In `src/components/ChatGpt.tsx`, the browser-side call uses `dangerouslyAllowBrowser`. For production, proxy calls through a backend server.

## Security

- Do not commit `.env` files with secrets.
- Avoid using real OpenAI keys in the browser.
- Consider server-side API proxy for production deployments.

## License

Private and proprietary.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI powered by [Bootstrap](https://getbootstrap.com/)
- Optional AI via [OpenAI](https://openai.com/)
