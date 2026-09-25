# Webfarm Authentication Application

This directory contains the React/Vite authentication application created during the Webfarm Technology full-stack internship.

## Prerequisites

- Node.js and npm
- A Firebase project with the required authentication providers enabled

## Install and run

```bash
npm install
npm run dev
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Configuration and security

Configure the Firebase client used by the application before testing authentication. Do not commit private service-account credentials, access tokens, or secrets. Firebase authentication configuration does not replace authorization rules for application data.

## Current scope

This is a client-side authentication interface. It does not include a custom backend, application database, automated end-to-end tests, or a production authorization service.
