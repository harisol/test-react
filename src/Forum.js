import React, { Component } from "react";
import ForumService from "./services/forum.service";
import helper from './utils/helpers';

export default class Forum extends Component {
    constructor(props) {
        super(props);
        this.getForum = this.getForum.bind(this);
        this.deleteForum = this.deleteForum.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        this.forumProperties = {
            id: null,
            title: "",
            id_category: "",
            content: "",
            published: false,
            is_anonymous: 0
        };

        this.state = {
            currentForum: null,
            categories: [],
            message: ""
        };
    }

    componentDidMount() {
        // props.match only available if this component attached inside <Route> attributes.
        if (!this.props.match) return;

        if (this.props.match.path === '/create-forum') {
            // on page create forum
            this.setState({ currentForum: this.forumProperties });
        } else {
            // on page edit forum
            this.getForum(this.props.match.params.id);
        }

        ForumService.listCategory()
            .then(response => {
                this.setState({
                    categories: response.data.items
                });
            });
    }

    handleInputChange(e) {
        const target = e.target;
        this.setState({
            currentForum: {
                ...this.state.currentForum,
                [target.name]: (target.name === 'is_anonymous') ? Number(target.value) : target.value
            }
        });
    }

    getForum(id) {
        ForumService.get(id)
            .then(response => {
                if (!response.data?.forum) {
                    this.setState({ message: helper.alert('warning', 'Forum not found') });
                    return;
                }

                const forum = helper.updateMatchingProperties(response.data.forum, this.forumProperties);
                this.setState({
                    currentForum: forum
                    // currentForum: response.data.forum
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    saveForum(action) {
        const currentForum = this.state.currentForum;
        const postData = {
            id_forum: currentForum.id,
            id_category: currentForum.id_category,
            title: currentForum.title,
            content: currentForum.content,
            is_anonymous: currentForum.is_anonymous,
        };

        const method = action || 'create';
        ForumService[method](postData)
            .then(response => {
                console.log(response.data);

                let msg = helper.alert('success', 'Forum was saved successfully');
                if (response.code !== 200) {
                    const errors = response?.data?.errors;
                    msg = errors ? [] : response.message;
                    for (const key in errors) {
                        msg.push(response.data.errors[key]);
                    }

                    msg = typeof msg !== 'string' ? helper.arrayToHtmlList(msg) : msg;

                    // msg could be some html tag. Join string with html tag using array to avoid printing the html tag
                    msg = [`Forum was not saved:\n`, msg];
                    msg = helper.alert('warning', msg);
                }
                
                this.setState({ message: msg });
            })
            .catch(e => {
                console.log(e);
            });
    }

    deleteForum() {
        if (!window.confirm('Are you sure want to delete?')) return;

        ForumService.delete(this.state.currentForum.id)
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: response.code === 200 ? "The forum was deleted!" : response.message
                });

                // redirect
                this.props.history.push('/forums')
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { currentForum } = this.state;
        const optionCategories = this.state.categories.map(row => 
            <option key={row.id} value={row.id}>{row.name}</option>
        );
        optionCategories.unshift(<option key={0} value=''>---Select Category---</option>);

        return (
            <div className="col-md-6">
                {currentForum ? (
                    <div className="edit-form">
                        <h4>Forum</h4>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    id="title"
                                    value={currentForum.title}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Category">Category</label>
                                <select name="id_category" className="form-control" value={currentForum.id_category} id="Category" onChange={this.handleInputChange}>
                                    {optionCategories}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Content">Content</label>
                                <textarea
                                    name="content"
                                    className="form-control"
                                    id="Content"
                                    value={currentForum.content}
                                    onChange={this.handleInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Category">Is Anonymous</label>
                                <div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            name="is_anonymous"
                                            value="1"
                                            className="form-check-input"
                                            id="is-anonymous-1"
                                            checked={currentForum.is_anonymous === 1}
                                            onChange={this.handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="is-anonymous-1">
                                            Yes
                                        </label>
                                    </div>
                                    <div className="form-check form-check-inline">
                                        <input
                                            type="radio"
                                            name="is_anonymous"
                                            value="0"
                                            className="form-check-input"
                                            id="is-anonymous-2"
                                            checked={currentForum.is_anonymous !== 1}
                                            onChange={this.handleInputChange}
                                        />
                                        <label className="form-check-label" htmlFor="is-anonymous-2">
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            {this.state.currentForum.id ? (
                                <div className="mb-3">
                                    <button type="button" className="badge bg-danger me-2" onClick={this.deleteForum}>Delete</button>
                                    <button
                                        type="button"
                                        className="badge bg-success"
                                        onClick={this.saveForum.bind(this, 'update')}
                                    >
                                        Update
                                    </button>
                                </div>
                            ): (
                                <button
                                    type="button"
                                    className="badge bg-success mb-3"
                                    onClick={this.saveForum.bind(this)}
                                    // onClick={this.setActiveForum.bind(this, forum, index)}
                                >
                                    Save
                                </button>
                            )}
                        </form>
                        {this.state.message}
                    </div>
                ) : (
                    <div>
                        <br />
                        {this.state.message}
                    </div>
                )}
            </div>
        );
    }
}