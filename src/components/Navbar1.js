import React, { Component } from "react";
import { Navbar, Container } from "react-bootstrap";

class Navbar1 extends Component {
  render() {
    return (
      <Navbar style={{ backgroundColor: "#3c7ea9" }}>
        <Container>
          <Navbar.Brand>NTUBToken Trade Web</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={{ color: "black", fontWeight: "bold" }}>
              Account's address：{this.props.account}
              <br />
              NTUBToken's address：{this.props.dappTokenaddress}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}

export default Navbar1;
