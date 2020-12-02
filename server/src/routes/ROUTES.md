### main Route

`/` - returns main page.

### user Route

`/user/register` - registers user

`/user/login` - logs the user in

`/user/auth` - authenticates the user

`/user/logout` - logs the user out

### char Route

`/char/new` - creates a new character

`/char/list` - returns a list of a characters

`/char/delete` - deletes a character

`/char/edit` - replaces the data on a character

### camp Route

`/camp/new` - creates a new campaign

`/camp/list` - returns a list of a campaigns

`/camp/remove` - removes connection between a campaign and character.

`/camp/add` - adds connection between a campaign and character.

`/camp/delete` - deletes a campaign

`/camp/edit` - replaces the data on a campaign

`/camp/get` - returns only one campaign row

### dice Route

`/dice/roll` - rolls a dice, and if enabled in the campaign, sends the result to discord.
