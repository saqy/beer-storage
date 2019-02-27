import React from "react";
import Modal from "./Modal";
import axios from "axios";
import config from "./utils/config";

class BeerRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      beer: props.beer,
      newLikes: props.beer.likes,
      showModal: false
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.addNewLikes = this.addNewLikes.bind(this);
    this.onLikesChange = this.onLikesChange.bind(this);
  }

  toggleModal(e) {
    this.setState({
      showModal: !this.state.showModal
    });
  }

  onLikesChange(e) {
    e.preventDefault();
    this.setState({ newLikes: e.target.value });
  }

  addNewLikes(e) {
    axios
      .put(`${config.baseURL}/${this.state.beer.id}`, {
        likes: this.state.newLikes
      })
      .then(result => {
        this.setState({ showModal: false });
        this.props.onUpdate({
          id: this.state.beer.id,
          name: this.state.beer.name,
          likes: this.state.newLikes
        });
      })
      .catch(err => {
        this.setState({ showModal: false });
      });
  }

  render() {
    const { beer } = this.props;
    return (
      <React.Fragment>
        <tr key={beer.id}>
          <th scope="row">
            <i className="fa fa-beer" aria-hidden="true" />{" "}
            <span>{beer.id}</span>
          </th>
          <td>{beer.name}</td>
          <td>{beer.likes}</td>
          <td>
            <i
              className="fa fa-pencil-square-o"
              onClick={e => this.toggleModal(e, beer)}
              aria-hidden="true"
              style={{ cursor: "pointer" }}
            />
          </td>
        </tr>
        {this.state.showModal ? (
          <Modal>
            <h1>
              Enter the new likes for <span>{beer.name}?</span>
            </h1>
            <div className="buttons">
              <input
                type="text"
                placeholder="New Likes"
                onChange={this.onLikesChange}
              />{" "}
              <br />
              <br />
              <button onClick={this.addNewLikes}>Ok</button>
            </div>
          </Modal>
        ) : null}
      </React.Fragment>
    );
  }
}

export default BeerRow;
