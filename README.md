# Pink Fluffy Unicorns

A monorepo containing both the frontend and backend for the Pink Fluffy Unicorns Boba POS System (TM)

To run the development server, first install the dependencies with `npm install` and then run `npm run dev` (this works for both the frontend and backend)

# Requirements

-   Install Prettier (vscode extension)
    -   Since html and javascript are a mess to write, don't spend time messing with the formatting, just have a program format it for you
    -   Change these settings
        -   Single Attribute Per Line: true
        -   Tab Width: 4
        -   Use Tabs: true

# Recommendations

-   Set `"typescript.tsserver.experimental.enableProjectDiagnostics": true,` in your `settings.json`
    -   This will make it so you will be notified of errors regardless of whether you have the file open or not
    -   It is buggy since it is experimental, so you'll likely have to `Restart TS Server` more often, but I believe the tradeoff is worth it

# Technology Stack

## Frontend

-   [React](https://react.dev/) with [Vite](https://vite.dev/)
    -   React is a javascript web framework for creating modular, component-driven web apps
    -   Vite is a tool to run and build projects
-   TypeScript
    -   A type-safe version of javascript
    -   General tip: if the type errors are going crazy, try `ctrl+p` and search `TypeScript: Restart TS Server`
-   [TanStack Router](https://tanstack.com/router/latest)
    -   A router to allow us to move between pages easily
    -   If you have errors, try running `npm run dev`, as this will build the file tree
    -   To remove the devtools in the bottom corner, comment out `<TanStackRouterDevtools />` in `src/routes/__root.tsx`
-   [TanStack Query](https://tanstack.com/query/latest/)
    -   Used for easy management of queries since we will be doing a lot of API stuff
-   [shadcn/ui](https://ui.shadcn.com/)
    -   A component library that comes with pretty, pre-configured components
    -   Read the docs to figure out how to use/install a specific component
        -   Use `--legacy-peer-deps` when installing
    -   To change the colors, edit the index.css (comment any changes you make so others know)

## Backend

-   [NodeJS](https://nodejs.org/en)
    -   The server we're going to be using to run the JavaScript API
-   TypeScript
-   [Postgres.js](https://github.com/porsager/postgres)
    -   Just a simple sql connector that has nice functionality
    -   If it doesn't meet our needs we should change it out
-   [Hono](https://hono.dev/)
    -   Has a lot of [middleware](https://hono.dev/docs/guides/middleware) built-in to ease the development process, such as input validation and authentication
    -   General quality of life compared to the older and more lean [Express](https://expressjs.com/)
