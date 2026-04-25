# Sentry Setup Guide

A short, on-point guide to implementing Sentry for error tracking and feedback in the Stamp Valuation App.

## 1. Create Sentry Account & Project
- Go to [sentry.io](https://sentry.io/) and create an account.
- Create a new project and select the framework that matches this app (e.g., React or Next.js).
- Copy the **DSN (Data Source Name)** provided.

## 2. Install Sentry SDK
Run the following command to install Sentry. If you are using Vite/React, the standard package is `@sentry/react`:

```bash
npm install @sentry/react
```

## 3. Initialize Sentry
In the main entry file of your application (e.g., `main.tsx`, `index.tsx`, or `App.tsx`), initialize Sentry early in the execution:

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Load DSN from env variables
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of transactions. Lower in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // 10% of sessions
  replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
});
```

## 4. Environment Configuration
Add the DSN to your environment variables file (e.g., `.env` or `.env.local`):

```env
VITE_SENTRY_DSN="your-sentry-dsn-url-goes-here"
```

## 5. Verify Setup
Add a temporary button to intentionally throw an error and verify it appears in your Sentry dashboard:

```javascript
<button onClick={() => { throw new Error("Sentry Test Error!"); }}>
  Test Sentry
</button>
```

Once confirmed, you're ready to use Sentry for production error tracking!
