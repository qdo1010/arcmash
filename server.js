const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
const path = require('path')

const MongoClient = require("mongodb").MongoClient;
var serveIndex = require('serve-index')

const url = "mongodb+srv://fungame:Northeastern2019!@cluster0-u4iiy.mongodb.net/test?retryWrites=true&w=majority"
let db;

app.use('/examples', express.static('src/examples'), serveIndex('src/examples', {'icons': true}))

var cors = require('cors');
app.use(cors({credentials: true, origin: true}));
app.get("/",function(req,res){
res.send("leaderboard");
});

(async() => {
  let client = await MongoClient.connect(
	url,
	{useNewUrlParser: true }
);

db = client.db("arcdragdrop");

app.listen(PORT, async function() {
 console.log(`Listening on Port ${PORT}`);
 if (db) {
    console.log("connected");
  }
 });
})();


app.use(express.static(path.join(__dirname, 'src')));
app.get('/src',function(req,res){
  res.sendFile(path.join(__dirname+'/src/index.html'));
});

//Route to create new player
app.post("/arcdragdrop",async function(req,res){
	let {username, start_time, session} = req.body;
	const alreadyExisting = await db
        	.collection("arcdragdrop")
	   	.findOne({username: username})

	if (alreadyExisting){
		res.send({status: false, msf: "player usename already exists"});
	}
	else{
	//create new
		await db.collection("arcdragdrop").insertOne({username, start_time, session});
//		console.log(`Created player ${username}`);
		res.send({ status:true, msg:"player created"});
	}
	});

app.put("/arcdragdrop",async function(req,res){
let {username, start_time, session} = req.body;
//check if username already exists
const alreadyExisting = await db
	.collection("arcdragdrop")
	.findOne({username:username});
if(alreadyExisting){
//update player object w the username
	await db
		.collection("arcdragdrop")
		.updateOne({username},{$set:{username, start_time, session}});
//	console.log(`Player ${username} score updated to ${score}`);
	res.send({status:true, msg:"player score updated"});
}
else{
	res.send({status:false, msg:"player username not found"});
}
});

//delete player
app.delete("/arcdragdrop",async function(req,res){
	let {username, start_time, session} = req.body;
	//check if usrname already exists
	const alreadyExisting = await db
		.collection("geode")
		.findOne({username:username});
	if(alreadyExisting){
		await db.collection("geode").deleteOne({username});
//		console.log(`Player ${username} deleted`);
		res.send({ status:true, msg:"player deleted"});
	}
	else{
		res.send({status: false, msg:"username not found"});
	}
});

//Leaderboard
//access the leaderboard
app.get("/arcdragdrop",async function(req,res){
//retrieve lim from the query string info
	let {lim} = req.query;
	db.collection("arcdragdrop")
	  .find()
	  .sort({hc:-1})	
	  .limit(parseInt(lim,1))
	  .toArray(function(err, result){
		if(err)
			res.send({status:false, msg:"failed to retrieve players"});
		//console.log(Array.from(result));
		res.send({status:true, msg:result });;
	});
});
