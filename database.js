const mysql = require('mysql') ;

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'ajency-films'
});
 
connection.connect((err) =>{
	if(!err){
		console.log("Db Connected") ;
	}
	else{
		console.log("Db connection Error!!") ;
	}
});

module.exports = connection ;