const express = require('express');
const app = express();
const mysql = require('mysql');
const multer = require('multer');
let upload = multer({ storage: multer.memoryStorage() });
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));
app.use(express.static('views'))
app.set('view engine', 'ejs');
let PORT=3000;

const connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "root",
	password: "sreekanth",
	port: "3306",
	database: "mydb"
});

connection.connect(function (err) {
	if (err) throw err;
	console.log("Connected to DB");
});

app.post('/login1', function (req, res) {
	let username = req.param('username');
	let password = req.param('password');
	console.log(username,password);
	connection.query(`select * from faculty where username like '${username}' and password like '${password}'`, function (err, result) {
		console.log(result);
		if (err) {
			return res.end('Error Occurred while loggin in!');
		}
		if (result.length === 0)
		return res.redirect('http://localhost:3000/alert1.html');
		else
			res.redirect('http://localhost:3000/f_home.html');
	});
});

app.post('/login2', function (req, res) {
	let username = req.param('username');
	let password = req.param('password');
	console.log(username,password);
	connection.query(`select * from admin where username like '${username}' and password like '${password}'`, function (err, result) {
		console.log(result);
		if (err) {
			return res.end('Error Occurred while loggin in!');
		}
		if (result.length === 0)
			return res.redirect('http://localhost:3000/alert.html');
		else
			res.redirect('http://localhost:3000/a_home.html');
	});
});


app.post('/addfaculty', function (req, res) {
	let fno = req.param('fno');
	let name = req.param('name');
	let gender = req.param('gender');
	let email = req.param('email');
	let phone = req.param('phone');
	console.log(fno,name,gender,email,phone);
	connection.query(`insert into faclist values(${fno},'${name}','${gender}','${email}',${phone})` , function (err, result) {
		console.log(result);
		if (err) {
			return res.end('Error Occurred while inserting record!');
		}
		else{
			return res.end('Successfully entered faculty details');
		}
	});
});	
app.post('/removefaculty', function (req, res) {
	let fno = req.param('fno');
	connection.query(`delete from faclist where F_NO = ${fno}` , function(err, result){
		console.log(err);
		if (err) {
			return res.end('Error Occurred while deleting record!');
		}
		else{
			return res.end('Successfully deleted faculty from database');
		}
	});
});	

app.post('/addcourse', function (req, res) {
	let code = req.param('code');
	let cred = req.param('cred');
	let cname = req.param('cname');
	
	console.log(code,cname);
	connection.query(`insert into courselist values(${code},'${cred}','${cname}')` , function (err, result) {
		console.log(result);
		if (err) {
			return res.end('Error Occurred while inserting record!');
		}
		else{
			return res.end('Successfully entered faculty details');
		}
	});
});	
app.post('/removecourse', function (req, res) {
	let code = req.param('code');
	connection.query(`delete from courselist where code = ${code}` , function(err, result){
		console.log(err);
		if (err) {
			return res.end('Error Occurred while deleting record!');
		}
		else{
			return res.end('Successfully deleted faculty from database');
		}
	});
});	
app.listen(PORT,()=>console.log(`Listening to port ${PORT}`))