const React = require('react');
const createReactClass = require('create-react-class');
const Button = require("react-bootstrap").Button;

module.exports = createReactClass({


    handleFocus: function (e) {
        e.target.select();

    },

    handleClick: function (e) {
        navigator.clipboard.writeText(this.props.link);

    },
    clearParty: function (e) {
        chrome.storage.local.clear(() => window.close());

    },


    render: function () {

        return <div >
            <strong style={{ marginLeft: "10px" }}>Link to the Gathering</strong>
            <input type="text" readOnly="true" autoComplete="off" onFocus={this.handleFocus} value={this.props.link} style={{ fontSize: "10px", width: "25em", marginRight: "10px", marginLeft: "10px" }} />


            <Button style={{ marginTop: "8px", marginBottom: "5px", marginLeft: "10px" }} size="sm" variant="outline-success" onClick={this.clearParty}>Clear Party</Button>
            <Button style={{ marginTop: "8px", marginBottom: "5px", float: 'right', marginRight: "10px" }} size="sm" variant="outline-success" onClick={this.handleClick}>Copy Link</Button>

        </div>



    }


});

