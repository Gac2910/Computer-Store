// ----- MODULE BACKEND -----
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	let sqlCmds = [
        `SELECT 
            o.order_id,
            o.order_date,
            CONCAT(s.name,' ',s.shipper_id) AS 'shipper_name',
            CONCAT(c.first_name,' ',c.last_name,' ',c.customer_id) AS 'customer_name',
            CONCAT(e.first_name,' ',e.last_name,' ',e.employee_id) AS 'employee_name',
            CONCAT(p.name,' ',p.product_id) AS 'product_name'
            FROM orders o
            INNER JOIN shippers s 
            ON o.fk_shipper_id = s.shipper_id 
            INNER JOIN customers c 
            ON o.fk_customer_id = c.customer_id 
            INNER JOIN employees e 
            ON o.fk_employee_id = e.employee_id 
            INNER JOIN products p 
            ON o.fk_product_id = p.product_id`,
        `SELECT
            shipper_id, 
            name
            FROM shippers`,
        `SELECT 
            customer_id,  
            CONCAT(first_name,' ',last_name) AS 'name'
            FROM customers`,
        `SELECT 
            employee_id,  
            CONCAT(first_name,' ',last_name) AS 'name'
            FROM employees`,
        `SELECT 
            product_id,
            name
            FROM products`
	];
    conn.query(sqlCmds.join(";"), (err, result) => {
        if (err) throw err;
		res.status(200).send(result);
    });
});

router.get("/search/:param/:term", (req, res) => {
	let param = req.params.param;
	let term = "%" + req.params.term + "%";
    let sqlCmd = 
        `SELECT 
            o.order_id,
            o.order_date,
            CONCAT(s.name,' ',s.shipper_id) AS 'shipper_name',
            CONCAT(c.first_name,' ',c.last_name,' ',c.customer_id) AS 'customer_name',
            CONCAT(e.first_name,' ',e.last_name,' ',e.employee_id) AS 'employee_name',
            CONCAT(p.name,' ',p.product_id) AS 'product_name'
            FROM orders o
            INNER JOIN shippers s 
            ON o.fk_shipper_id = s.shipper_id 
            INNER JOIN customers c 
            ON o.fk_customer_id = c.customer_id 
            INNER JOIN employees e 
            ON o.fk_employee_id = e.employee_id 
            INNER JOIN products p 
            ON o.fk_product_id = p.product_id`;
	switch (param) {
		case "product":
			sqlCmd += " WHERE p.name LIKE ?";
			break;
		case "customer":
			sqlCmd += " WHERE CONCAT_WS(' ', c.first_name, c.last_name) LIKE ?";
			break;
		default:
			throw new Error("Invalid Search Parameter");
	}
	conn.query(sqlCmd, term, (err, result) => {
        if (err) throw err;
		res.status(200).send(JSON.stringify(result));
    });
});

router.post("/insert", (req, res) => {
	let form = req.body;
	let sqlCmd = "INSERT INTO orders SET ?";
	conn.query(sqlCmd, form, (err, result) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(result.insertId));
	})
});

router.delete("/delete/:id", (req, res) => {
	let id = req.params.id;
	let sqlCmd = "DELETE FROM orders WHERE order_id = ?";
	conn.query(sqlCmd, id, (err, result) => {
		if (err) throw err;
		res.status(200).end()
	});
});

router.put("/update/:id", (req, res) => {
	let id = req.params.id;
	let form = req.body;
	delete form.order_id;
	let sqlCmd = "UPDATE orders SET ? WHERE order_id = ?"
	conn.query(sqlCmd, [form, id], (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

module.exports = router;