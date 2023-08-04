//create a variable for mysql
const mysql=require('mysql');

const express = require('express');
var app=express();
/**
 * configuration cors
 */
app.all('*',function(req,res,next){
    if(!req.get('Origin'))return next();
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
    next();
});



var bodyParser= require('body-parser')
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
    }));


    //connection with database
var mysqlConnection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_db'
});
mysqlConnection.connect((err)=>{
    if(!err){
        console.log('db connect successfuly');
    }else{
        console.log('db connect rufus:'+JSON.stringify(err,undefined,2));
    }
});



//api for add etudiants
// Add a new user  
app.post('/etudiant/add/', function (req, res) {
    
    let user = req.body;
   // console.log(req);
    if (!user) {
       
    return res.status(400).send({ error:true, message: 'Acun data posted' });
    }
    mysqlConnection.query("INSERT INTO etudiants SET ? ",user, function (error, results, fields) {
    if (error) throw error;
    
    return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});

//api for list etudiants;
app.get('/etudiants', function (req, res) {
	console.log("all");
    
    mysqlConnection.query('SELECT * FROM ETUDIANTS', 
    function (error, results, fields) {
        if (error) throw error;
        
        return res.send({ error: false, data: results, message: 'list.' });
});
}
);

//api for get student by id
app.get('/etudiant/:id', 
    function (req, res) {
        let etudiant_id = req.params.id;
        if (!etudiant_id) {
            
            return res.status(400).send({ error: true, message: 'id invalide' });
        }
        mysqlConnection.query('SELECT * FROM ETUDIANTS where id=?', etudiant_id, function (error, results, fields) {
        if (error) throw error;
        
            return res.send({ error: false, data: results[0], message: 'etudiant liste' });
        });
});

//api for detele ETUDIANT

app.delete('/etudiant/delete/:id', function (req, res) {
    let e_id = req.params.id;
	
    if (!e_id) {
       
        return res.status(400).send({ error: true, message: 'id vide' });
    }
    mysqlConnection.query('DELETE FROM ETUDIANTS WHERE id = ?', [e_id], function (error, results, fields) {
    if (error) throw error;
        
        return res.send({ error: false, data: true, message: 'User has been updated successfully.' });
    });
}); 

//API for upadata etudiant;
//  Update user with id
app.put('/etudiant/update/:id', function (req, res) {
    let user_id = req.params.id;
    let user = req.body;
    if (!user_id || !user) {
        
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    mysqlConnection.query("UPDATE ETUDIANTS SET ? WHERE id = ?", 
        [user, user_id], function (error, results, fields) {
        if (error) throw error;
       
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});

/**
 * authentification
 */

app.post('/auth/',function (req,res){
    let auth_user = req.body;
    mysqlConnection.query('SELECT * FROM ETUDIANTS where nom=? and prenom=?', [auth_user.nom,auth_user.prenom], function (error, results, fields) {
        if (error) throw error;
        if(results[0]){
            return res.send(results);
        }else{
            return res.send(false);
        }
        
    });

});

//run the server express
app.listen(3000,()=>console.log('express server is running on:http://localhost:3000/'));
//module.exports = app;
