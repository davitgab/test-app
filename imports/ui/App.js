import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';
import Task from './Task';

// App component - represents the whole app
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hideCompleted: false,
        };
    }

    handleSubmit(event) {
        let a = Tasks.find({}, { sort: { createdAt: -1 } }).fetch()
        event.preventDefault();
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

        Meteor.call('tasks.insert', text);
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }
        return filteredTasks.map((task) => {
            return <Task key={task._id} task={task} />
        });
    }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.props.incompleteCount})</h1>
                </header>
                <label className="hide-completed">
                    <input
                        type="checkbox"
                        readOnly
                        checked={this.state.hideCompleted}
                        onClick={this.toggleHideCompleted.bind(this)}
                    />
                    Hide Completed Tasks
                </label>
                <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
                    <input
                        type="text"
                        ref="textInput"
                        placeholder="Type to add new tasks"
                    />
                </form>
                <div>{this.renderTasks()}</div>
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe("tasks");
    return {
        tasks: Meteor.call('tasks.getAll', (error, result) => {
            return result;
        }),
        incompleteCount: Meteor.call('tasks.getIncompleteCount', (error, result) => {
            return result;
        })
    };
})(App);

// export default withTracker(() => {
//     return {
//         tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
//         incompleteCount: Tasks.find({ checked: { $ne: true } }).count()
//     };
// })(App);