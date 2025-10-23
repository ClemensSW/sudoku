# Sudoku Duo - Cloud Functions

Cloud Functions for Sudoku Duo Online Multiplayer features.

## Requirements

- **Node.js 20** (required for Firebase Functions v2)
- Firebase CLI 14.x or later

## Setup

### 1. Install Node 20

Using nvm (recommended):
```bash
nvm install 20
nvm use 20
```

Or download directly from [nodejs.org](https://nodejs.org/)

### 2. Install Dependencies

```bash
npm install
```

### 3. Build TypeScript

```bash
npm run build
```

## Development

### Run Emulator

From the project root (not the functions directory):
```bash
firebase emulators:start
```

Or to run only functions emulator:
```bash
npm run serve
```

### Watch Mode

Auto-rebuild on file changes:
```bash
npm run build:watch
```

## Deployment

Deploy all functions:
```bash
npm run deploy
```

Or from project root:
```bash
firebase deploy --only functions
```

## Available Functions

### HTTP Callable Functions (v2)

- **healthCheck** - Test function to verify Functions are running
- **matchmaking** - Find opponents and create matches (ranked/AI)
- **createPrivateMatch** - Create private match with invite code
- **joinPrivateMatch** - Join private match via invite code
- **updateElo** - Update player ELO ratings after match

### Scheduled Functions

- **cleanupMatches** - Cleanup expired matches and matchmaking entries (runs hourly)

## Troubleshooting

### Node Version Mismatch Error

If you see:
```
functions: Your requested "node" version "20" doesn't match your global version
```

**Solution:** Switch to Node 20:
```bash
nvm use 20
```

Or install Node 20 if not available:
```bash
nvm install 20
```

### Functions Fail to Load in Emulator

**Symptoms:**
- "Failed to load function definition from source"
- "Timeout after 10000"

**Cause:** Node version mismatch (using Node 24 instead of Node 20)

**Solution:** Use Node 20 as specified above

## Project Structure

```
functions/
├── src/                    # TypeScript source files
│   ├── index.ts           # Main entry point
│   ├── matchmaking.ts     # Matchmaking logic
│   ├── updateElo.ts       # ELO rating updates
│   ├── createPrivateMatch.ts
│   ├── joinPrivateMatch.ts
│   ├── cleanupMatches.ts  # Scheduled cleanup
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Shared utilities
├── lib/                   # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── .nvmrc                # Node version specification
```

## Notes

- All functions use the **europe-west3** region in production (GDPR compliance)
- Emulator ignores region settings and uses default us-central1
- Functions v2 syntax is used throughout
- TypeScript strict mode is enabled
