//require lib
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const line = require('@line/bot-sdk');
const cors = require('cors');
//config server
const PORT = process.env.PORT || 5000
const config = {
    channelAccessToken: 'osKcx5cEgJzfcTPOFqTyYbe/hrYA+fxNY4HqE7HzJYIwcBBtkNdf1a8Ja6SD8dXiiYz9XkVYyfVpQmwHwqdR1U0x/x9RUx/8BlrYVJaG39aLEXADJda6neP87hVVWmD6MqD/q3PeZ7DardvnIDEdsQdB04t89/1O/w1cDnyilFU=',
    channelSecret: '68a1609f570a62390629a9e5c705f742'
  };
const lineClient = new line.Client(config);
const userid = [];
//config express
app.use(morgan('dev'));
app.use(cors());
app.options('*', cors());
//route
app.get('/',(req,res)=>{
    console.log("hello");
    res.send("Welcome to Line Bot API");
});
app.post('/webhook',line.middleware(config),(req,res)=>{
    console.log(req.body.events);
    
    if(userid.indexOf(req.body.events[0].source.userId)<0){
        userid.push(req.body.events[0].source.userId);
    }
    console.log(userid);
    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

app.post('/alert/login/facebook',bodyParser.json(),(req,res)=>{

    console.log(req.body);

    lineClient.multicast(userid, [{
        "type": "image",
        "originalContentUrl": req.body.img,
        "previewImageUrl": req.body.img
    },{
        "type": "text",
        "text":req.body.name
    }]);
    res.status(200).send("Success");
});

//Line handleEvent
function handleEvent(event) {
    let message = [
        'สวัสดีค่ะ ที่รัก',
        `hi ที่รัก`,
        'hi honey'
    ];
    let ranNum = Math.floor(Math.random() * (21 - 1) ) + 1;
    console.log(ranNum);
    if(event.message.type == 'sticker'){
        return lineClient.replyMessage(event.replyToken,{ 
            type: 'sticker',
            stickerId: ''+ranNum,
            packageId: '1' });
    }else if (event.type !== 'message' || event.message.type !== 'text') {
      return Promise.resolve(null);
    }
    if(event.message.text.toLowerCase().includes("สวัสดี") || event.message.text.toLowerCase().includes("hi") || event.message.text.toLowerCase().includes("hello")){
        return lineClient.replyMessage(event.replyToken, {
            type: 'text',
            text: message[Math.floor(Math.random()*message.length)]
          });
    }else
    return lineClient.replyMessage(event.replyToken, { 
        type: 'sticker',
        stickerId: ''+ranNum,
        packageId: '1' });
  }
//start server
 var server = app.listen(PORT, function() {
    console.log('Line Bot Server is running on port '+PORT+' at '+new Date());
});