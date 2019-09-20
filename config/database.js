if(process.env.NODE_ENV  === 'production'){
	module.exports ={
		mongoURL:'mongodb://profileme:profileme1@ds353957.mlab.com:53957/profileme'
 
	}
}else{
		module.exports = {
		mongoURL :'mongodb://localhost:27017/profileMe'
	}
}

