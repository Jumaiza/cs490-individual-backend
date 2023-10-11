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

router.post('/movies/check-available', (req, res) => {
    const filmId = req.body.film_id;
    const query1 = `
    SELECT inventory_id FROM inventory WHERE film_id = ${filmId}
    AND NOT EXISTS (
        SELECT 1
        FROM rental
        WHERE inventory_id = inventory.inventory_id
        AND return_date IS NULL
    )
    LIMIT 1`;
    db_conn.query(query1, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/movies/rent-to-customer', (req, res) => {
    const inventoryId = req.body.inventory_id;
    const customerId = req.body.customer_id;
    const query1 = `
        INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id)
        VALUES ( CURRENT_TIMESTAMP, ${inventoryId}, ${customerId}, 1)`
    db_conn.query(query1, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json('Invalid Customer ID');
        }
        res.status(200).send('Film rented successfully!');
    });
});

module.exports = router;