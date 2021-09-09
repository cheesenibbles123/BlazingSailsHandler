const fetch = require('node-fetch');
const { generateResponse } = require("./generateResponse");
const types = require("./structs/types");
const dataSorter = require("./sortDataForTypes");

let apiKey;

exports.init = function init(newApiKey){
	apiKey = newApiKey;
}

exports.query = async function query(type,steamID) => {
	if (checkIfPublic(steamID)){

		getStats(steamID).then(playerStats => {

			getDataForType(playerStats,type).then(response => {
				return generateResponse(true,type,response);
			}).catch(error => {
				return generateResponse(false,type,error);
			});

		}).catch(error => {

			return generateResponse(false,type,error);
		})

	}else{
		return generateResponse(false,type,"Private profile.");
	}
}

function checkIfPublic(steamID){
	return new Promise ((resolve,reject) => {
		fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamKey}&steamids=${steamID}`).then(resp => resp.json()).then(response => {
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
		fetch(`https://api.steampowered.com/ISteamUserStats/GetUserStatsForGame/v2?key=${steamKey}&appid=1158940&steamid=${steamID}`).then(resp => resp.text()).then(response => {
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
				resolve(dataSorter.achievements(playerstats));
				break;
			default:
				reject("No such type found.");
				break;
		}
	});
}