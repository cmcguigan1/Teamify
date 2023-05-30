const express = require('express');
const app = express();
const mysql = require('mysql');
const pool = require('../teamify/src/database/pool.js');
const Joi = require('joi');
const { equal } = require('joi');

const port = process.env.PORT || 3100;

// Enabling express to parse JSON objects by default
app.use(express.json());

/* Tracks */
// Get all tracks
app.get("/api/open/tracks",(req,res) => {
    let selectQuery = 'SELECT * FROM ??';
    let query = mysql.format(selectQuery,["tracks"]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

// Get a track based on a specific id
app.get("/api/open/tracks/:id",(req,res) => {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';    
    let query = mysql.format(selectQuery,["tracks","track_id", req.params.id]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        if(data.length == 0){
            res.status(404).send('Track Not Found');
            return;
        }
        res.send(data);
    });
});


// Getting all tracks matching certain searched criterias
app.get("/api/open/tracks/search/all",(req,res) => {
    let track = req.query.trackBy;
    let artist = req.query.artistBy;
    let genre = req.query.genreBy;
    let album = req.query.albumBy;
    let selectQuery = '';
    let query = '';
    let potentialSearchParams = [track, artist, genre, album];
    let searchParam = potentialSearchParams.filter((substring) => substring);
    if(searchParam.length == 4){
        selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ? AND ?? LIKE ? AND ?? LIKE ?) LIMIT 100';
        query = mysql.format(selectQuery,["tracks","track_title",`${track}%`,"artist_name",`${artist}%`,"track_genres",`%${genre}%`,"album_title",`${album}%`]);
    }
    else if(searchParam.length == 3){
        if(artist && genre && album){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","artist_name",`${artist}%`,"track_genres",`%${genre}%`,"album_title",`${album}%`]);
        }
        else if(artist && genre && track){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","artist_name",`${artist}%`,"track_genres",`%${genre}%`,"track_title",`${track}%`]);
        }
        else if(album && genre && track){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_title",`${track}%`,"track_genres",`%${genre}%`,"album_title",`${album}%`]);
        }
        else{
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","artist_name",`${artist}%`,"track_title",`${track}%`,"album_title",`${album}%`]);
        }
    }
    else if(searchParam.length == 2){
        if(artist && genre){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","artist_name",`${artist}%`,"track_genres",`%${genre}%`]);
        }
        else if(genre && track){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_genres",`%${genre}%`,"track_title",`${track}%`]);
        }
        else if(genre && album){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_genres",`%${genre}%`,"album_title",`${album}%`]);
        }
        else if(track && album){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_title",`${track}%`,"album_title",`${album}%`]);
        }
        else if(track && artist){
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_title",`${track}%`,"artist_name",`${artist}%`]);
        }
        else{
            selectQuery = 'SELECT * FROM ?? WHERE (?? LIKE ? AND ?? LIKE ?) LIMIT 100';
            query = mysql.format(selectQuery,["tracks","artist_name",`${artist}%`,"album_title",`${album}%`]);
        }
    }
    else if(searchParam.length == 1){
        if(track){
            selectQuery = 'SELECT * FROM ?? WHERE ?? LIKE ? LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_title",`${track}%`]);
        }
        else if(album){
            selectQuery = 'SELECT * FROM ?? WHERE ?? LIKE ? LIMIT 100';
            query = mysql.format(selectQuery,["tracks","album_title",`${album}%`]);
        }
        else if(artist){
            selectQuery = 'SELECT * FROM ?? WHERE ?? LIKE ? LIMIT 100';
            query = mysql.format(selectQuery,["tracks","artist_name",`${artist}%`]);
        }
        else{
            selectQuery = 'SELECT * FROM ?? WHERE ?? LIKE ? LIMIT 100';
            query = mysql.format(selectQuery,["tracks","track_genres",`%${genre}%`]);
        }
    }
    else{
        res.status(400).send({ message: "No Search Criteria Specified" });
    }

    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        if(data.length == 0){
            res.status(404).send({ message: "No Tracks Found" });
            return;
        }
        res.send(data);
    });  
});

