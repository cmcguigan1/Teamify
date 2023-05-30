const fs = require('fs');
const { parse } = require("csv-parse");
var mysql = require('mysql');
const pool = require('./pool.js');

fs.createReadStream("../../lab3-data/genres.csv")
.pipe(parse({ delimiter: ",", from_line: 2 }))
.on("data", function (row) {
    addRow(row, 'genres');
})
.on("end", function () {
    console.log("finished");
})
.on("error", function (error) {
    console.log(error.message);
});

fs.createReadStream("../../lab3-data/raw_albums.csv")
.pipe(parse({ delimiter: ",", from_line: 2 }))
.on("data", function (row) {
    addRow(row, 'albums');
})
.on("end", function () {
    console.log("finished");
})
.on("error", function (error) {
    console.log(error.message);
});

fs.createReadStream("../../lab3-data/raw_artists.csv")
.pipe(parse({ delimiter: ",", from_line: 2 }))
.on("data", function (row) {
    addRow(row, 'artists');
})
.on("end", function () {
    console.log("finished");
})
.on("error", function (error) {
    console.log(error.message);
});

fs.createReadStream("../../lab3-data/raw_tracks.csv")
.pipe(parse({ delimiter: ",", from_line: 2 }))
.on("data", function (row) {
    addRow(row, 'tracks');
})
.on("end", function () {
    console.log("finished");
})
.on("error", function (error) {
    console.log(error.message);
});


// Add a new row into a table, second argument specifies which table
function addRow(data, table) {
    let insertQuery = "";
    let query = null;
    if(table == 'genres'){
        insertQuery = 'INSERT INTO ?? (??,??,??,??,??) VALUES (?,?,?,?,?)';
        query = mysql.format(insertQuery,["genres","genre_id","number_of_tracks","parent","title","top_level",data[0],data[1],data[2],data[3],data[4]]);
    }
    else if(table == 'albums'){
        insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?)';
        query = mysql.format(insertQuery,["albums","album_id","album_comments","album_date_created","album_date_released","album_producer","album_title","album_tracks","artist_name","tags",data[0],data[1],data[2],data[3],data[11],data[12],data[13],data[16],data[18]]);
    }
    else if(table == 'artists'){
        insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?)';
        query = mysql.format(insertQuery,["artists","artist_id","artist_name","artist_active_year_begin","artist_location","artist_associated_labels","artist_favorites","artist_handle","tags",data[0],data[18],Number(data[1]),data[15],data[3],data[9],data[11],data[24]]);
    }
    else{
        let number_duration = Number(data[22].replace(':', '.'));
        if(isNaN(number_duration)){
            return;
        }
        let genres = data[27];
        let genresNames = [];
        let genresIds = [];
        if(genres != ""){
            let temp = genres.replace('[{', '["{');
            let temp2 = temp.replace('}, {', '}", "{');
            let temp3 = temp2.replace('}]', '}"]');
            for(let genre of JSON.parse(temp3)){
                let temp = genre.split(", ");
                let temp_1 = temp[0];
                let temp_2 = temp[1];
                let temp2 = temp_1.split(": ")[1];
                let temp_3 = temp_2.split(": ")[1];
                /*const regex = /'/ig;
                let temp3 = temp2.replaceAll(regex, "");
                let temp4 = temp_3.replaceAll(regex, "");*/
                //start
                let temp3 = temp2.replace(/'/g, "");
                let temp4 = temp_3.replace(/'/g, "");
                //end
                genresIds.push(Number(temp3));
                genresNames.push(temp4);
            }
        }
        if(genresNames.length == 0){
            genresNames = "";
        }
        else {
            //let obj = { genres: genresNames }
            genresNames = JSON.stringify(genresNames);
        }
            for(let id of genresIds){
                insetIntoTrackGenresQuery = 'INSERT INTO ?? (??,??) VALUES (?,?)';
                tracksGenresQuery = mysql.format(insetIntoTrackGenresQuery,["track_genres","genre_id","track_id",id,data[0]]);
                
                pool.query(tracksGenresQuery,(err, response) => {
                    if(err) {
                        console.error(err);
                        return;
                    }
                    // rows added
                    console.log(response.insertId);
                });
            }
        
        insertQuery = 'INSERT INTO ?? (??,??,??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
        query = mysql.format(insertQuery,["tracks","track_id","album_id","album_title","artist_id","artist_name","tags","track_date_created","track_date_recorded","track_duration","track_title","track_number","track_genres",data[0],(data[1] === '' ? null : data[1]),data[2],data[4],data[5],data[13],data[19],data[20],number_duration,data[37],data[35],genresNames]);
    }
   
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log(response.insertId);
    });
}
