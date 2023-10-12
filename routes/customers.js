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
    const query = `SELECT film.title,
        CASE WHEN rental.return_date IS NOT NULL THEN 'RETURNED' ELSE 'NOT RETURNED YET' END AS return_status
        FROM rental
        INNER JOIN inventory ON rental.inventory_id = inventory.inventory_id
        INNER JOIN film ON inventory.film_id = film.film_id
        WHERE rental.customer_id = ${customerId}`;
    db_conn.query(query, (error, result) => {
        if(error){
            console.error(error)
            return res.status(500).json({ error: 'Error executing database query' });
        }
        res.json(result);
    });
});

router.post('/customers/delete-customer-by-id', (req, res) => {
    const customerId = req.body.customer_id;
    const addressId = req.body.address_id
    const queries = [
        `delete from rental WHERE customer_id = ${customerId};`,
        `delete from payment WHERE customer_id = ${customerId};`,
        `delete from customer WHERE customer_id = ${customerId};`,
        `delete from address WHERE address_id = ${addressId};`,
    ];
    for(const query of queries){
        db_conn.query(query, (error, result) => {
            if(error){
                console.error(error)
                return res.status(500).json('Invalid Customer ID');
            }
        });
    }
    res.status(200).send('Customer deleted successfully!');
});

module.exports = router;