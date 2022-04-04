// ----- MODULE BACKEND -----
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	let sqlCmd = "SELECT * FROM shippers";
    conn.query(sqlCmd, (err, result) => {
        if (err) throw err;
		res.status(200).send(JSON.stringify(result));
    });
});

router.get("/search/:term", (req, res) => {
	let term = "%" + req.params.term + "%";
	let sqlCmd = "SELECT * FROM shippers WHERE name LIKE ?";
	conn.query(sqlCmd, term, (err, result) => {
        if (err) throw err;
		res.status(200).send(JSON.stringify(result));
    });
});

router.post("/insert", (req, res) => {
	let form = req.body;
	let sqlCmd = "INSERT INTO shippers SET ?";
	conn.query(sqlCmd, form, (err, result) => {
		if (err) throw err;
		res.status(200).send(JSON.stringify(result.insertId));
	})
});

router.delete("/delete/:id", (req, res) => {
	let id = req.params.id;
	let sqlCmd = "DELETE FROM shippers WHERE shipper_id = ?";
	conn.query(sqlCmd, id, (err, result) => {
		if (err) throw err;
		res.status(200).end()
	});
});

router.put("/update/:id", (req, res) => {
	let id = req.params.id;
	let form = req.body;
	delete form.shipper_id;
	let sqlCmd = "UPDATE shippers SET ? WHERE shipper_id = ?"
	conn.query(sqlCmd, [form, id], (err, result) => {
		if (err) throw err;
		res.status(200).end();
	});
});

module.exports = router;