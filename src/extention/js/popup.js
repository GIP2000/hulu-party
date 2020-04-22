const React = require('react');
const ReactDOM = require('react-dom');
const App = require("./App.js")


document.addEventListener("DOMContentLoaded", function () {


    chrome.tabs.query({active:true,currentWindow:true},(tab)=>{
        chrome.storage.local.get({"uid":false},val=>{
            console.log(val); 
            ReactDOM.render(<div style ={{ padding:"10px", fontFamily:"Arial"}} ><App url= {tab[0].url} uid={val.uid} /></div>, document.getElementById('root'));
        });
        
    });


    
});

