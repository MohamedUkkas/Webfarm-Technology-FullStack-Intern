# Webfarm Technology — Full-Stack Development Internship

A collection of full-stack web development work completed during my internship at Webfarm Technology, covering authentication, e-commerce workflows, frontend engineering, state management, role-based interfaces, and application architecture.

## Projects

### Webfarm Auth

A React and Firebase authentication application focused on implementing user authentication and protected application flows.

Key areas:

* User authentication
* Firebase integration
* Login and registration
* Authentication state management
* Protected application flows

See [Webfarm Auth README](webfarm-auth/README.md) for project-specific setup and configuration.

### FreshMart

A modern supermarket e-commerce and store operations platform designed around real-world grocery shopping and store management workflows.

FreshMart connects the customer shopping experience with internal supermarket operations including products, inventory, orders, staff, and administration.

## FreshMart Core Workflow

```text
Customer
   │
   ├── Browse Products
   ├── Search & Filter
   ├── Product Details
   ├── Wishlist
   ├── Cart
   └── Checkout
           │
           ▼
         Order
           │
           ▼
    Store Operations
           │
      ┌────┴────┐
      ▼         ▼
   Manager     Staff
      │         │
      └────┬────┘
           ▼
     Administration
```

## Key Features

### Customer Experience

* Product browsing
* Category navigation
* Product search
* Product filtering
* Product details
* Shopping cart
* Wishlist
* Checkout
* Address management
* Order history
* Order tracking
* Customer account

### Store Operations

* Product management
* Category management
* Inventory management
* Stock monitoring
* Order management
* Staff workflows
* Task management
* Delivery management

### Administration

* Administrative dashboard
* Manager management
* Staff management
* Product management
* Inventory monitoring
* Order monitoring
* Customer management
* Promotions
* Coupons
* Analytics
* Reports
* Settings

## Role Architecture

```text
                    ADMIN
                      │
               manages Managers
                      │
                      ▼
                   MANAGER
                      │
                manages Staff
                      │
                      ▼
                    STAFF


                  CUSTOMER
                      │
                  Storefront
```

### Admin

Responsible for high-level store and system management.

### Manager

Responsible for day-to-day store operations and staff coordination.

### Staff

Responsible for assigned operational tasks.

### Customer

Uses the customer-facing shopping experience.

Roles are intended to be determined by authenticated identity and backend authorization rather than browser-selected roles.

## Authentication

FreshMart uses Firebase Authentication as the identity layer.

Authentication architecture:

```text
User
  │
  ▼
Firebase Authentication
  │
  ▼
Authenticated Identity
  │
  ▼
FreshMart Backend
  │
  ▼
Role & Permission Validation
```

Authentication includes:

* Firebase Authentication
* Google OAuth
* Email/password authentication
* Email verification
* Password recovery

Authentication establishes user identity, while application authorization determines what the user can access.

## Application Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│ Storefront / Admin / Staff  │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Application Logic     │
│                             │
│ State / Services / Features │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Backend / APIs        │
│                             │
│ Auth / Products / Orders    │
│ Inventory / Operations     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│          Database           │
│                             │
│ Users / Products / Orders   │
│ Inventory / Operations      │
└─────────────────────────────┘
```

## Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS

### Authentication

* Firebase Authentication
* Google OAuth

### Backend

* Node.js
* Express
* TypeScript

### Database

* PostgreSQL
* Prisma

### Real-Time Communication

* Socket.IO

### Development

* npm
* TypeScript
* ESLint
* Git
* GitHub

## Frontend Architecture

```text
src/
├── components/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   ├── admin/
│   ├── staff/
│   ├── product/
│   ├── orders/
│   ├── home/
│   └── layout/
│
├── context/
│   └── StoreContext.tsx
│
├── data/
│   └── mockData.ts
│
├── services/
│   └── authService.ts
│
├── types/
│   └── index.ts
│
└── App.tsx
```

## Backend Architecture

```text
apps/api/
├── src/
│   ├── auth.ts
│   └── server.ts
│
└── prisma/
    └── schema.prisma
```

The backend is responsible for authentication middleware, business operations, API workflows, and server-side validation.

## Real-Time Architecture

FreshMart is designed to support real-time store operations.

```text
REST API
   │
   │ Performs operation
   ▼
