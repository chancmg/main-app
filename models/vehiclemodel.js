var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mongoosePaginate=require('mongoose-paginate');
var vehicleSchema=new Schema({
	_id:Number,
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
vehicleSchema.plugin(mongoosePaginate);
module.exports=mongoose.model('Vehicledata',vehicleSchema);
