# Eshaton, a character application for Degenesis

1.  [About](#about)
2.  [Features](#features)
3.  [Usage](#usage)
    1. [Characters](#characters)
    2. [Campaigns](#campaigns)
4.  [Links](#links)
5.  [Self-Hosting](#self-hosting)
    1. [Scripts](#scripts)
6.  [Development](#development)
    1.  [Plans](#plans)
    2.  [Known Issues](#known-issues)

## About

[Eshaton](https://eshaton.herokuapp.com/) is a web application that helps players save, upload, download, and view their [Degenesis](https://degenesis.com/) characters. All characters created can be exported as a `.degenesis` (internally `json`) file, or can be stored in the server-side database.

## Features

-   Players may login and save their character to a database, or import/export as they wish.
-   Gamemasters can create campaigns, and add characters.
-   Roll dice on the website or send the roll results to a discord server.

## Usage

### Characters

-   **Character Sheet:** Players may create, edit, and delete characters. A character name must be provided for it to be saved to the database. Character names cannot be changed after the character is saved to the database.

-   **Exporting/Importing:** Players may download their character data by clicking the `Export Character` button, and they may upload it back via the `Import Character` button.

-   **In-Campaign Characters:** If a character is added to a Campaign, editing feature will be disabled but viewing feature will replace it. You may roll dice via the viewing feature. If the campaign that the character is added has discord features enabled and configured, dice roll will be sent to the channel that is provided.

### Campaigns

-   **Campaign Sheet:** Gamemasters may create, edit and delete campaigns. A campaign name is required to save it to the database. Campaign names cannot be changed after it is saved to the database.

-   **Character-Campaign Connection:** Gamemasters may add and remove characters from their campaigns. Navigate to the campaign editing mode to enable these functionality. You may add or remove a character by providing their secret keys, which are accessed via the key icons on the left.

-   **Discord Integration:** Discord functionality may also be enabled to send the dice rolls of the campaign-added characters to a discord server. This requires both the bot to be added to the server and gamemaster to enable and enter required info on their campaign sheet.

    1. **Adding the Bot:** Add the bot to your server with [this link](https://discord.com/oauth2/authorize?client_id=781077765901385729&scope=bot).

    2. **Authorize Server:** First, you have to check the box named `Discord Bot Integration Enabled` to authorize the server to send messages then you have to fill the input boxes below it.

    3. **Add Server ID:** Enter your Server ID (which can be found under `Server Settings > Widget > Server ID`, example: `1234567890`) into `Discord Server ID` box.

    4. **Add Channel Name:** Enter name of the channel that you want the bot to send the messages (without the hashtag, example: `dice-rolls`) into `Discord Server ID` box.

## Links

[Degenesis: Rebirth](https://degenesis.com/)

[Degenesis: Rebirth Official Discord](https://discord.gg/degenesis)

## Self-hosting

This package is created for Heroku, with React, Expressjs and PostgreSQL. Go through the classic `npm i` routine and such after installing PostgreSQL database and node.

### Scripts

#### npm run build

Builds both Client and Server-side code. This is also used by Heroku.

#### npm run start

This is used by Heroku to start the application.

#### npm run dev

This is used during development. Note that you need to run both or individual build scripts for application to reflect your changes.

## Development
### Plans

-   Make use of hot reloading that comes with React, maybe use `concurrently` and such.
-   Custom tooltips instead of browser-style tooltips.
-   Recheck the server security.
    -   Especially with import/export functionality.
-   Add a way for campaign owners to view the players' character sheets.
-   Add a way for players to submit edited character sheets to the campaign owner approval.
-   Character portraits should be visible on client-side if players provide a direct link.
-   Add Cult/Culture/Concept and other details on client-side for hover-over info.

### Known Issues

Please submit your issues to the [issues](https://github.com/yigitlevent/eshaton/issues) page.

-   None yet, but I'm sure the server will go down eventually.
