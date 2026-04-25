# Sentry Setup Guide

A short, on-point guide to implementing Sentry for error tracking and feedback in the Stamp Valuation App (Next.js).

## 1. Create Sentry Account & Project
- Go to [sentry.io](https://sentry.io/) and create an account.
- Create a new project and select **Next.js** as your platform.

## 2. Run the Sentry Wizard (Recommended)
The easiest way to integrate Sentry with a Next.js application is by using their interactive wizard. It will automatically install the SDK, configure your Next.js files, and set up source maps.

Run the following command in your terminal:

```bash
npx @sentry/wizard@latest -i nextjs
```

During the wizard setup:
- It will open a browser to authenticate your Sentry account.
- You will select the project you just created.
- The wizard will automatically create or update files like `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, and `next.config.mjs` (or `.js`).

## 3. Verify the Configuration
After the wizard completes, review the generated files. Sentry will add a `SENTRY_AUTH_TOKEN` to your `.env.local` file for source map uploading. **Make sure `.env.local` is in your `.gitignore`**.

