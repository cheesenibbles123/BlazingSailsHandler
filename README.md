# Blazing Sails Handler

## Description

Welcome to the git repo of the Blazing Sails Handler. This package simply servers the purpose for acting as a simple wrapper around the steamAPI for Blazing Sails.

## Installation

```bash
npm install @cheesenibbles123/blackwakehandler
```

## Usage

To use the package the following template is required:

```js
const blazingSailsHandler = require("@cheesenibbles123/BlazingSailsHandler");

blazingSailsHandler.init("Your Steam API key here");

const data = await blazingSailsHandler.query(Type_ID, 'steamID64');
```

### Example usage in nodejs using a discord bot

- discord.js v12

```js
const Discord = rqeuire("discord.js");
const client = new Discord.Client();

const bsHandler = require("@cheesenibbles123/BlazingSailsHandler");
const config = require("./config.json");

client.on('ready', () => {
	bsHandler.init(config.steamAPIKey);
});

client.on('message', async message => {

	// Split into arguments and command
	let data = message.split(' ');
	const command = data[0].toLowerCase();
	data.shift();

	/* Example output:
		command => "blazingsails"
		data => [ "0" , "User's steamID64" ]
	*/

	if (command === "blazingsails"){
		const playerData = await bsHandler.query(
			parseInt(data[0]), // Convert type to int
			data[1], // Valid steamID
		);

		// Format and display code goes here //
	}
});
```

## Types

(Currently the only data that can be queried is steam achievements)

**Format is Type_ID : Response Data**

```md
- 0 : Achievements
```

## Responses

The return data is formatted to hose a single structure that tells you if it **suceeded or failed**. The data relating to the success/failure is then available within the **content** field.

Examples:

```js
// Success
{
	isValid : true,
	type : type,
	content : {
		// Resulting content
	}
}

// Fail
{
	isValid : false,
	type : type,
	content : "Error Message"
}
```

### Achievements

Example valid response where the user has unlocked 3 achievements.

```js
{
	isValid : true,
	type : 0,
	content : {
		count : 3,
		listRaw : [
			"ACH_FIRST_STARTUP",
			"ACH_DISCOVER_TRIDENTCLUSTER",
			"ACH_DISCOVER_TROPICALCLUSTER"
		],
		listFormatted : [
			"Landlubber No More",
			"Wrath Of Poseidon",
			"Tropical Refuge"
		]
	}
}
```
