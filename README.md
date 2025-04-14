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

# Minutes

## 3/24

-   Owen

Completed:
N/A

To Do:
Manager Tables Sidebar

Roadblocks:
N/A

-   Shri

Completed:
N/A

To Do:
Learn everything,
Parse data from database,
Get info from database

Roadblocks:
N/A

-   Evan

Completed:
N/A

To Do:
Learn everything,
Login Page

Roadblocks:
N/A

-   May

Completed:
N/A

To Do:
Learn everything,
Trends page SQL queries for other reports

Roadblocks:
N/A

-   Lilly

Completed:
N/A

To Do:
Learn everything,
Backend payment

Roadblocks:
N/A

## 3/26

-   Owen Shadburne

Completed:
Completed side bar,
Completed display for tables for manager editing

To Do:
Work on api backend for manager editing

Roadblocks:
Learning backend

-   Shri Gaddad

Completed:
Briefly looked at back end,
Looked at SQL stuff

To Do:
Start Kiosk Page

Roadblocks:
N/A

-   Evan Kostov

Completed:
Made a page for the login

To Do:
Get google authentication for email

Roadblocks:
Learning React

-   May He

Completed:
Write sql queries for top selling items and something else

To Do:
Try and work on frontend

Roadblocks:
Frontend see how it works and how to interact to backend

-   Lilly Mitchell

Completed:
Looked at all the code already present in git and tried to understand it

To Do:
Payment screen

Roadblocks:
Understanding how things work together

## 3/28

-   Owen

Done:
Finished all manager edit stuff

Work on:
Assign tasks for next sprint

Roadblock:
Waiting to see what is completed

-   Shri

Done:
Played around with a few components

Work on:
Put initial draft on how the kiosk will look

Roadblock:
Learning still

-   Evan

Done:
N/A

Work on:
Google api thing for authentication

Roadblock:
Not having used an api key with node or js

-   May

Done:
Learned to work on frontend and how it interacts with backend

Work on:
Learning the react

Roadblock:
Learning

-   Lilly

Done:
Made ordering page for frontend

Work on:
Ordering page and make it prettier

Roadblock:
Understanding how things work together

## 4/7

-   Shri

Done:
80% of Kiosk (minus checkout protion)

Doing:
Finalize checkout

Roadblocks:
Specific details with React / TypeScript

-   Evan

Done:
Automatic env for local and website

Doing:
Finalize login screen

Roadblocks:
Issues with Render

-   Owen

Done:
Nothing

Doing:
X - Report,
Z - Report

Roadblocks:
Manipulating Postgres

-   May

Done:
Nothing

Doing:
Sales over Time report

Roadblocks:
No foreeable roadblocks

-   Lilly

Done:
Nothing

Doing:
Payment screen

Roadblocks:
Figuring out accessibility

## 4/9

-   Lilly

Done:
Payment Screen for Employees

TODO:
Update ingredients,
Improve payment screen,
look into accessibility

Block:
Miscellaneous error

-   Shri

Done:
Improve Kiosk with checkout

TODO:
Fixed issues with Kiosk

Block:
None

-   Evan

Done:
Correct Redirect with authentication

TODO:
Google Translate

Block:
Poor and cannot afford google translate

-   May

Done:
Backend for profit over time

TODO:
UI for profit over time

Blocks:
None

-   Owen

Done:
X Report,
Z Report

TODO:
Static Menu

Blocks:
None

## 4/11

- Owen

Done:
Started static menu

TODO:
Allergens and finish static menu

Block: 
React x2 and env

- Lilly

Done:
Fixed payment,
Backend for payment,
Updated ingredients

TODO:
Accessability contrast

Blocks:
Issues with env

- May

Done:
Profit over time

TODO:
Weather API

Blocks:
Limiting the time frame of the report

- Evan

Done:
Google Translate API

TODO:
Finish translations

Blocks:
Issues with tree walking

- Shri

Done:
Working on kiosk

TODO:
Integrate order with kiosk

Block:
React running twice