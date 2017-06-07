var request=require('request');

module.exports.getresponse=function (url,callback){
	request({
		url:url,
		method:'POST',
		json:true
	},function(error,res,body)
	{
		if(error)
		{
			console.log(error);
			console.log(res.statusCode)
		}
		else
		{
			callback(body);
		}
	});
}