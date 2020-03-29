const React = require('react');
const createReactClass = require('create-react-class');
const HuluSessionManager = require('./components/HuluSessionManager.js')


module.exports = createReactClass({

    render: function () {
        let url = this.props.url;
        let jsx = <div><h1>Go Onto a show of Hulu please</h1></div>;

        if (url.indexOf("hulu.com/watch") != -1 && url.indexOf("=https://www.hulu.com/watch") == -1) {
            console.log(this.props.uid); 

            if (this.props.uid == false)
                jsx = <HuluSessionManager url={url} />
            else
                jsx = <div><a>https://dry-brook-72799.herokuapp.com/joinParty/{this.props.uid}?url={url}</a></div>
        }


        return jsx;


    }
});
