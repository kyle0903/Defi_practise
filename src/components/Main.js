import React, { Component } from "react";
import dollars from "../dollars.png";
import arrow from "../chevron.png";
import ntub from "../ntublogo.gif";

class Main extends Component {
  render() {
    return (
      <div id="content" className="page-header header-filter">
        <br />
        <br />
        <br />
        <table className="table table-borderless text-muted text-center">
          <thead>
            <tr>
              <th scope="col" className="title_up_1">
                Reserve
              </th>
              <th scope="col" className="title_up_2">
                Circulation
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="title_up_1" style={{ fontWeight: "bold" }}>
                <b style={{ color: "red", fontSize: "20px" }}>
                  {window.web3.utils.fromWei(this.props.reserve, "Ether")}
                </b>
                USD
              </td>
              <td className="title_up_2" style={{ fontWeight: "bold" }}>
                <b style={{ color: "red", fontSize: "20px" }}>
                  {window.web3.utils.fromWei(
                    this.props.dappTokenBalance,
                    "Ether"
                  )}
                </b>
                NTUB
              </td>
            </tr>
          </tbody>
        </table>
        <div className="card mb-4">
          <div className="card-body">
            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                let amount, amount1;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                amount1 = this.input1.value.toString();
                amount1 = window.web3.utils.toWei(amount1, "Ether");
                this.props.buyTokens(amount, amount1);
              }}
            >
              <div>
                <label className="float-left">
                  <b>Trade Tokens</b>
                </label>
                <span className="float-right text-muted">
                  USD Balance:
                  <b style={{ color: "red" }}>
                    {window.web3.utils.fromWei(
                      this.props.daiTokenBalance,
                      "Ether"
                    )}
                  </b>
                  USD
                </span>
              </div>
              <div className="input-group mb-4">
                <input
                  type="text"
                  id="dapp"
                  ref={(input) => {
                    this.input = input;
                  }}
                  className="form-control form-control-lg"
                  onChange={() => {
                    let outstanding = parseInt(
                      document.getElementById("dapp").value.toString()
                    );
                    document.getElementById("dai").value =
                      outstanding * this.props.dappTokenPrice;
                  }}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={ntub} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; NTUB
                  </div>
                </div>
              </div>

              <img
                src={arrow}
                height="50"
                alt="arrow"
                style={{ display: "block", margin: "auto" }}
              />
              <br />
              <div className="input-group mb-4">
                <input
                  type="text"
                  ref={(input1) => {
                    this.input1 = input1;
                  }}
                  className="form-control form-control-lg"
                  placeholder="0"
                  id="dai"
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <img src={dollars} height="32" alt="" />
                    &nbsp;&nbsp;&nbsp; USD
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn_sellbuy">
                BuyNTUB!
              </button>
            </form>

            <form
              className="mb-3"
              onSubmit={(event) => {
                event.preventDefault();
                let amount, amount1;
                amount = this.input.value.toString();
                amount = window.web3.utils.toWei(amount, "Ether");
                amount1 = this.input1.value.toString();
                amount1 = window.web3.utils.toWei(amount1, "Ether");
                this.props.sellTokens(amount, amount1);
              }}
            >
              <button type="submit" className="btn btn_sellbuy">
                SellNTUB!
              </button>
            </form>
            <button
              className="btn btn_decrease"
              onClick={(event) => {
                event.preventDefault();
                this.props.decline();
              }}
            >
              Decrease
            </button>
            <button
              className="btn btn_increase"
              onClick={(event) => {
                event.preventDefault();
                this.props.increase();
              }}
            >
              Increase
            </button>
            <button
              className="btn btn_stake"
              style={{ marginLeft: "80px" }}
              onClick={(event) => {
                event.preventDefault();
                this.props.stake(1);
              }}
            >
              <span>Earn Share </span>
            </button>
            <label
              style={{
                fontSize: "20px",
                marginLeft: "200px",
                marginTop: "10px",
                color: "black",
              }}
            >
              1 DappToken's price：
              <b style={{ color: "red" }}>${this.props.dappTokenPrice} </b>
              USD
            </label>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;
/*

*/
