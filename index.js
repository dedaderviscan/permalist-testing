import express from "express"; //imports the express framework.
import bodyParser from "body-parser"; //imports the body-parser middleware // It processes incoming request bodies, making it easier to handle POST and PUT requests. By parsing the body of an HTTP request and attaching it to the req. body property, it simplifies data extraction and manipulation in server-side logic.
import pg from "pg"; //imports the pg in order to use postgres(PG) in our application. 

const app = express(); //creating app in order to use express.
const port = 3000; //setting the port value at 3000.  

//Configuration for our database 
const db = new pg.Client({ // then we can use it to create a new PG client from pg packages. So this is basically connecting to our database. 
  user: "postgres", //the username that I use to access that particular database is Postgres.  
  host: "localhost", // the host, because we are hosting our database on our computer that will be set by default as local host. 
  database: "permalist", // The name of our database from postgres.  
  password: "123456", //the password which corresponds to our username in postgres application.  
  port: 5432, //The host is localhost and it's running on port 5432 which is the standard Postgres port. 
});
db.connect(); // running db.connect in order to establish an active connection with our database. 

app.use(bodyParser.urlencoded({ extended: true })); //Our app uses the Body-parser middleware to get hold of information from an HTML form.  //the body parser code that is required for us to be able to tap into 'request.body'.
app.use(express.static("public")); //sets the address for static files related such as: CSS. 

let items = [ // UPDATE INFO HERE
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {   // Creates first reply to the request by get method by express in the 'http:/localhost:3000/'. // res.render responds to request to render of opening the ejs file. 
  try { //try&catch block for testing and error handling
    const result = await db.query("SELECT * FROM items ORDER BY id ASC"); //running the Postgres query to select everything from my table of items, in an ascending order. 
    items = result.rows; //setting the data from our database into this temporary list, then we can work with it and pass it over to our index.js front end file, 

    res.render("index.ejs", {  // rendering into index.ejs and passing the data from the database to ejs file. 
      listTitle: "To Do List", //passing data today to listTitle variable inside the ejs file.  
      listItems: items, //passing data from database to ejs file, items variable which is extracted from our databes and formed above. 
    });
  } catch (err) { //basic error handling
    console.log(err);  //basic error handling
  }
});

app.post("/add", async (req, res) => {  // this posting method by "/add" is activated when the button with action="/add" is clicked in the ejs file // Creates another reply to the request for the address http:/localhost:3000/add by the post method. 
  const item = req.body.newItem; //we grab hold of the text that the user entered into that field. by using body parser, it targets the name value name "newItem" in the ejs file. And creates a new item in order to use below for saving the item to the database. 
  // items.push({title: item});
  try { //we make a DB query and we insert into our items table with the column name title and the value corresponding to dollar one, which is going to be this right here.  
    await db.query("INSERT INTO items (title) VALUES ($1)", [item]); //making a new query to the database in order to create this new item in the postgres and store the data.
    res.redirect("/"); //after saving the data it redirects to the homepage again, and the updated data will be visible on the website. 
  } catch (err) { //basic error handling with the try&catch block
    console.log(err);
  }
});

app.post("/edit", async (req, res) => { //this posting method by "/edit" is activated when the action value is triggered from ejs file, it targets the html form element with action="/edit" attribute. // Creates another reply to the request for the address http:/localhost:3000/edit by the post method. 
  const item = req.body.updatedItemTitle; //passing the data from ejs to here, updatedItemTitle from the editing form and storing it as item by using BodyParser.
  const id = req.body.updatedItemId; //passing the data from ejs to here, updatedItemId from the editing form and storing it as id by using BodyParser.. 

  try { //try&catch block for testing and error handling
    await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]); //making a new query to the database in order to update the data in the postgres. item and id from above codes are updated in the pgAdmin.
    res.redirect("/"); ///after updating the data in the postgres, it redirects to the homepage again, and the updated data will be visible on the website.
  } catch (err) { //basic error handling
    console.log(err);
  }
});

app.post("/delete", async (req, res) => { //this posting method by "/delete" is activated when the action value is triggered from ejs file, it targets the html form element with action="/delete" attribute // Creates another reply to the request for the address http:/localhost:3000/delete by the post method. 
  const id = req.body.deleteItemId; //passing data from ejs to here, the deleteItemId from the input that has a name value as name="deleteItemId".
  try { //try&catch block for testing and error handling
    await db.query("DELETE FROM items WHERE id = $1", [id]); // making a new query to the database in order to update the data in the postgres. items with specified id which is passed from ejs file will be deleted in the database postgres. 
    res.redirect("/"); //after deleting the data with the id, it redirects to the homepage again, the deleted data will be dissappeared and the updated data will be shown. 
  } catch (err) { //basic error handling
    console.log(err); 
  }
});

// listens the port value when the server is running by "nodemon index.js", then returns the console log. 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
