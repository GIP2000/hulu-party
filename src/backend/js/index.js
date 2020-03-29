const app = require('express')();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const { v4: uuidv4 } = require('uuid');

app.set('view engine', 'ejs');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    next();
});



app.get("/startParty", (req, res) => {
    const url = req.query.url;
    const uid = uuidv4();
    console.log(uid);
    res.json({ url, uid });

});


app.get("/joinParty/:uid", (req, res) => {
    const uid = req.params.uid;
    const url = req.query.url;
    return res.render("party", { url, uid })

})




const nsp = io.of('/hulu-party');

nsp.on("connection", (socket) => {
    socket.on("identify", (uid, callback) => {
        //add a force pause and chose someone to send the timestmp for this boi also this is broken now fix this 

        
        const rooms = io.nsps["/hulu-party"].adapter.rooms[uid];
        socket.join(uid);
        // console.log(io.sockets.connected[Object.keys(rooms.sockets)[0].substring(Object.keys(rooms.sockets)[0].indexOf("/hulu-party#")+"/hulu-party#".length)]);
        console.log(rooms); 
        console.log("identify");
        if (rooms != undefined) {
            console.log("1");
            // io.sockets.connected[Object.keys(rooms.sockets)[0].substring(Object.keys(rooms.sockets)[0].indexOf("/hulu-party#")+"/hulu-party#".length)].emit("timeStampChange",0); 
            // io.to(Object.keys(rooms.sockets)[0].substring(Object.keys(rooms.sockets)[0].indexOf("/hulu-party#")+"/hulu-party#".length)).emit("timeStampChange",0);
            socket.to(uid).emit("requestTimeStamp", true);
        } 

       
    });

    socket.on("paused", paused => {
        const room = Object.keys(socket.rooms)[1];
        socket.to(room).emit("paused", paused);

    });

    socket.on("timeStampChange", timeStamp => {
        const room = Object.keys(socket.rooms)[1];
        socket.to(room).emit("timeStampChange", timeStamp);
    });
})



http.listen(3000, () => {
    console.log("listening on port 3000");
});