import React, { Component } from "react";
import dollars from "../dollars.png";
import "./App.css";

class Stake extends Component {
  render() {
    console.log(this.props.dappTokenPrice);
    return (
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 ml-auto mr-auto"
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              <div id="content" className="mt-3">
                <table className="table table-borderless text-muted text-center">
                  <thead>
                    <tr>
                      <th scope="col" className="title_up_1">
                        Stake{" "}
                      </th>
                      <th scope="col" className="title_up_2">
                        Circulation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="title_up_1" style={{ fontWeight: "bold" }}>
                        <b style={{ color: "red" }}>
                          {window.web3.utils.fromWei(
                            this.props.stakingBalance,
                            "Ether"
                          )}
                        </b>
                        USD
                      </td>
                      <td className="title_up_2" style={{ fontWeight: "bold" }}>
                        <b style={{ color: "red" }}>
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
                        let amount;
                        amount = this.input.value.toString();
                        amount = window.web3.utils.toWei(amount, "Ether");
                        this.props.stakeTokens(amount);
                      }}
                    >
                      <div>
                        <label
                          className="float-left"
                          style={{ color: "black" }}
                        >
                          <b>Earn Share</b>
                        </label>
                        <span
                          className="float-right text-muted"
                          style={{ color: "black" }}
                        >
                          USD Balance:{" "}
                          <b style={{ color: "red" }}>
                            {window.web3.utils.fromWei(
                              this.props.daiTokenBalance,
                              "Ether"
                            )}
                          </b>{" "}
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
                          placeholder="0"
                          required
                        />
                        <div className="input-group-append">
                          <div className="input-group-text">
                            <img src={dollars} height="32" alt="dollars" />
                            &nbsp;&nbsp;&nbsp; USD
                          </div>
                        </div>
                      </div>
                      <button type="submit" className="btn btn_sellbuy">
                        Stake!
                      </button>
                    </form>
                    <button
                      type="submit"
                      className="btn btn-link btn-block btn-sm"
                      onClick={(event) => {
                        event.preventDefault();
                        this.props.unstakeTokens();
                      }}
                    >
                      UN-STAKE...
                    </button>

                    <button
                      className="btn btn_stake"
                      style={{ marginLeft: "310px" }}
                      onClick={(event) => {
                        event.preventDefault();
                        this.props.stake(0);
                      }}
                    >
                      <span>Trade Tokens</span>
                    </button>
                    <label
                      style={{
                        position: "absolute",
                        left: "20px",
                        bottom: "30px",
                        fontSize: "20px",
                      }}
                    >
                      1 DappToken's price：
                      <b style={{ color: "red" }}>
                        ${this.props.dappTokenPrice}
                      </b>
                      USD
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
}

export default Stake;
