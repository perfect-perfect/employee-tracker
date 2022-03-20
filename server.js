const express = require('express');
const db = require('./db/connection');
// this is the folder are the routes will be in
// remember that you don't have to specify index.js (which si the central hub for the routes) 
//  - because if the the directory has an index.js file in it, Node.js will automatically look for it when requiring the directory
// const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// telling the server to use the apiRoutes folder to access the routes. and in that folder it defaults to the index js, which router.use's the candidateRoutes.js and the partyRoutes.js
// by adding the /api refix here we remove it from the individual route expressions
// app.use('/api', apiRoutes);

// Default response for any other request (Not Found). That's why it doesn't havea specified route
// catchall
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
});