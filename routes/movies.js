const express = require('express');
const router = express.Router();
const db_conn = require('../db_connection');

router.post('/movies/search-by-title', (req, res) => {
    const filmTitle = req.body.film_title;
    if (filmTitle === ''){
        return res.json([]);
    }
    const query = `SELECT * FROM film where title like "%${filmTitle}%"`
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/movies/search-by-actor-name', (req, res) => {
    const actorName = req.body.actor_name;
    if (actorName === ''){
        return res.json([]);
    }
    const query = `
        select * from film
        inner join film_actor on film.film_id = film_actor.film_id
        inner join actor on film_actor.actor_id = actor.actor_id 
        where actor.first_name like "%${actorName}" or actor.last_name like "%${actorName}}%"`;
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/movies/search-by-category', (req, res) => {
    const filmCategory = req.body.film_category;
    if (filmCategory === ''){
        return res.json([]);
    }
    const query = `
        select * from film
        inner join film_category on film.film_id = film_category.film_id
        inner join category on film_category.category_id = category.category_id
        where category.name like "%${filmCategory}%"`;
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

module.exports = router;