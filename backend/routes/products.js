// ----- MODULE BACKEND -----
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	let sqlCmds = [
		`SELECT 
			p.product_id,
			p.name AS 'name',
			p.unit,
			p.price,
			CONCAT(c.name,' ',p.fk_category_id) AS 'category_name',
			CONCAT(s.name,' ',p.fk_supplier_id) AS 'supplier_name'
			FROM products p
			INNER JOIN categories c
			ON p.fk_category_id = c.category_id
			INNER JOIN suppliers s
			ON p.fk_supplier_id = s.supplier_id`,
		`SELECT 
			category_id, 
			name 
			FROM categories`,
		`SELECT 
			supplier_id, 
			name 
			FROM suppliers`
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
			p.product_id,
			p.name AS 'name',
			p.unit,
			p.price,
			CONCAT(c.name,' ',p.fk_category_id) AS 'category_name',
			CONCAT(s.name,' ',p.fk_supplier_id) AS 'supplier_name'
			FROM products p
			INNER JOIN categories c
			ON p.fk_category_id = c.category_id
			INNER JOIN suppliers s
			ON p.fk_supplier_id = s.supplier_id`;
	switch (param) {
		case "name":
			sqlCmd += ` WHERE p.name LIKE ?`;
			break;
		case "price":
			sqlCmd += ` WHERE p.price LIKE ?`;
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
	let sqlCmd = "INSERT INTO products SET ?";
	conn.query(sqlCmd, form, (err, result) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(result.insertId));
	})
});

router.delete("/delete/:id", (req, res) => {
	let id = req.params.id;
	let sqlCmd = "DELETE FROM products WHERE product_id = ?";
	conn.query(sqlCmd, id, (err, result) => {
		if (err) throw err;
		res.status(200).end()
	});
});

router.put("/update/:id", (req, res) => {
	let id = req.params.id;
	let form = req.body;
	delete form.product_id;
	let sqlCmd = "UPDATE products SET ? WHERE product_id = ?"
	conn.query(sqlCmd, [form, id], (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

module.exports = router;