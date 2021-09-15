import React, { Component } from "react";
import ForumService from "./services/forum.service";
import { Link } from "react-router-dom";

export default class ForumList extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveForums = this.retrieveForums.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.findByTitle = this.findByTitle.bind(this);
        
        /* function with multiple params should be bound when called */
        // this.setActiveForum = this.setActiveForum.bind(this);

        this.state = {
            forums: [],
            currentForum: null,
            currentIndex: -1,
            searchTitle: ""
        };
    }

    componentDidMount() {
        this.retrieveForums();
    }

    onChangeSearchTitle(e) {
        const val = e.target.value;

        this.setState({
            searchTitle: val
        });
    }

    retrieveForums() {
        ForumService.getAll()
            .then(response => {
                this.setState({
                    forums: response.data.items
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList() {
        console.log('refreshed');
        this.retrieveForums();
        this.setState({
            currentForum: null,
            currentIndex: -1
        });
    }

    setActiveForum(forum, index) {
        this.setState({
            currentForum: forum,
            currentIndex: index
        });
    }

    findByTitle() {
        ForumService.findByTitle(this.state.searchTitle)
            .then(response => {
                this.setState({
                    forums: response.data.items
                });
                // console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { searchTitle, forums, currentForum, currentIndex } = this.state;

        return (
            <div className="list row">
                <h2>Forum List</h2>
                <div className="col-md-8">
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search by title"
                            value={searchTitle}
                            onChange={this.onChangeSearchTitle}
                            onKeyUp={(event) => {
                                if (event.key === 'Enter') {
                                    // Trigger the button element with a click
                                    this.findByTitle();
                                    console.log(event.key);
                                }
                            }}
                        />
                        <div className="input-group-append">
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={this.findByTitle}
                            >Search
                            </button>
                        </div>
                        &nbsp;&nbsp;<button type="button" className="btn btn-success" onClick={this.refreshList}>Refresh</button>
                    </div>
                </div>
                <div className="col-md-6">
                    <ul className="list-group">
                        {forums &&
                            forums.map((forum, index) => (
                                <li
                                    className={
                                        "list-group-item " +
                                        (index === currentIndex ? "active" : "")
                                    }
                                    onClick={this.setActiveForum.bind(this, forum, index)}
                                    key={index}
                                >
                                    {forum.title}
                                </li>
                            ))}
                    </ul>

                    <Link to="/create-forum" className="m-3 btn btn-sm btn-primary">Create</Link>
                </div>
                <div className="col-md-6">
                    {currentForum ? (
                        <div>
                            <h4>Forum</h4>
                            <div>
                                <label>
                                    <strong>Title:</strong>
                                </label>{" "}
                                {currentForum.title}
                            </div>
                            <div>
                                <label>
                                    <strong>Category:</strong>
                                </label>{" "}
                                {currentForum.category_name}
                            </div>
                            <div>
                                <label>
                                    <strong>Content:</strong>
                                </label>{" "}
                                {currentForum.content}
                            </div>

                            <Link
                                to={"/forum/" + currentForum.id}
                                className="badge bg-warning"
                            >Edit</Link>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Please click on a Forum...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}