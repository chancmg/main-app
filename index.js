var express=require('express');
var app=express();
var httphelper=require('./makerequest.js');

var url="http://59.144.132.170/RBSKAPI/rest/CallService/All_vehicles"

//importing moongoose 
var mongoose=require('mongoose');

//setup default mongoose connection
mongoose.connect('mongodb://localhost/vehicle');

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema=mongoose.Schema;
var vehicleSchema=new Schema({
	vehiclenumber:Schema.Types.Mixed,
	imeino:Number,
	pollingtime:Date,
	lattitude:Number,
	longitude:Number,
	vehiclespeed:Number,
	vehicledirection:String,
	gpsstatus:String,
	ignitionnumber:String,
	epoch_TIME:Number
});

var vmodel=mongoose.model('Vehiclelist',vehicleSchema);

//get json from url
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

app.get('/',function(req,res)
{
	res.send("Its working!");
});

app.listen(3000);