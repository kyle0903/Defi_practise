import React, { Component } from "react";
import Web3 from "web3";
import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import Navbar from "./Navbar1";
import Main from "./Main";
import Stake from "./Stake";
import "./App.css";

class App extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });

    const networkId = await web3.eth.net.getId();

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    console.log(daiTokenData.address);
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      this.setState({ daiToken });
      let daiTokenBalance = await daiToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ daiTokenBalance: daiTokenBalance.toString() });
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      );
      this.setState({ dappToken });
      let dappTokenBalance = await dappToken.methods
        .balanceOf(this.state.account)
        .call();
      this.setState({ dappTokenBalance: dappTokenBalance.toString() });
      this.setState({ dappTokenaddress: dappTokenData.address.toString() });
    } else {
      window.alert("DappToken contract not deployed to detected network.");
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      this.setState({ tokenFarm });
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(this.state.account)
        .call();
      let reserve = await tokenFarm.methods
        .reserve(tokenFarmData.address)
        .call();
      this.setState({ stakingBalance: stakingBalance.toString() });
      this.setState({ reserve: reserve.toString() });
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }

    this.setState({ loading: false });
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  stakeTokens = async (amount) => {
    this.setState({ loading: true });
    this.setState({ staking: true });
    await this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.tokenFarm.methods
          .stakeTokens(amount)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  buyTokens = async (amount, amount1) => {
    this.setState({ loading: true });
    this.setState({ staking: false });
    await this.state.daiToken.methods
      .approve(this.state.tokenFarm._address, amount1)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.tokenFarm.methods
          .buyTokens(amount, amount1)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  sellTokens = async (amount, amount1) => {
    this.setState({ loading: true });
    this.setState({ staking: false });
    await this.state.dappToken.methods
      .approve(this.state.tokenFarm._address, amount)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.state.tokenFarm.methods
          .sellTokens(amount, amount1)
          .send({ from: this.state.account })
          .on("transactionHash", (hash) => {
            this.setState({ loading: false });
          });
      });
  };

  unstakeTokens = async (amount) => {
    this.setState({ loading: true });
    this.setState({ staking: true });
    await this.state.tokenFarm.methods
      .UnstakeTokens()
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
      });
  };

  decline = () => {
    this.setState({ loading: true });
    this.setState({ staking: false });
    this.setState((state) => {
      if (state.dappTokenPrice > 0.01) {
        return {
          dappTokenPrice: Math.round((state.dappTokenPrice - 0.01) * 100) / 100,
        };
      } else {
        return { dappTokenPrice: 0 };
      }
    });
    console.log(this.state.dappTokenPrice);
    this.setState({ loading: false });
  };

  increase = () => {
    this.setState({ loading: true });
    this.setState({ staking: false });
    this.setState((state) => {
      return {
        dappTokenPrice: Math.round((state.dappTokenPrice + 0.01) * 100) / 100,
      };
    });
    console.log(this.state.dappTokenPrice);
    this.setState({ loading: false });
  };

  stake = (_amount) => {
    this.setState({ loading: true });
    if (_amount === 1) {
      this.setState({ staking: true });
    } else {
      this.setState({ staking: false });
    }
    this.setState({ loading: false });
  };

  constructor(props) {
    super(props);
    this.state = {
      account: "0x0",
      daiToken: {},
      dappToken: {},
      tokenFarm: {},
      daiTokenBalance: "0",
      dappTokenBalance: "0",
      dappTokenaddress: "0",
      stakingBalance: "0",
      reserve: "0",
      dappTokenPrice: 1,
      loading: true,
      staking: false,
    };
  }

  render() {
    let content;
    if (this.state.loading) {
      content = (
        <p id="loader" className="text-center">
          Loading...
        </p>
      );
    } else {
      if (this.state.staking) {
        content = (
          <Stake
            stake={this.stake}
            daiTokenBalance={this.state.daiTokenBalance}
            dappTokenBalance={this.state.dappTokenBalance}
            stakingBalance={this.state.stakingBalance}
            reserve={this.state.reserve}
            stakeTokens={this.stakeTokens}
            buyTokens={this.buyTokens}
            sellTokens={this.sellTokens}
            unstakeTokens={this.unstakeTokens}
            dappTokenPrice={this.state.dappTokenPrice}
            decline={this.decline}
            increase={this.increase}
          />
        );
      } else {
        content = (
          <Main
            stake={this.stake}
            daiTokenBalance={this.state.daiTokenBalance}
            dappTokenBalance={this.state.dappTokenBalance}
            stakingBalance={this.state.stakingBalance}
            reserve={this.state.reserve}
            stakeTokens={this.stakeTokens}
            buyTokens={this.buyTokens}
            sellTokens={this.sellTokens}
            unstakeTokens={this.unstakeTokens}
            dappTokenPrice={this.state.dappTokenPrice}
            decline={this.decline}
            increase={this.increase}
          />
        );
      }
    }

    return (
      <div>
        <Navbar
          daiTokenBalance={this.state.daiTokenBalance}
          dappTokenaddress={this.state.dappTokenaddress}
          account={this.state.account}
        />

        <div className="container-fluid mt-5">
          <div className="row">
            <main
              role="main"
              className="col-lg-12 ml-auto mr-auto"
              style={{ maxWidth: "600px" }}
            >
              <div className="content mr-auto ml-auto">{content}</div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
/*<Stake
        stake={this.stake}
        daiTokenBalance={this.state.daiTokenBalance}
        dappTokenBalance={this.state.dappTokenBalance}
        stakingBalance={this.state.stakingBalance}
        reserve={this.state.reserve}
        stakeTokens={this.stakeTokens}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
        unstakeTokens={this.unstakeTokens}
        dappTokenPrice={this.state.dappTokenPrice}
        decline={this.decline}
        increase={this.increase}
      />*/
