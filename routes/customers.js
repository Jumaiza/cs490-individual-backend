const express = require('express');
const router = express.Router();
const db_conn = require('../db_connection');

router.get('/customers/all-customers', (req, res) => {
    const query = 'SELECT * FROM customer';
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/customers/search-by-id', (req, res) => {
    const customerId = req.body.customer_id;
    if (customerId === ''){
        return res.json([]);
    }
    const query = `SELECT * FROM customer WHERE customer_id = ${customerId}`
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/customers/search-by-name', (req, res) => {
    const name = req.body.name;
    if (name === ''){
        return res.json([]);
    }
    const query = `SELECT * FROM customer WHERE first_name LIKE "%${name}%" or last_name LIKE "%${name}%"`;
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/customers/rented-movies-by-id', (req, res) => {
    const customerId = req.body.customer_id;
    const query = `SELECT film.title, film.rental_duration
        from rental
        inner join inventory on rental.inventory_id = inventory.inventory_id
        inner join film on inventory.film_id = film.film_id
        where rental.customer_id = ${customerId}`;
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

module.exports = router;