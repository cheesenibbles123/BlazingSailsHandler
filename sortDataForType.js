const achievements = require("./structs/achievements.js");

module.exports = {
	achievements : (data) => {
		return new Promise((resolve,reject) => {
			if (data['achievements']){
				let returnData = {
					count : 0,
					listRaw : [],
					listFormatted : [],
				};

				data.achievements.forEach(achievement => {
					if (achievement.achieved === 1){
						returnData.count += 1;
						returnData.listRaw.push(achievement.name)
						returnData.listFormatted.push(achievement[achievement.name]);
					}
				});

				resolve(returnData);
			}else{
				reject("Player has no achievements");
			}
		})
	}
}