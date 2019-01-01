const express = require('express')
const app = express()

const axios = require('axios')


var http = require("http").Server(app);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.set("port", (process.env.PORT || 3001));  // Use either given port or 3001 as default
app.use(express.static("public"));  // Staticly serve pages, using directory 'public' as root

// User connects to server
app.get("/", function(req, res) {
	// Will serve static pages, no need to handle requests
});

// If any page not handled already handled (ie. doesn't exists)
app.get("*", function(req, res) {
	res.status(404).send("Error 404 - Page not found");
});



app.get('/foods/:name', (req, res) => {
  const url = `https://api.edamam.com/api/food-database/parser?app_id=02047b16&app_key=697d818b0e957ccf514c6166dab039fc&ingr=${req.params.name}`
  axios.get(url)
    .then(response => {
      if (!response.data.hints.length) {
        return res.send({
          error: 'No food found'
        })
      }
      res.send(JSON.stringify(response.data.hints))
    })
    .catch(error => res.sendStatus(error.response.status))
})


// Start http server
http.listen(app.get("port"), function() {
	console.log("Node app started on port %s", app.get("port"));
});
