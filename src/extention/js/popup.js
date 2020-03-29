const React = require('react');
const ReactDOM = require('react-dom');
const App = require("./App.js");

document.addEventListener("DOMContentLoaded", function () {


    chrome.tabs.query({active:true,currentWindow:true},(tab)=>{
        chrome.storage.local.get({"uid":false},val=>{
            console.log(val); 
            ReactDOM.render(<App url= {tab[0].url} uid={val.uid} />, document.getElementById('root'));
        });
        
    });


    
});

