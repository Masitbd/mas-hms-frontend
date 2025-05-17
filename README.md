# Project Name

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Table of Contents

- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Components](#key-components)
- [APIs and State Management](#apis-and-state-management)
- [Styling](#styling)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Learn More](#learn-more)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- **src/app**: Contains the main application pages and layout components.
  - **(withlayout)**: Includes various subdirectories for different features like `test-report-selector`, `deliver-report`, etc.
  - **unauthorized, signup, signin, reset-password**: Authentication-related pages.
- **src/components**: Reusable UI components.
  - **TestTable.tsx**: Component for displaying test data in a table format.
  - **CustomModal.tsx**: A customizable modal component.
- **src/enum**: Contains enumerations used throughout the application.
- **src/redux**: State management using Redux.
- **src/utils**: Utility functions and helpers.
- **src/types**: TypeScript type definitions.

## Key Components

- **TestTable**: Displays test data with filtering and action capabilities.
- **TestReportSelector**: Manages the selection and display of test reports based on various conditions.

## APIs and State Management

The application uses Redux for state management and includes slices for handling orders and report groups. API interactions are managed using Redux Toolkit's `createAsyncThunk` and `createSlice`.

## Styling

The project uses Tailwind CSS for styling, configured in `tailwind.config.ts`.

## Environment Variables

Environment variables are managed in `.env.local` and `.env` files. Ensure these are set up correctly for local development and production.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