Database
   │
   │ State changes
   ▼
Socket.IO
   │
   │ Broadcasts event
   ▼
Connected Clients
```

Example:

```text
Customer places order
        │
        ▼
Backend creates order
        │
        ▼
Database updated
        │
        ▼
Socket event emitted
        │
   ┌────┼─────┐
   ▼    ▼     ▼
Customer Manager Staff
```

## Real-Time Events

```text
order.created
order.updated

inventory.updated
inventory.low_stock

task.created
task.updated
task.completed

notification.created

product.updated

user.invited
```

## State Management

FreshMart currently uses centralized application state for core frontend workflows.

```text
StoreContext
     │
     ├── Products
     ├── Cart
     ├── Orders
     ├── Authentication
     ├── Staff
     └── Inventory
```

Existing demo flows use local storage for persistence.

As backend functionality is introduced, server-side systems become the source of truth for business-critical data including:

* Inventory
* Prices
* Orders
* Payments
* User roles
* Permissions

## Security Principles

FreshMart follows server-first security principles.

### Authentication

Firebase handles user authentication and identity.

### Authorization

Backend authorization determines access to protected operations.

### Server-Side Validation

Business-critical values must be validated on the server.

Examples include:

* Product price
* Stock quantity
* Order total
* Discounts
* Coupons
* User roles
* Permissions
* Payment status

### Environment Security

Local environment files and secrets must not be committed.

Use environment templates such as `.env.example` for required configuration.

## Development

### FreshMart

```bash
cd freshmart
npm install
npm run dev
```

### Production Build

```bash
npm run build
```

### Lint and Type Validation

```bash
npm run lint
```

## Environment Configuration

FreshMart's optional Firebase and maps configuration is documented in:

```text
freshmart/.env.example
```

Create a local environment file when required:

```text
freshmart/.env.local
```

Never commit local environment files, private credentials, API keys, or other secrets.

## Project Structure

```text
Webfarm-Technology-FullStack-Intern/
│
├── README.md
│
├── webfarm-auth/
│   ├── src/
│   ├── public/
│   └── README.md
│
└── freshmart/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── data/
    │   ├── services/
    │   └── types/
    │
    ├── apps/
    │   └── api/
    │       ├── src/
    │       └── prisma/
    │
    ├── public/
    ├── .env.example
    └── package.json
```

## Engineering Focus

This internship work covers practical experience in:

* React development
* TypeScript
* Component architecture
* Responsive UI development
* State management
* Authentication
* OAuth
* REST APIs
* Node.js
* Express
* PostgreSQL
* Prisma
* Role-based access control
* E-commerce workflows
* Inventory management
* Order management
* Real-time application architecture
* API integration
* Server-side validation
* Git and GitHub

## Design Philosophy

FreshMart is designed as a real supermarket application rather than a basic shopping-cart demonstration.

The interface focuses on:

* Clear information hierarchy
* Fast product discovery
* Simple shopping workflows
* Responsive layouts
* Accessible interactions
* Subtle motion
* Real-time operational feedback
* Consistent visual language

## Development Status

The project is being developed incrementally.

### Current Foundation

* React and TypeScript frontend
* Vite development environment
* Supermarket storefront
* Product browsing
* Cart and checkout flows
* Admin and staff workspaces
* Firebase authentication foundation
* Centralized application state
* Backend/API foundation
* Prisma database schema

### Evolving Features

* Backend-backed business workflows
* Firebase-backed identity
* Role-based authorization
* Manager invitation system
* Staff invitation system
* Inventory synchronization
* Order management
* Real-time Socket.IO events
* Notifications
* Production testing
* Deployment

## Learning Outcomes

This project was developed during my full-stack development internship to gain practical experience with:

* Modern React development
* TypeScript
* Full-stack application architecture
* Authentication systems
* REST APIs
* Relational databases
* ORM-based development
* Role-based application design
* E-commerce workflows
* Real-time systems
* State management
* UI/UX engineering
* Production-oriented development practices

## Author

Mohamed Ukkas

B.Tech — Artificial Intelligence & Data Science

GitHub: [https://github.com/MohamedUkkas](https://github.com/MohamedUkkas)

## Internship

Webfarm Technology — Full-Stack Development Internship

This repository contains the technical work and application development completed during the internship.
