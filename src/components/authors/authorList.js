"use strict";

var React = require('react');
var Router = require('react-router');
var Link = Router.Link;
var AuthorActions = require('../../actions/authorActions');
var toastr = require('toastr');

var AuthorList = React.createClass({
	propTypes: {
		authors: React.PropTypes.array.isRequired
	},

	render: function() {
		var createAuthorRow = function(author) {

			var deleteAuthor = function(event) {
				event.preventDefault();
				AuthorActions.deleteAuthor(author.id);
				toastr.success('Author Deleted');
			};

			return (
				<tr key={author.id}>
					<td><a href="#" onClick={deleteAuthor}>Delete</a></td>
					<td><Link to="manageAuthor" params={{id: author.id}}>{author.id}</Link></td>
					<td>{author.firstName} {author.lastName}</td>
				</tr>
			);
		};

		return (
			<div>
				<table className="table">
					<thead>
						<th></th>
						<th>ID</th>
						<th>Name</th>
					</thead>
					<tbody>
						{this.props.authors.map(createAuthorRow)}
					</tbody>


				</table>

			</div>
		);
	}
});


module.exports = AuthorList;