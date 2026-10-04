# Webfarm Technology FullStack Intern

This repository contains two frontend projects:

- **Webfarm Auth** (`webfarm-auth/`): the original React and Firebase authentication project.
- **FreshMart** (`freshmart/`): a grocery storefront with product browsing, cart and checkout flows, staff and admin workspaces, and a persistent light/dark theme toggle.

## FreshMart

```bash
cd freshmart
npm install
npm run dev
```

Use `npm run build` to create a production build and `npm run lint` to run TypeScript checks. FreshMart's optional Firebase and maps settings are described in `freshmart/.env.example`; provide local values in `freshmart/.env.local` as needed. Never commit local environment files or secrets.

## Webfarm Auth

See [`webfarm-auth/README.md`](webfarm-auth/README.md) for setup and configuration instructions for the original authentication project.

## Author

Mohamed Ukkas
