// ----- MODULE BACKEND -----
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	let sqlCmd = "SELECT * FROM suppliers";
    conn.query(sqlCmd, (err, result) => {
        if (err) throw err;
		res.status(200).send(JSON.stringify(result));
    });
});

router.get("/search/:param/:term", (req, res) => {
	let param = req.params.param;
	let term = "%" + req.params.term + "%";
	let sqlCmd = "";
	switch (param) {
		case "name":
			sqlCmd = "SELECT * FROM suppliers WHERE name LIKE ?";
			break;
		case "city":
			sqlCmd = "SELECT * FROM suppliers WHERE city LIKE ?";
			break;
		case "country":
			sqlCmd = "SELECT * FROM suppliers WHERE country LIKE ?";
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
	let sqlCmd = "INSERT INTO suppliers SET ?";
	conn.query(sqlCmd, form, (err, result) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(result.insertId));
	})
});

router.delete("/delete/:id", (req, res) => {
	let id = req.params.id;
	let sqlCmd = "DELETE FROM suppliers WHERE supplier_id = ?";
	conn.query(sqlCmd, id, (err, result) => {
		if (err) throw err;
		res.status(200).end()
	});
});

router.put("/update/:id", (req, res) => {
	let id = req.params.id;
	let form = req.body;
	delete form.supplier_id;
	let sqlCmd = "UPDATE suppliers SET ? WHERE supplier_id = ?"
	conn.query(sqlCmd, [form, id], (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

module.exports = router;