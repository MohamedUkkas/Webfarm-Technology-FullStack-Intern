# Webfarm Technology FullStack Intern

A React authentication interface created during the Webfarm Technology full-stack internship. The application is built with Vite and provides a sign-in route backed by Firebase Authentication providers.

## Features

- React single-page application
- Client-side routing with `react-router-dom`
- Sign-in page at `/`
- Google sign-in with Firebase Authentication
- Facebook sign-in with Firebase Authentication
- Tailwind CSS configuration and project styling

## Tech stack

- React 19
- Vite 6
- Firebase 11
- React Router DOM 7
- React Icons
- Tailwind CSS

## Project structure

```text
.
└── webfarm-auth/
    ├── package.json       # Scripts and dependencies
    ├── src/
    │   ├── App.jsx        # Router and application routes
    │   ├── main.jsx       # React entry point
    │   ├── auth.js        # Google and Facebook Firebase sign-in helpers
    │   ├── firebase/      # Firebase configuration
    │   ├── pages/         # Route-level screens, including SignIn
    │   ├── components/    # Reusable UI components
    │   ├── styles/        # Shared styles
    │   └── assets/        # Static assets
    └── README.md          # Vite template notes
```

## Run locally

```bash
git clone https://github.com/MohamedUkkas/Webfarm-Technology-FullStack-Intern.git
cd Webfarm-Technology-FullStack-Intern/webfarm-auth
npm install
npm run dev
```

Open the local URL printed by Vite. Other available commands are:

```bash
npm run build
npm run preview
npm run lint
```

## Firebase configuration

Before testing authentication, configure the Firebase application used by `src/firebase/` and enable Google and Facebook providers in the Firebase console. Do not commit private credentials or secrets; use the configuration approach expected by the project.

## Author

Mohamed Ukkas
