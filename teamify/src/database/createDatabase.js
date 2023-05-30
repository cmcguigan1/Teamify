var mysql = require('mysql');
const con = require('./pool.js');

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  con.query("CREATE DATABASE se3316_lab3", function (err, result) {
    if (err) throw err;
    console.log("Database created");
  });
});