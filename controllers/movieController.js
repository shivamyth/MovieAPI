const fs = require('fs');
const fetch = require('node-fetch');
const path = require('path');
const API_KEY = "68fd98ab";
const directoryPath = path.join(__dirname, '../movies');


module.exports.getOMDb = function(req,res){
    let MOVIE_ID = req.params.id;
    const id = MOVIE_ID.substring(2);
    fetch(`http://www.omdbapi.com/?i=${MOVIE_ID}&apikey=${API_KEY}&plot=full`)
        .then(response => response.json())
        .then(data => {
            var obj = {
                description:data.Plot,
                duration:data.runtime,
                id:id,
                imdbId:data.imdbID,
                languages:data.Language,
                productionYear:data.Year,
                studios:data.Production,
                title:data.Title,
                Ratings:data.Ratings
            }
            fs.writeFile(`./movies/${obj.id}.json`, JSON.stringify(obj,null,4), function (err) {
                if (err) return console.log(err);
            });
            return res.json(200,obj);
        })
        .catch(err=>{
            return res.json(500,{
                message:"Internal Server Error",
                err:err
            })
        })
}



module.exports.getFromJson =  function(req,res){
    fs.promises.readdir(directoryPath)
        .then(files=>{
            files.forEach(function (file) {
                fs.readFile(`./movies/${file}`,function(err,data){
                    if(err){
                        return res.json(500,{
                            message:"Internal Server Error"
                        });
                    }
                    var findData = JSON.parse(data);
                    var wantedKey = Object.getOwnPropertyNames(req.query)[0]; 
                    var wantedVal = req.query[wantedKey];
                    if(findData.hasOwnProperty(wantedKey) && findData[wantedKey].toLowerCase() === wantedVal.toLowerCase()) {
                        return res.json(200,findData);
                    }
                });
            });
        })
        .catch(err=>{
            res.json(500,{
                message:"Interval Server Error",
                err
            });
        });
}




