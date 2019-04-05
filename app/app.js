//Exemplo de Web Service REST utilizando NodeJS e MongoDB em Containers Docker

var express = require('express');
var mongo = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//MongoDB connection
var mongoaddr = 'mongodb://' + process.env.MONGO_PORT_27017_TCP_ADDR + ':27017/gameapi';
console.log(mongoaddr);
mongo.connect(mongoaddr);

//collection body
var taskListSchema = mongo.Schema({
	game_name : { type: String }, 
	release_year :  { type: Number },
	platform :  { type: String },
	description :  { type: String },
	game_img_url :  { type: String },
	updated_at: { type: Date, default: Date.now },
});

//app model
var Model = mongo.model('Games', taskListSchema);

//GET - return all
app.get("/api/game", function (req, res) {
	Model.find(function(err, todos) {
		if (err) {
			res.json(err);
		} else {
			res.json(todos);
		}
	})
});

//GET param - return by name
app.get("/api/game/name/:game_name?", function (req, res) {
	var game_name = req.params.game_name;
	Model.find({game_name: '/'+game_name+'/i'}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log(regs);
			res.json(regs);
		}
	});
});

//GET param - return by platform
app.get("/api/game/platform/:platform?", function (req, res) {
	var platform = req.params.platform;
	Model.find({platform: '/'+platform+'/i'}, function(err, regs) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			res.json(regs);
		}
	});
});

//POST - add um registro
app.post("/api/game", function (req, res) {
	var register = new Model({
		'game_name' : req.body.game_name,
		'release_year' :  req.body.release_year,
		'platform' :  req.body.platform,
		'description' :  req.body.description,
		'game_img_url' :  req.body.game_img_url
	});
	register.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		}
	});
	res.send(register);
	res.end();
});

//PUT - update
app.put("/api/game/:id", function (req, res) {
	Model.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err)  {
    	return next(err);
    } else {
    	res.json(post);	
    }
  });
});

//DELETE - Delet this
app.delete("/api/game/:id", function (req, res) {
 Model.findByIdAndRemove(req.params.id, req.body, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});	

//listener
app.listen(8080, function() {
	console.log('Working!');
});


