pragma solidity ^0.5.0;

import "./DappToken.sol";

import "./DaiToken.sol";

contract TokenFarm {
  string public name = "Dapp Token TokenFarm";
  address public owner;
  DappToken public dappToken;
  DaiToken public daiToken;
  address[] public stakers;
  mapping(address => uint) public reserve;
  mapping (address => uint) public stakingBalance;
  mapping (address => bool) public hasStaked;
  mapping (address => bool) public isStaking;

  constructor(DappToken _dappToken,DaiToken _daiToken) public{
    dappToken = _dappToken;
    daiToken = _daiToken;
    owner = msg.sender;
  }
  // Stake token (investor will deposit dai token into this contract to earning reward )
  function stakeTokens(uint _amount) public {
	//requier amount greater than 0
  	require (_amount > 0,"amount cannot be zero");
  	//transfer Moc dai token to this contract for staking
  	daiToken.transferFrom(msg.sender,address(this),_amount);
  	
  	//update staking balance
  	stakingBalance[msg.sender] = stakingBalance[msg.sender]+ _amount;

  	//Add user to stakers array *only* if they haven't staked already
  	if(!hasStaked[msg.sender]){
  		stakers.push(msg.sender);
  	}
  	//update staking status 
  	hasStaked[msg.sender] = true;
  	isStaking[msg.sender] = true;
  }
  // Unstake token (investor can withdraw from the app)
  function UnstakeTokens () public {
  	uint balance = stakingBalance[msg.sender];

  	require (balance > 0,"stake token cannot be zero");

  	daiToken.transfer(msg.sender,balance);

  	stakingBalance[msg.sender]=0;

  	isStaking[msg.sender]=false;
  	
  }

  function buyTokens(uint _amount, uint _amount_usd) public {
    require (_amount > 0,"amount cannot be zero");
    require (_amount_usd > 0,"amount cannot be zero");
    daiToken.transferFrom(msg.sender,address(this),_amount_usd);
    reserve[address(this)] = reserve[address(this)]+ _amount_usd;
    dappToken.transfer(msg.sender,_amount);
  }

  function sellTokens(uint _amount,uint _amount_usd) public {
    require (_amount > 0,"amount cannot be zero");
    require (_amount_usd > 0,"amount cannot be zero");
    dappToken.transferFrom(msg.sender,address(this),_amount);
    daiToken.transfer(msg.sender,_amount_usd);
    reserve[address(this)] = reserve[address(this)]- _amount_usd;
  }

  // Issuing token(in order to investor can earn interest  developer setup and issue the token)
  function issueTokens () public {
  	require (msg.sender == owner,"caller must be the owner");

  	for(uint i=0 ; i<stakers.length;i++){
  		address recipient = stakers[i];
  		uint balance = stakingBalance[recipient];
  		if(balance>0){
  			dappToken.transfer(recipient , (balance/100));
  		}	
  	 }	
  }
  
}

