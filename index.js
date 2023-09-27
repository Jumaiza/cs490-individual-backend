const express = require('express');
const db_conn = require('./db_connection');

const port = 4000;
const app = express();
var cors = require('cors')
app.use(cors())
app.use(express.json())

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

app.get('/home/top-5-actors', (req, res) => {
    const query = 'SELECT actor.* FROM film_actor INNER JOIN actor ON film_actor.actor_id = actor.actor_id GROUP BY film_actor.actor_id ORDER BY COUNT(film_actor.actor_id) DESC LIMIT 5;'
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

app.post('/home/top-5-films-by-actor-id', (req, res) => {
    const actorId = req.body.actorId;
    const query = `SELECT film.title AS movie_title, COUNT(rental.inventory_id) AS rental_count FROM actor JOIN film_actor ON actor.actor_id = film_actor.actor_id JOIN film ON film_actor.film_id = film.film_id JOIN inventory ON film.film_id = inventory.film_id JOIN rental ON inventory.inventory_id = rental.inventory_id WHERE actor.actor_id = ${actorId} GROUP BY film.title ORDER BY rental_count DESC LIMIT 5;`
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

app.listen(port, () => console.log(`Server is successfully listening on port ${port}`));