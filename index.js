const express = require('express');
const connection = require('./database');
const async = require('async-await');
const path = require('path');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

//Setting the view Engine to ejs
app.set('views', __dirname + '/views/pages/');
app.set('view engine', 'ejs');


// Get index page
app.get('/', (req, res) => {
    res.render('index', {data: ""});
});

// Get movies list(both with or without filters)
app.get('/movies', async (req, res) => {
    try {
        req.query.page = req.query.page || 0;
        _cSql = `select * from movies`;
        result = await getDomain(_cSql);
        var totReords = 0;
        var perPage = 2;
       
        // Get the count of total records in the result object
        Object.keys(result).forEach(function (key) {
            totReords++;
        });
        
    
        // Paging logic
        // Query with the limit of records on each page and offset
        _cSql = _cSql + ` LIMIT 2 OFFSET ${req.query.page * 2}`;
        result = await getDomain(_cSql);

        if (result) {
           // Render the result to allMovies
           res.render('allMovies', {
                movies: result,
                current: req.query.page,
                pages: Math.ceil(totReords / perPage)
            })
        }
        
    }
    catch (error) {
        console.log("Error" + error);
    }
});

// Addition of movie
app.use('/register', async (req, res) => {
    // If method is post , 
    // insert the record into movies table and 
    // upon sucessfull insertion update relationship table.
    if (req.method.toLocaleLowerCase() == "post") {
        try {
            var post = req.body;
            var file = req.files.image;
            var img_name = file.name;

            try {
                // Insert movie into the movies table.
                var resobj = await addMovie(post, file, img_name)
            }
            catch (error) {
                console.log(error) ;
                
            }
            if (resobj) {
                // Upon sucessfull insertion fetch the generated movieid
                var _cSql = `select movieid from movies where title = "${post.title}"`;
                var result = await getDomain(_cSql);
                var movieid = result[0].movieid;
                console.log(movieid);

                // Fetch catid from category with respect to post.language
                _cSql = `select catid from category where value = "${post.language}"`;
                result = await getDomain(_cSql);
                var catid_lang = result[0].catid;

                // Update relationship table with respect to post.language 
                _cSql = "INSERT INTO `relationship`(`catid`,`movieid`)" +
                    "VALUES ('" + catid_lang + "','" + movieid + "')";
                await getDomain(_cSql);

                // Fetch catid from category with respect to post.genre
                _cSql = `select catid from category where value = "${post.genre}"`;
                result = await getDomain(_cSql);
                var catid_genre = result[0].catid;
                
                // Update relationship table with respect to post.genre 
                _cSql = "INSERT INTO `relationship`(`catid`,`movieid`)" +
                    "VALUES ('" + catid_genre + "','" + movieid + "')";
                await getDomain(_cSql);

                res.render('index', { data: "Movie Added Successfully!!" });
            }
        }
        catch (error) {
            console.log(error);
        }
    } else {
        try {
            // Logic to get dynamic dropdown list for language and genre.
            var _cSql = `SELECT value FROM category WHERE type = 'language'`;
            var lang = await getDomain(_cSql);

            var _cSql = `SELECT value FROM category WHERE type = 'genre'`;
            var genre = await getDomain(_cSql);

            res.render("register", { language: lang, genre: genre });
        }
        catch (error) {
            console.error();
        }
    }



});

// Get movies based on filter 
app.use('/filter', async (req, res) => {
    console.log(req.query.page);
    req.query.page = req.query.page || 0;
    req.body.category = req.body.category || req.query.cat ;
    //var category = req.body.category || res.cat
    // if the filter is language or genre
    if (req.body.category == "language" || req.body.category == "genre") {

        var _cSql = `SELECT m.*, b.value as value ` +
            `FROM movies m ` +
            `join relationship a on m.movieid = a.movieid ` +
            `join category b on a.catid = b.catid ` +
            `WHERE b.type = '${req.body.category}'` +
            `order by b.type`;
        var result = await getDomain(_cSql);

        // Paging the records
        var totReords = 0;
        const page = req.query.page || 0;
        Object.keys(result).forEach(function (key) {
            totReords++;
        });
        var _cSql = `SELECT m.*, b.value as value ` +
            `FROM movies m ` +
            `join relationship a on m.movieid = a.movieid ` +
            `join category b on a.catid = b.catid ` +
            `WHERE b.type = '${req.body.category}'` +
            `order by b.type ` +
            `LIMIT 2 OFFSET ${page * 2}`;

        result = await getDomain(_cSql);
        var perpage = 2;
        
        if (result) {
            res.render('allmovies', {
                movies: result,
                current: req.query.page,
                pages: Math.ceil(totReords / perpage),
                category : req.body.category

            })
        }

    }
    else {
        // If the filter is duration or release date
        var _cSql = `select * from movies order by ${req.body.category} asc`;
        var result = await getDomain(_cSql);

        const page = req.query.page || 0;
        // Paging the records
        var totReords = 0;
        req.query.page = req.query.page || 0;
        Object.keys(result).forEach(function (key) {
            totReords++;
        });
        var perpage = 2;
        var _cSql = `select * from movies order by ${req.body.category} asc LIMIT 2 OFFSET ${req.query.page * 2}`
        result = await getDomain(_cSql);


        if (result) {
            res.render('allmovies', {
                movies: result,
                current: req.query.page,
                pages: Math.ceil(totReords / perpage),
                category : req.body.category


            });
        }
    }

});

// Get distinct categories.
app.get("/search", async (req, res) => {
    var _cSql = "SELECT distinct type from category";
    result = await getDomain(_cSql);
    res.render("search", { category: result });
});

/* Function addMovie
* Helper function to insert the movie record into movies table
* Returns empty result object.
*/
async function addMovie(post, file, img_name) {
    var title = post.title;
    var description = post.description;
    var mlength = post.mlength;
    var releasedt = post.releasedt;
    var language = post.language;
    var genre = post.genre;

    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "image/gif") {
        file.mv('public/images/upload_images/' + file.name, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });
        var _cSql = "INSERT INTO `movies`(`title`,`description`,`image`,`mlength`, `releasedt` ) " +
            "VALUES ('" + title + "','" + description + "','" + img_name + "','" + mlength + "','" + releasedt + "')";

        return result = await getDomain(_cSql);


    }
}

/* Function getDomain
* Helper function which sends the mysql query to another function dbQuery.
* Returns the result of the dbQuery function. 
*/
async function getDomain(_cSql) {
    return result = await dbQuery(_cSql);
}


/* Function dbQuery
* Helper function uses promise and runs the mysql query 
* Returns the resultset from the database.
*/
function dbQuery(databaseQuery) {
    return new Promise(data => {
        connection.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                throw error;
            }
            try {
                //console.log(result);

                data(result);

            } catch (error) {
                data({});
                throw error;
            }

        });
    });

}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));