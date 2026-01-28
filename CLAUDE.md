# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Paynetworx 3DS SDK (`@paynetworx/3ds-sdk`) - a browser-based TypeScript library for integrating 3D Secure (3DS) authentication into payment processing applications.

## Commands

```bash
npm run build    # Build with tsup (outputs CJS, ESM, and type declarations to dist/)
```

## Architecture

The SDK is a single-file library (`src/index.ts`) that orchestrates the 3DS authentication flow in the browser. It exports:

- **`processPayment<T>`**: Main entry point that orchestrates the complete 3DS flow (browser data collection -> 3DS method -> challenge if required)
- **`GatherBrowserData`**: Collects browser fingerprint data required for 3DS authentication
- **`Submit3dsMethod`**: Creates hidden iframe and form to submit 3DS method data to the ACS
- **`SubmitChallenge`**: Creates iframe and form to initiate the challenge flow with the ACS
- **`base64url`**: URL-safe base64 encoding utility
- **Challenge window size constants**: `CHALLENGE_WINDOW_SIZE_*` for specifying challenge iframe dimensions

The SDK uses callback-based integration where the consuming application provides callbacks for backend communication (`sendPaymentToBackend`, `Get3dsMethodResponse`, `GetChallengeResponse`) and UI lifecycle hooks (`StartChallengeCallback`, `FinishChallengeCallback`).

## Build Configuration

- Uses `tsup` for bundling
- Outputs CommonJS (`dist/index.js`), ESM (`dist/index.mjs`), and TypeScript declarations (`dist/index.d.ts`)
- Source maps enabled
- Target: ES2015 with DOM and ESNext lib support
