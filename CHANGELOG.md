### 0.5.6.1

-   DOC: Updated, added table of contents.

### 0.5.6

-   FIX: A possible issue where the editing might be available to a character after it is removed from a campaign.
-   CHANGE: Limited the connection adding/removing feature to campaign editing mode.
-   DOC: Updated 

### 0.5.5

-   FIX: Some SCSS attributes weren't working as intended.
-   FIX: Origin rows now aren't rollable.
-   FIX: Rollable row styles are now changed.
-   FIX: Dice Roller title is now corectly showing name of the clicked ability.
-   CHANGE: Removed view mode from character sheets that aren't added to a campaign.

### 0.5.4

-   FIX: Actually fixed the previous issue now.

### 0.5.3

-   FIX: Username mentions are now should be working correctly.

### 0.5.2

-   FEATURE: Dice rolls are now shown on client-side as a toast.
-   FIX: Fixed an issue with DiceRoller where it was creating the wrong message to send.
-   FIX: Fixed an issue with discord.js functions where channel wouldn't be found.
-   CHANGE: Moved bot functions to a seperate file.

### 0.5.1

-   FIX: Fixed possible small issue that may be caused by an invalid campaign name when trying to give the discord bot valid data.
-   FIX: Fixed an issue where client was trying to render a non-existent campaign data.
-   FIX: Added bunch of console.log to discord-related functions to figure out what is wrong with it.