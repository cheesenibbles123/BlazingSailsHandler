module.exports = {
	generateResponse: (isValid,type,data) => {
		const obj = {
			isValid : isValid,
			type : type,
			content : data
		}
		return obj;
	}
}