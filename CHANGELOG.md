### 0.6.1.1

-   **CHANGE:** Removed the map toggle for now because I have to figure out how to store the tile files first.

### 0.6.1

-   **FEATURE:** Added the Degenesis Map.
-   **DEP:** Added `leaflet`, `react-leaflet`, and their respective type dependencies.

### 0.6.0

-   **CHANGE:** File structure for components now reflect the dependency tree.
-   **CHANGE:** Moved `DiceRoller` to Dashboard.
-   **CHANGE:** Added more text to the `DiceRoller` output.
-   **CHANGE:** Bundled `Block`s inside the `CharacterSheet` to make it more clear and robust.
-   **FIX:** Fixed some SCSS issues.

### 0.5.9.1

-   **FIX:** Package version updated.
-   **FIX:** Removed `.vscode` from git.

### 0.5.9

-   **FIX:** Added a check for `undefined` response errors list.
-   **FIX:** Fixed an issue with `/char/edit` route.
-   **FIX:** Some clean up.

### 0.5.8.2

-   **FIX:** A possible fix to Heroku deployment.

### 0.5.8.1

-   **FIX:** Package version updated.
-   **DOC:** Documentation fixes.

### 0.5.8

-   **FEATURE:** Now users can use hot-reloading both for server and client with only one command: `npm run dev`.
    -   Client requests are redirected to `localhost:4000` proxy.
-   **FIX:** Wrong CSS `align-items` value.
-   **FIX:** Removed or moved some variables.
-   **FIX:** Fixed an issue where the client threw errors if there were no request responses.
-   **FIX:** Added `key` props to the `Dashboard` rows.
-   **CHANGE:** Some changes to the structure of `./bin/www.ts` and `./app.ts` to compliment the new ´dev´ script.
-   **CHANGE:** Some small `.gitignore` changes.
-   **DEP:** Installed `node-sass` back because I'm a dummy.

### 0.5.7

-   **CHANGE:** Some symbols are changed for further clarity.
-   **DEP:** Client type definition dependencies are upgraded.
-   **DEP:** Uninstalled `node-sass`.
-   **DEP:** `@types/react-toastify` stub definition is uninstalled.

### 0.5.6.2

-   **DOC:** Missed a very important documentation change.

### 0.5.6.1

-   **DOC:** Updated, added table of contents.

### 0.5.6

-   **FIX:** A possible issue where the editing might be available to a character after it is removed from a campaign.
-   **CHANGE:** Limited the connection adding/removing feature to campaign editing mode.
-   **DOC:** Updated

### 0.5.5

-   **FIX:** Some SCSS attributes weren't working as intended.
-   **FIX:** Origin rows now aren't rollable.
-   **FIX:** Rollable row styles are now changed.
-   **FIX:** `DiceRoller` title is now corectly showing name of the clicked ability.
-   **CHANGE:** Removed view mode from character sheets that aren't added to a campaign.

### 0.5.4

-   **FIX:** Actually fixed the previous issue now.

### 0.5.3

-   **FIX:** Username mentions are now should be working correctly.

### 0.5.2

-   **FEATURE:** Dice rolls are now shown on client-side as a toast.
-   **FIX:** Fixed an issue with `DiceRoller` where it was creating the wrong message to send.
-   **FIX:** Fixed an issue with `discord.js` functions where channel wouldn't be found.
-   **CHANGE:** Moved bot functions to a seperate file.

### 0.5.1

-   **FIX:** Fixed possible small issue that may be caused by an invalid campaign name when trying to give the discord bot valid data.
-   **FIX:** Fixed an issue where client was trying to render a non-existent campaign data.
-   **FIX:** Added bunch of `console.log` to discord-related functions to figure out what is wrong with it.