/* Public Playlists */
// Getting up to 10 public playlists
app.get('/api/open/playlists', (req,res) => {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ? ORDER BY ?? LIMIT 10';
    let query = mysql.format(selectQuery,["playlists","list_visibility",1,"last_modified"]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

// Getting the details about a list of public playlist based on a list of ids
app.get('/api/open/playlistDetails/:list', (req,res) => {
    const regex = /"/ig;
    let strippedList = req.params.list.replace("[", "").replace("]", "").replaceAll(regex, "");
    let splitItems = strippedList.split(", ");
    let inTuple = `('${splitItems.join("','")}')`;
    let query = `SELECT playlists.list_id, playlists.list_name, users.user_name, playlists.last_modified, COUNT(list_tracks.track_id) AS numOftracks, SUM(tracks.track_duration) AS duration, AVG(reviews.rating) AS averageRating
                    FROM playlists
                    LEFT JOIN list_tracks ON playlists.list_id = list_tracks.list_id
                    LEFT JOIN tracks ON list_tracks.track_id = tracks.track_id
                    LEFT JOIN reviews ON playlists.list_id = reviews.list_id
                    LEFT JOIN users ON playlists.user_id = users.user_id
                    WHERE playlists.list_id IN ${inTuple}
                    GROUP BY list_id`;
    pool.query(query, (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

// Getting the details about a public playlist
app.get('/api/open/playlistDetails/specific/:id', (req,res) => {
    let selectQuery = `SELECT playlists.list_id, playlists.list_name, playlists.list_description, playlists.list_visibility, users.user_name, playlists.last_modified, COUNT(list_tracks.track_id) AS numOftracks, SUM(tracks.track_duration) AS duration, AVG(reviews.rating) AS averageRating
                    FROM playlists
                    LEFT JOIN list_tracks ON playlists.list_id = list_tracks.list_id
                    LEFT JOIN tracks ON list_tracks.track_id = tracks.track_id
                    LEFT JOIN reviews ON playlists.list_id = reviews.list_id
                    LEFT JOIN users ON playlists.user_id = users.user_id
                    WHERE playlists.list_id = ?
                    GROUP BY list_id`;
    let query = mysql.format(selectQuery,[req.params.id]);
    pool.query(query, (err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

// Get Tracks associated with a playlist
app.get('/api/open/playlists/:id', (req,res) => {
    let selectQuery = 'SELECT * FROM list_tracks JOIN tracks ON list_tracks.track_id = tracks.track_id JOIN playlists ON list_tracks.list_id = playlists.list_id WHERE list_tracks.list_id = ?';
    let query = mysql.format(selectQuery,[req.params.id]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

/* Private Playlists */
// Get all playlists associated with the user's id
app.get('/api/secure/playlists/:userId', (req,res) => {
    let selectQuery = 'SELECT * FROM playlists WHERE user_id = ?';
    let query = mysql.format(selectQuery,[req.params.userId]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
});

// Returning how many lists a user has 
app.get('/api/secure/playlistCount/:userId', (req,res) => {
    let selectQuery = 'SELECT COUNT(list_id) AS numOfPlaylists FROM playlists WHERE user_id = ? GROUP BY user_id';
    let query = mysql.format(selectQuery,[req.params.userId]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(data);
    });
})

// Create a new list
app.post('/api/secure/playlists/:userId', (req,res) => {
    const schema = Joi.object({
        name: Joi.string().regex(/^[^<>;:*]*$/).min(1).max(255).required(),
        description: Joi.string().regex(/^[^<>;:*]*$/).min(0).max(255),
        visibility: Joi.number().integer().min(0).max(1)
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
    let query = mysql.format(insertQuery,["playlists","list_name","user_id","list_description","list_visibility",req.body.name,req.params.userId,(req.body.description ? req.body.description : null),(req.body.visibility ? req.body.visibility : 0)]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            if(err.errno == 1062){
                res.status(400).send({ message: "User already has a list saved by this name" });
                return;
            }
            return;
        }
        res.send(response);
    });
});

// Delete a list and all the instances of list_tracks associated with that list
app.delete('/api/secure/playlists/:id', (req,res) => {
    let deleteQuery = `DELETE FROM playlists WHERE list_id = ?`;
    let delete_query = mysql.format(deleteQuery, [req.params.id]);
    pool.query(delete_query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        if(response.affectedRows == 0){
            res.status(400).send({ message: "User does not have a playlist saved by that name" });
            return;
        }
    });
    let deleteQuery2 = `DELETE FROM list_tracks WHERE list_id = ?`;
    let delete_query2 = mysql.format(deleteQuery2, [req.params.id]);
    pool.query(delete_query2,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Update playlist fields
app.put('/api/secure/playlists/:id', (req,res) => {
    const schema = Joi.object({
        name: Joi.string().regex(/^[^<>;:*]*$/).min(1).max(255),
        description: Joi.string().regex(/^[^<>;:*]*$/).min(0).max(255),
        visibility: Joi.number().integer().min(0).max(1)
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let updateQuery = `UPDATE playlists SET list_name = ?, list_description = ?, list_visibility = ? WHERE list_id = ?`;
    let query = mysql.format(updateQuery, [req.body.name, req.body.description, req.body.visibility, req.params.id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Replace tracks saved in a given playlist
app.put('/api/secure/playlists/:id/:listOfTracks',(req,res) => {
    // Add new tracks to the list
    let temp = (req.params.listOfTracks).split(",");
    let values = [];
    for(let id of temp){
        values.push([req.params.id,Number(id)]);
    }
    let insertQuery = 'INSERT INTO ?? (??,??) VALUES ?';
    let query = mysql.format(insertQuery,["list_tracks","list_id","track_id",values]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Remove a track from a playlist
app.delete('/api/secure/playlists/deleteTrack/:listId/:trackId', (req,res) => {
    let deleteQuery = `DELETE FROM list_tracks WHERE list_id = ? AND track_id = ?`;
    let delete_query = mysql.format(deleteQuery, [req.params.listId, req.params.trackId]);
    pool.query(delete_query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        if(response.affectedRows == 0){
            res.status(400).send({ message: "Track not found" });
            return;
        }
        res.send(response);
    });
});

/* Add user to the database when sign up */
app.post('/api/open/users', (req,res) => {
    const schema = Joi.object({
        user_name: Joi.string().regex(/^[^<>;:*]*$/).min(1).max(100).required(),
        user_email: Joi.string().regex(/^[^<>;:*]*$/).min(1).max(100).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
    let query = mysql.format(insertQuery,["users","user_name","user_email","isActive","isAdmin",req.body.user_name,req.body.user_email,0,0]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

/* Reviews */
// Create a review on a public playlist
app.post('/api/secure/reviews/:userId', (req,res) => {
    const schema = Joi.object({
        list_id: Joi.number().integer().min(0).required(),
        rating: Joi.number().precision(2).min(0).max(5).required(),
        comment: Joi.string().regex(/^[^<>;:*]*$/).min(1).max(255).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let insertQuery = 'INSERT INTO ?? (??,??,??,??) VALUES (?,?,?,?)';
    let query = mysql.format(insertQuery,["reviews","list_id","user_id","rating","comment",req.body.list_id,req.params.userId,req.body.rating,req.body.comment]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

/* Admin Routes */

// Change site manager priviledges for a user
app.put('/api/admin/users/adminPriviledges', (req,res) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().min(0).required(),
        isAdmin: Joi.number().integer().min(0).max(1).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let updateQuery = `UPDATE users SET isAdmin = ? WHERE user_id = ?`;
    let query = mysql.format(updateQuery,[req.body.isAdmin, req.body.user_id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Get basic info (non sensitive) about all users 
app.get('/api/admin/users', (req,res) => {
    let query = `SELECT user_id, user_name, user_email, isActive, isAdmin FROM users ORDER BY isAdmin DESC, isActive DESC, user_name ASC`;
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Get info about a specfic user
app.get('/api/secure/users/:email', (req,res) => {
    let selectQuery = `SELECT user_id, user_name, user_email, isActive, isAdmin FROM users WHERE user_email = ?`;
    let query = mysql.format(selectQuery,[req.params.email]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});


// Mark a user as “deactivated” or mark as “active” if deactivated
app.put('/api/admin/users/activity', (req,res) => {
    const schema = Joi.object({
        user_id: Joi.number().integer().min(0).required(),
        isActive: Joi.number().integer().min(0).max(1).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let updateQuery = `UPDATE users SET isActive = ? WHERE user_id = ?`;
    let query = mysql.format(updateQuery,[req.body.isActive, req.body.user_id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});


// Mark a review as hidden or unhide a review
app.put('/api/admin/reviews', (req,res) => {
    const schema = Joi.object({
        review_id: Joi.number().integer().min(0).required(),
        hidden: Joi.number().integer().min(0).max(1).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    let updateQuery = `UPDATE reviews SET hidden = ? WHERE review_id = ?`;
    let query = mysql.format(updateQuery,[req.body.hidden, req.body.review_id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Get all the reviews that aren't hidden associated with a public playlist
app.get('/api/open/reviews/:listId', (req,res) => {
    let selectQuery = `SELECT review_id, reviews.user_id, users.user_name, reviews.hidden, users.isActive, rating, comment FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE hidden = 0 AND list_id = ?`;
    let query = mysql.format(selectQuery,[req.params.listId]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

//Get all the reviews, hidden or not, associated with a public list
app.get('/api/admin/reviews/:listId', (req,res) => {
    let selectQuery = `SELECT review_id, reviews.user_id, users.user_name, reviews.hidden, users.isActive, rating, comment FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE list_id = ?`;
    let query = mysql.format(selectQuery,[req.params.listId]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Get all reviews in the database
app.get('/api/admin/reviews', (req,res) => {
    let selectQuery = `SELECT * FROM reviews JOIN users ON reviews.user_id = users.user_id`;
    let query = mysql.format(selectQuery,[req.params.listId]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Getting reviews based on if the DCMA takedown fields are not null
app.get('/api/admin/reviews/DCMA/:field', (req,res) => {
    let selectQuery = "";
    if(req.params.field === "request"){
        selectQuery = `SELECT * FROM reviews WHERE date_request_received IS NOT NULL`;
    }
    else if(req.params.field === "notice"){
        selectQuery = `SELECT * FROM reviews WHERE date_notice_sent IS NOT NULL`;
    }
    else {
        selectQuery = `SELECT * FROM reviews WHERE date_dispute_received IS NOT NULL`;
    }
    
    pool.query(selectQuery,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Getting a user's reviews
app.get('/api/secure/reviews/:userId', (req,res) => {
    let selectQuery = `SELECT * FROM reviews WHERE user_id = ?`;
    let query = mysql.format(selectQuery,[req.params.userId]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Updating a review upon submission of a dispute request
app.put('/api/secure/reviews', (req,res) => {
    const schema = Joi.object({
        review_id: Joi.number().integer().min(0).required(),
        dispute_message: Joi.string().min(1).max(255).invalid(...[">","<","*",";"]).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let currentDate = new Date();
    let updateQuery = `UPDATE reviews SET dispute_message = ?, date_dispute_received = ? WHERE review_id = ?`;
    let query = mysql.format(updateQuery,[req.body.dispute_message, currentDate, req.body.review_id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Updating a review upon a submission of a report
app.put('/api/open/reviews', (req,res) => {
    const schema = Joi.object({
        review_id: Joi.number().integer().min(0).required(),
        report_message: Joi.string().min(1).max(255).invalid(...[">","<","*",";"]).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let currentDate = new Date();
    let updateQuery = `UPDATE reviews SET report_message = ?, date_request_received = ? WHERE review_id = ?`;
    let query = mysql.format(updateQuery,[req.body.report_message, currentDate, req.body.review_id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Updating a review upon a submission of a notice
app.put('/api/open/sendNotice/reviews', (req,res) => {
    const schema = Joi.object({
        review_id: Joi.number().integer().min(0).required()
    });
    const result = schema.validate(req.body);
    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    let currentDate = new Date();
    let updateQuery = `UPDATE reviews SET date_notice_sent = ? WHERE review_id = ?`;
    let query = mysql.format(updateQuery,[currentDate, req.body.review_id]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});

// Get reviews either with a date in the request, notice or dispute column
app.get('/api/admin/filterReviews/:type', (req,res) => {
    let selectQuery = "";
    if(req.params.type === "requests"){
        selectQuery = `SELECT * FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE date_request_received IS NOT NULL`;
    }
    else if(req.params.type === "notices"){
        selectQuery = `SELECT * FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE date_notice_sent IS NOT NULL`;
    }
    else if(req.params.type === "disputes"){
        selectQuery = `SELECT * FROM reviews JOIN users ON reviews.user_id = users.user_id WHERE date_dispute_received IS NOT NULL`;
    }
    else{
        selectQuery = `SELECT * FROM reviews JOIN users ON reviews.user_id = users.user_id`
    }
    
    pool.query(selectQuery,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        res.send(response);
    });
});


//Start your server on a specified port
app.listen(port, ()=>{
    console.log(`Server is runing on port ${port}`)
});