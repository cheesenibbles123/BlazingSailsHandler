const fetch = require('node-fetch');
const { generateResponse } = require("./generateResponse.js");
const types = require("./structs/types.js");
const dataSorter = require("./sortDataForType.js");

let apiKey;
module.exports = {
	init : (newApiKey) => {
		apiKey = newApiKey;
	},
	query: (type,steamID) =>{
		return new Promise((resolve,reject) => {
			if (checkIfPublic(steamID)){
				getStats(steamID).then(playerStats => {

					getDataForType(playerStats,type).then(response => {

						resolve(generateResponse(true,type,response));
					}).catch(error => {
						resolve(generateResponse(false,type,error));
					});

				}).catch(error => {
					resolve(generateResponse(false,type,error));
				});

			}else{
				resolve(generateResponse(false,type,"Private profile."));
			}
		});
	}
}

function checkIfPublic(steamID){
	return new Promise ((resolve,reject) => {
		fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamID}`).then(resp => resp.json()).then(response => {
			if (response.response.players.communityvisibilitystate === 1){
				resolve(false);
			}else{
				resolve(true);
			}
		});
	});
}

function getStats(steamID){
	return new Promise((resolve,reject) => {
		fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2?key=${apiKey}&appid=1158940&steamid=${steamID}`).then(resp => resp.text()).then(response => {
			if (response.includes("500 Internal Server Error")){
				reject("Steam API error, code 500");
			}else if (response.includes("Unknown problem determining WebApi request destination.")){
				reject("Please check you have entered the correct term(s).");
			}else if (response[0] === '<'){
				reject("Unknown error.");
			}else{
				const data = JSON.parse(response);
				resolve(data.playerstats);
			}
		});
	})
}

function getDataForType(playerStats,type){
	return new Promise((resolve,reject) => {
		switch (type){
			case types.ACHIEVEMENTS:
				resolve(dataSorter.achievements(playerStats));
				break;
			default:
				reject("No such type found.");
				break;
		}
	});
}