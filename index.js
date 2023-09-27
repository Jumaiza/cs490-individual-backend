const express = require('express');

const port = 4000;
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json())

app.get('/health/check', (req,res) =>{
    res.json({testString: "Hello World From Server!"});
})

const homeRoutes = require('./routes/home');
const moviesRoutes = require('./routes/movies');

app.use('/api', homeRoutes);
app.use('/api', moviesRoutes);

app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));