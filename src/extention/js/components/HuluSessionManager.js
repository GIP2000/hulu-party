const React = require('react');
const createReactClass = require('create-react-class');
const axios = require("axios");



module.exports = createReactClass({

    handleClick : function(e){
        e.preventDefault();
        const url = this.props.url; 
        console.log(url); 
        axios.get(`https://dry-brook-72799.herokuapp.com/startParty?url=${url}`).then(res=>{
            const uid = res.data.uid; 
            console.log(uid); 
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {uid}, function(response) {
                    console.log("done");
                });
              });

        }); 

    },

    render: function () {

        console.log(this.props.tabs);
        

        return<div><button onClick = {this.handleClick}>Press me to start a party</button></div>


    }
});
