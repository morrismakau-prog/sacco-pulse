# SaccoPulse

**Live demo:** live application URL:https://sacco-pulse.vercel.app
               figma URL:https://www.figma.com/design/aJtk8Q0KognCHniVaRPPFP/SaccoPulse?node-id=0-1&t=9y2aYrL8mBZnIX3m-1
               
SaccoPulse is a digital platform bringing accountability to Kenya's public transport. It replaces unreliable physical paper notices with a permanent system where passengers can search for SACCOs and stages, read reviews, rate their experiences, and file incident reports. The app also features a dedicated dashboard for SACCO owners to view feedback and publicly reply to reviews.

## The problem

Passengers who want to complain about or recommend a matatu SACCO have no reliable place to do it. Paper notices at stages get torn down, ignored, or never read, and there is no lasting record of how a SACCO treats its passengers. SaccoPulse gives passengers a permanent public record and gives SACCOs a way to respond.

## Features

### For passengers
- **Search** for SACCOs and stages, powered by the Nominatim (OpenStreetMap) API
- **Rate and review** a SACCO
- **File incident reports** through the review and report form
- **Sign up and log in** with email/password or Google (Firebase Authentication)

### For SACCO owners
- **Register as a SACCO owner** (requires a verification code)
- **Dashboard** to view feedback and reports about their SACCO
- **Public replies** to passenger reviews

### Across the app
- **Two roles:** Passenger and SACCO Owner
- **Protected routes** that depend on login status and role

## Tech stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| State | React Context API |
| Backend services | Firebase Authentication, Cloud Firestore |
| Search | Nominatim (OpenStreetMap) API |
| Design | Figma wireframes |
| Testing | Vitest, React Testing Library |
| Linting | Oxlint |
| CI | GitHub Actions |
| Hosting | Vercel |

## Project structure

```
src/
├── components/   Navbar, ProtectedRoute
├── context/      AuthContext (login state and user role)
├── firebase/     Firebase setup
├── pages/        Home, Login, Report, Dashboard
├── App.jsx       Routes
└── main.jsx      App entry point
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm test` | Run the test suite |
| `npm run build` | Create a production build in `dist/` |

## Development process

Work is planned as issues on a Kanban board in GitHub Projects. Each issue moves through **In Review** (a pull request is open and awaiting merge) to **Done**.


## Testing and CI

Tests use Vitest and React Testing Library. Every push and pull request to `main` runs the tests through GitHub Actions on Node 22, and the badge at the top shows the latest result.

## Deployment

The app is hosted on Vercel and redeploys on every push to `main`. The six `VITE_FIREBASE_*` variables are set in Vercel under Settings → Environment Variables, and the Vercel domain is added to Firebase under Authentication → Settings → Authorized domains.
