const DappToken = artifacts.require("DappToken");
const DaiToken = artifacts.require("DaiToken");
const TokenFarm = artifacts.require("TokenFarm");

require('chai')
	.use(require('chai-as-promised'))
	.should()
function tokens(n) {
	// body...
	return web3.utils.toWei(n,'ether');
}
contract('TokenFarm',([owner,investor])=>{
	let daiToken,dappToken,tokenFarm;
	before(async () =>{
		//Load Contracts
		daiToken = await DaiToken.new();
		dappToken = await DappToken.new();
		tokenFarm = await TokenFarm.new(dappToken.address,daiToken.address);
	})
	//Write tests here...
	describe('Mock DAI deployment',async () =>{
		it('has a name',async() =>{
			const name = await daiToken.name();
			assert.equal(name,'Mock DAI Token');
		})
	});

	describe('Dapp Token deployment',async () =>{
		it('has a name',async() =>{
			const name = await dappToken.name();
			assert.equal(name,'DApp Token');
		})
	});

	describe('Token Farm deployment',async () =>{
		it('has a name',async() =>{
			const name = await tokenFarm.name();
			assert.equal(name,'Dapp Token TokenFarm');
		})

		it('contract has tokens',async() =>{
			//Transfer all Dapp tokens to farm(1 millon)
			await dappToken.transfer(tokenFarm.address,tokens('1000000'));
			let balance = await dappToken.balanceOf(tokenFarm.address);
			assert.equal(balance.toString(),tokens('1000000'));
		})
	});

	describe('Farming tokens',async() =>{
		it('reward investor for staking mDai tokens',async() =>{
			//Send tokens to investor
			await daiToken.transfer(investor,tokens('100'),{ from : owner});
			let result;
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('100'),'investor Mock DAI wallet balance correct before staking');

			//Stake Mock DAI Tokens
			await daiToken.approve(tokenFarm.address,tokens('100'),{ from: investor});
			await tokenFarm.stakeTokens(tokens('100'),{ from: investor});

			//Check staking result
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('0'),'investor Mock DAI wallet balance correct after staking');

			result = await daiToken.balanceOf(tokenFarm.address);
			assert.equal(result.toString(),tokens('100'),'Token Farm Mock DAI balance correct after staking');

			result = await tokenFarm.stakingBalance(investor);
			assert.equal(result.toString(),tokens('100'),'investor staking balance correct after staking');

			result = await tokenFarm.isStaking(investor);
			assert.equal(result.toString(),'true','investor staking status correct after staking');

			//issue tokens
			await tokenFarm.issueTokens({from:owner});
			//check balances after issuance
			result = await dappToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('1'),'investor Dapp Token wallet balance correct after issuance');
			//ensure that only owner can issue tokens
			await tokenFarm.issueTokens({from:investor}).should.be.rejected;	
			//Unstake Token
			await tokenFarm.UnstakeTokens({from:investor});

			//Check result after unstaking
			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('100'),'investor Dai Token wallet balance correct after staking');
			
			result = await tokenFarm.stakingBalance(investor);
			assert.equal(result.toString(),tokens('0'),'investor staking balance correct after staking');

			result = await daiToken.balanceOf(tokenFarm.address);
			assert.equal(result.toString(),tokens('0'),'TokenFarm Mock Dai balance correct after staking');

			result = await tokenFarm.isStaking(investor);
			assert.equal(result.toString(),'false','investor staking status correct after staking');
		})
		it('Buying token has correct ',async() =>{
			//buytoken
			let result;
			await daiToken.approve(tokenFarm.address,tokens('100'),{ from: investor});
			await tokenFarm.buyTokens(tokens('100'),tokens('100'),{ from: investor});
			//await tokenFarm.issueDapp(tokens('100'),{ from: investor})

			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('0'),'investor Mock DAI wallet balance correct after buying');

			result = await tokenFarm.reserve(tokenFarm.address);
			assert.equal(result.toString(),tokens('100'),'Token Farm Mock DAI balance correct after buying');

			result = await dappToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('101'),'investor DappToken balance correct after buying');

			await dappToken.approve(tokenFarm.address,tokens('100'),{ from: investor});
			await tokenFarm.sellTokens(tokens('100'),tokens('100'),{ from: investor});
			//await tokenFarm.issueDapp(tokens('100'),{ from: investor})

			result = await daiToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('100'),'investor Mock DAI wallet balance correct after buying');

			result = await tokenFarm.reserve(tokenFarm.address);
			assert.equal(result.toString(),tokens('0'),'Token Farm Mock DAI balance correct after buying');

			result = await dappToken.balanceOf(investor);
			assert.equal(result.toString(),tokens('1'),'investor DappToken balance correct after buying');

		})
	})
});