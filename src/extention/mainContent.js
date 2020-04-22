const io = require("socket.io-client");

let moving = false;
let movingG = false;


const initalSeekHandler = () => {
    const duration = videoPlayer.duration;
    if (videoPlayer.currentTime + 10 >= parseInt(duration)) {
        videoPlayer.currentTime = 0;
        videoPlayer.removeEventListener("seeked", initalSeekHandler);


    } else {
        console.log("adding 10");
        videoPlayer.currentTime += 1;
    }
};

const setTimeStamp = (timeStamp, videoPlayer, modifier = true) => {
    moving = modifier;
    movingG = modifier;
    const fastForwardButton = document.querySelector("#dash-player-container > div > div:nth-child(11) > div > div.controls-wrap > div.controls > div.controls__menus > div.controls__menus-center > div.controls__fastforward-button.keep-mouse-active");
    const rewindButton = document.querySelector("#dash-player-container > div > div:nth-child(11) > div > div.controls-wrap > div.controls > div.controls__menus > div.controls__menus-center > div.controls__rewind-button.keep-mouse-active");
    const button = videoPlayer.currentTime > timeStamp ? rewindButton : fastForwardButton;


    while (Math.abs(videoPlayer.currentTime - timeStamp) > 10) {
        button.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
    }

    if (videoPlayer.currentTime != timeStamp) videoPlayer.currentTime = timeStamp;
    movingG = false;



}


const playOrPause = (paused, videoPlayer, playButton) => {

    // console.log("info recived")
    if (paused != videoPlayer.paused)
        playButton.dispatchEvent(new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        }));

}


const main = () => {


    let targetNode = document.getElementById("dash-player-container");
    const config = { childList: true };
    const callback = (mutationList, observer) => {
        console.log(mutationList[0].target);
        targetNode = mutationList[0].target;
        gObserver.disconnect();


        playButton = document.querySelector("#dash-player-container > div > div:nth-child(11) > div > div.controls-wrap > div.controls > div.controls__menus > div.controls__menus-center > div.controls__playback-button.keep-mouse-active.controls__playback-button--paused") === null ? document.querySelector("#dash-player-container > div > div:nth-child(11) > div > div.controls-wrap > div.controls > div.controls__menus > div.controls__menus-center > div.controls__playback-button.keep-mouse-active.controls__playback-button--playing") : document.querySelector("#dash-player-container > div > div:nth-child(11) > div > div.controls-wrap > div.controls > div.controls__menus > div.controls__menus-center > div.controls__playback-button.keep-mouse-active.controls__playback-button--paused");
        videoPlayer = document.getElementsByClassName("video-player")[0];

        chrome.storage.local.get("uid", val => {
            const uid = val.uid;
            if (uid === undefined) return chrome.storage.local.clear(makeParty);
            const socket = io("https://dry-brook-72799.herokuapp.com/hulu-party");


            socket.emit("identify", uid);


            socket.on("timeStampChange", timeStamp => {
                console.log("time stamp change");
                console.log(videoPlayer.currentTime);
                console.log(videoPlayer.readyState);
                if (videoPlayer.readyState == 4) {
                    playOrPause(true, videoPlayer, playButton);
                    setTimeStamp(timeStamp, videoPlayer);
                } else {

                    const whenReady = (e) => {
                        playOrPause(true, videoPlayer, playButton);
                        setTimeStamp(timeStamp, videoPlayer);
                        videoPlayer.removeEventListener("canplay", whenReady);
                    }

                    videoPlayer.addEventListener("canplay", whenReady);
                }
            });


            socket.on("backFive", val => {
                console.log("back 5 ran");

                playOrPause(true, videoPlayer, playButton);
                setTimeStamp(videoPlayer.currentTime - 5, videoPlayer);
            })



            socket.on("paused", (paused) => {
                playOrPause(paused, videoPlayer, playButton)
            });
            videoPlayer.addEventListener("pause", e => {
                socket.emit("paused", true);
            });
            videoPlayer.addEventListener("playing", e => {
                socket.emit("paused", false);
            });


            videoPlayer.addEventListener("seeked", e => {
                if (!moving) {
                    playOrPause(true, videoPlayer, playButton);
                    return socket.emit("timeStampChange", videoPlayer.currentTime)
                }

                if(moving != movingG){
                    movingG = false; 
                    moving = false; 
                }

            });


            videoPlayer.addEventListener("waiting", e => console.log("waiting"));

        });
    }

    let gObserver = new MutationObserver(callback);
    gObserver.observe(targetNode, config)


}




const makeParty = () => {
    console.log("making party");
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        console.log("message recived");
        const uid = request.uid;
        window.location.href = `https://dry-brook-72799.herokuapp.com/joinParty/${uid}?url=${window.location.href}`;
    });


}




const onLoadFunc = () => {

    console.log("running");

    const currentUrl = window.location.href;
    console.log(currentUrl);
    if (currentUrl.indexOf("hulu.com/watch") != -1 && currentUrl.indexOf("=https://www.hulu.com/watch") == -1) {

        window.addEventListener("beforeunload", () => {
            chrome.storage.local.clear(() => console.log("cleared your hulu party"));
        });


        chrome.storage.local.get("url", (val) => {
            const url = val.url;
            if (url == window.location.href) main();
            else makeParty();
        });




    } else if (currentUrl.indexOf("hulu.com") != -1 && currentUrl.indexOf("=https://www.hulu.com") == -1) {
        console.log("ran");
        makeParty();


    } else {
        const uid = currentUrl.substring(currentUrl.indexOf("joinParty/") + "joinParty/".length, currentUrl.indexOf("?url"));
        chrome.storage.local.set({ uid: uid }, () => {
            const url = currentUrl.substr(currentUrl.indexOf("?url=") + "?url=".length); // this isn't great but its fine for now
            chrome.storage.local.set({ url: url }, () => {
                chrome.storage.local.get(["url", "uid"], (val) => console.log(val));
                window.location.href = url;

            })

        });

    }



}

window.onload = onLoadFunc;