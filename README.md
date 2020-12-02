# Eshaton, a character application for Degenesis

## About

Eshaton is a web application that helps players save, upload, download, and view their [Degenesis](https://degenesis.com/) characters. All characters created can be exported as a `.degenesis` (internally `json`) file, or can be stored in the server-side database.

## Self-hosting

This package is created for Heroku, with React, Expressjs and PostgreSQL. Go through the classic `npm i` routine and such after installing PostgreSQL database and node.

## Scripts

### npm run build

Builds both Client and Server-side code. This is also used by Heroku.

### npm run start

This is used by Heroku to start the application.

### npm run dev

This is used during development. Note that you need to run both or individual build scripts for application to reflect your changes.

## Plans

-   Actually make use of hot reloading that comes with React, maybe use `concurrently` and such.
-   Custom tooltips instead of browser-style tooltips.
-   Recheck the server security.
    -   Especially with import/export functionality.
-   Add a way for campaign owners to view the players' character sheets.
-   Add a way for players to submit edited character sheets to the campaign owner approval.

## Links

[Degenesis: Rebirth](https://degenesis.com/)

[Degenesis: Rebirth Official Discord](https://discord.gg/degenesis)

## Known Issues

Please submit your issues to the [issues](https://github.com/yigitlevent/eshaton/issues) page.

-   None yet, but I'm sure the server will go down eventually.
