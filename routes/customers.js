const express = require('express');
const router = express.Router();
const db_conn = require('../db_connection');

router.get('/customers/all-customers', (req, res) => {
    const query = `SELECT customer.address_id,customer_id,first_name,last_name,email,address,city,district,postal_code,phone FROM customer
        inner join address on customer.address_id = address.address_id
        inner join city on address.city_id = city.city_id`;
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
    const query = `SELECT customer.address_id,customer_id,first_name,last_name,email,address,city,district,postal_code,phone FROM customer
        inner join address on customer.address_id = address.address_id
        inner join city on address.city_id = city.city_id
        where customer_id = ${customerId}`;
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
    const query = `SELECT customer.address_id,customer_id,first_name,last_name,email,address,city,district,postal_code,phone FROM customer
        inner join address on customer.address_id = address.address_id
        inner join city on address.city_id = city.city_id
        WHERE first_name LIKE "%${name}%" or last_name LIKE "%${name}%"`;
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
    console.log(addressId)
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

router.put('/customers/add-customer', (req, res) => {
    const customer = req.body;

    let cityId;
    const cityQuery = `INSERT INTO city (city, country_id) VALUES("${customer.city}", 103);`;

    db_conn.query(cityQuery, (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Error adding city' });
        }
        cityId = result.insertId;

        const addressQuery = `INSERT INTO address (address, address2, district, city_id, postal_code, phone, location)
        VALUES ("${customer.address}", NULL, "${customer.district}",${cityId}, "${customer.postal_code}","${customer.phone}", POINT(0,0));`;
        db_conn.query(addressQuery, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'Error adding address' });
            }
            const addressId = result.insertId;

            const customerQuery = `INSERT INTO customer (store_id, first_name, last_name, email, address_id, active, create_date)
            VALUES (1, "${customer.first_name}", "${customer.last_name}", "${customer.email}", ${addressId}, 1, CURRENT_TIMESTAMP);`;
            db_conn.query(customerQuery, (error, result) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ error: 'Error adding customer' });
                }
                res.status(200).send(`New Customer with ID: ${result.insertId} added successfully!`);
            });
        });
    });
});


module.exports = router;