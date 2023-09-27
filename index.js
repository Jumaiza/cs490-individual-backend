const express = require('express');
const db_conn = require('./db_connection');

const port = 4000;
const app = express();
var cors = require('cors')
app.use(cors())

app.get('/health/check', (req,res) =>{
    res.json({testString: "Hello World From Server!"});
})

app.get('/home/top-5-movies', (req, res) => {
    const query = 'SELECT film.* FROM rental INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id INNER JOIN film ON inventory.film_id = film.film_id GROUP BY film.film_id ORDER BY count(rental.inventory_id) DESC LIMIT 5;'
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));