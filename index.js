var express=require('express');
var app=express();
var httphelper=require('./makerequest.js');
var bodyParser=require('body-parser');
var vmodel=require('./models/vehiclemodel.js');
var url="http://59.144.132.170/RBSKAPI/rest/CallService/All_vehicles";



//using bodyParser
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

//importing moongoose
var mongoose=require('mongoose');

//setup default mongoose connection
mongoose.connect('mongodb://localhost/vehicle');

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

///get json from url
httphelper.getresponse(url,function(body)
{
	if(body.success)
	{
		console.log(body.message);
		var vehiclelist=body.vehicle_list;

		var count=0;
		console.log("total vehicles:"+vehiclelist.length);

//insert if not exist or update
for(var i=0;i<vehiclelist.length;i++)
{
	count++;
	var query={'vehiclenumber':vehiclelist[i].vehicleno};
	vmodel.findOneAndUpdate(query,vehiclelist[i],{upsert:true},function(err,doc){
		if(err)
			console.log(err);
	});

}
console.log("total inserted or updated"+count);
	/*	vmodel.collection.insertMany(vehiclelist,function(err,res){
			if(err)
				console.log(err);
		});*/
	}
});

//Routes for api
var router=express.Router();

//middleware to use for all requests
router.use(function(req,res,next){
	console.log('API call! Something happening');
	next();
});



//Route '/api' GET method
router.get('/',function(req,res)
{
	res.json({message:'success'});
});


//Route '/api/allvehicles' GET method to get all vehicle details

router.route('/allvehicles').get(function(req,res)
{
	vmodel.find(function(err,data)
{
	if(err)
		res.send(err);
	res.json(data);
});
});

//Route 'api/vehicles/:vehiclenumber'  GET method to get vehicle details by Vehicle number

router.route('/vehicles/:vehiclenumber').get(function(req,res)
{
	vmodel.find({'vehiclenumber':req.params.vehiclenumber},function(err,data)
{
	if(err)
		res.send(err);
	res.json(data);
});
});

//Route 'api/vehicles/?page=pagenumber'  GET method to get vehicle details limit by page number

router.route('/vehicles').get(function(req,res)
{
	s=10*(req.query.page-1);
	vmodel.find().skip(s).limit(10).exec('find',function(err,result)
{
	if(err)
		res.send(err);
	res.json(result);
});
});

app.get('/',function(req,res)
{
	res.send("Its working!");
});

app.use('/api',router);
app.listen(3000);
