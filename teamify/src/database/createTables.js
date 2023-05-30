var mysql = require('mysql');
const con2 = require('./pool.js');

con2.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = `CREATE TABLE IF NOT EXISTS genres (
    genre_id INT NOT NULL PRIMARY KEY,
    number_of_tracks INT,
    parent INT,
    title VARCHAR(255),
    top_level INT
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Genres Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS albums (
    album_id INT NOT NULL PRIMARY KEY,
    album_comments INT,
    album_date_created VARCHAR(255),
    album_date_released VARCHAR(255),
    album_producer VARCHAR(255),
    album_title VARCHAR(255),
    album_tracks INT,
    artist_name VARCHAR(255),
    tags VARCHAR(3000)
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Albums Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS track_genres (
    genre_id INT NOT NULL,
    track_id INT NOT NULL,
    CONSTRAINT PK_track_genres PRIMARY KEY (genre_id,track_id)
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Track Genres Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS artists (
    artist_id INT NOT NULL PRIMARY KEY,
    artist_name VARCHAR(255),
    artist_active_year_begin INT(4),
    artist_location VARCHAR(350),
    artist_associated_labels VARCHAR(255),
    artist_favorites INT,
    artist_handle VARCHAR(255),
    tags VARCHAR(5000)
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Artists Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS playlists (
    list_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    list_name VARCHAR(255),
    user_id INT,
    list_description VARCHAR(255),
    list_visibility INT DEFAULT 0,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT playlists_name_user UNIQUE (list_name,user_id)
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Playlists Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS tracks (
    track_id INT NOT NULL PRIMARY KEY,
    album_id INT,
    album_title VARCHAR(255),
    artist_id INT,
    artist_name VARCHAR(255),
    tags VARCHAR(5000),
    track_date_created VARCHAR(255),
    track_date_recorded VARCHAR(255),
    track_duration DOUBLE,
    track_title VARCHAR(255),
    track_number INT,
    track_genres VARCHAR(5000)
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Tracks Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS list_tracks (
    list_id INT NOT NULL,
    track_id INT NOT NULL,
    CONSTRAINT PK_list_track PRIMARY KEY (list_id,track_id)
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("List Tracks Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS reviews (
    review_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    list_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DOUBLE(3,2),
    comment VARCHAR(255),
    hidden INT DEFAULT 0,
    date_request_received DATETIME,
    date_notice_sent DATETIME,
    date_dispute_received DATETIME,
    dispute_message VARCHAR(255),
    report_message VARCHAR(255),
    time_created DATETIME DEFAULT CURRENT_TIMESTAMP
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Reviews Table created");
  });
  sql = `CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(100),
    user_email VARCHAR(100),
    isActive INT DEFAULT 0,
    isAdmin INT DEFAULT 0
  )`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Users Table created");
  });

  /*sql = `ALTER TABLE playlists ADD CONSTRAINT MaxPlaylists CHECK (NOT EXISTS (SELECT user_id FROM playlists GROUP BY user_id HAVING COUNT(*)>20))`;
  con2.query(sql, function (err, result) {
    if (err) throw err;
      console.log("Check added to playlists");
  });*/
});