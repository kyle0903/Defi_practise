const TokenFarm = artifacts.require("TokenFarm");
const schedule = require('node-schedule');
var rule1     = new schedule.RecurrenceRule();
var times1    = [1,31];
rule1.second  = times1;
module.exports = async function(){
  	schedule.scheduleJob(rule1, async function (callback) {
  	console.log("Token Issued!!!");
  	let tokenFarm = await TokenFarm.deployed();
  	await tokenFarm.issueTokens();
  	callback();
	})
};
	

