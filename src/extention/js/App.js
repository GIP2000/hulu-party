const React = require('react');
const createReactClass = require('create-react-class');
const HuluSessionManager = require('./components/HuluSessionManager.js')
const LinkToCopy = require("./components/LinkToCopy.js");

module.exports = createReactClass({

    render: function () {
        let url = this.props.url;
        let jsx = <div><p>Go Onto a show of Hulu please</p></div>;

        if (url.indexOf("hulu.com/watch") != -1 && url.indexOf("=https://www.hulu.com/watch") == -1) {
            console.log(this.props.uid);

            if (this.props.uid == false)
                jsx = <HuluSessionManager url={url} />
            else {
                let link = `https://dry-brook-72799.herokuapp.com/joinParty/${this.props.uid}?url=${url}`;
                jsx = <LinkToCopy link={link} />;
            }
        }


        return jsx;


    }
});
