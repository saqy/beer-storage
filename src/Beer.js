import React, { Component } from "react";
import BeerRow from "./BeerRow";
import Modal from "./Modal";
import axios from "axios";
import config from "./utils/config";

class Beer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beers: [],
      showModal: false,
      newBeerName: "",
      newBeerLikes: ""
    };
    this.updatedBeer = this.updatedBeer.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onNewBeerInputChange = this.onNewBeerInputChange.bind(this);
    this.onAddNewBeer = this.onAddNewBeer.bind(this);
    this.reFetchBeers = this.reFetchBeers.bind(this);
  }

  async componentDidMount() {
    const { data } = await axios.get(config.baseURL);
    this.setState({ beers: data });
  }

  async reFetchBeers() {
    const { data } = await axios.get(config.baseURL);
    this.setState({ beers: data });
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }

  updatedBeer(beer, index) {
    const { beers } = this.state;
    beers[index] = beer;
    this.setState({ beers });
  }

  onNewBeerInputChange(e) {
    const { name, value } = e.target;
    if (value) {
      this.setState({
        [name]: value
      });
    }
  }

  async onAddNewBeer(e) {
    e.preventDefault();
    if (!this.state.newBeerLikes || !this.state.newBeerName) {
      this.setState({ showModal: false });
      return;
    }
    axios
      .post(config.baseURL, {
        name: this.state.newBeerName,
        likes: this.state.newBeerLikes
      })
      .then(res => {
        this.setState({ showModal: false });
        this.reFetchBeers();
      })
      .catch(err => {
        this.setState({ showModal: false });
        console.error("Error Adding Beer ", err);
      });
  }

  render() {
    if (!this.state.beers) {
      return (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Beer ID</th>
              <th scope="col">Name</th>
              <th scope="col">Likes</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                <i className="fa fa-beer" aria-hidden="true" />
              </th>
              <td>No Beers found</td>
              <td>No Beers found</td>
              <td>No Beers found</td>
            </tr>
          </tbody>
        </table>
      );
    }

    return (
      <div className="Beer">
        <div className="addNewBeer">
          <button className="btn btn-lg btn-primary" onClick={this.toggleModal}>
            Add Beer
          </button>
          {this.state.showModal ? (
            <Modal>
              <h1>Add New Beer</h1>
              <div className="buttons">
                <input
                  type="text"
                  placeholder="Beer Name"
                  name="newBeerName"
                  onChange={this.onNewBeerInputChange}
                />{" "}
                <br />
                <br />
                <input
                  type="text"
                  placeholder="Add Likes"
                  name="newBeerLikes"
                  onChange={this.onNewBeerInputChange}
                />{" "}
                <br />
                <br />
                <button onClick={this.onAddNewBeer}>Add</button>
              </div>
            </Modal>
          ) : null}
        </div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Beer ID</th>
              <th scope="col">Name</th>
              <th scope="col">Likes</th>
              <th scope="col">Edit</th>
            </tr>
          </thead>
          <tbody>
            {this.state.beers.map((beer, i) => (
              <BeerRow
                key={beer.id}
                beer={beer}
                onUpdate={uBeer => this.updatedBeer(uBeer, i)}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Beer;
