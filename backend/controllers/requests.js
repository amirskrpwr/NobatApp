const pool = require("./pool").Pool;

const getRequsets = (req, res, next) => {
    pool.query("SELECT * FROM requests ORDER BY id ASC", (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json({ requests: results.rows });
    });
};

const getRequsetById = (req, res, next) => {
    const id = parseInt(req.params.id);

    pool.query("SELECT * FROM requests WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).json(results.rows[0]);
    });
};

const createRequest = (req, res, next) => {
    const { name, phone_number, description, date, time } = req.body;
    const user_id = req.userData.userId;
    pool
        .query(
            "INSERT INTO requests (name, phone_number, description, date, time, user_id) VALUES ($1, $2, $3, $4, $5, $6)", [name, phone_number, description, date, time, user_id]
        )
        .then((result) => {
            res.status(201).send(`Request added with ID: ${result.insertId}`);
            console.log("Request added.");
        })
        .catch((error) => {
            res.status(500).json({ message: "Request failed!", error: error });
        });
};

const updateRequest = (req, res, next) => {
    const id = parseInt(req.params.id);
    const { name, phone_number, description, date, time } = req.body;

    pool.query(
        "UPDATE requests SET name = $1, phone_number = $2, description = $3, date = $4, time = $5, status='not seen' WHERE id = $6", [name, phone_number, description, date, time, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Request modified with ID: ${id}`);
            console.log("Request modified.");
        }
    );
};

const deleteRequest = (req, res, next) => {
    const id = parseInt(req.params.id);

    pool.query("DELETE FROM requests WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        res.status(200).send(`Request deleted with ID: ${id}`);
        console.log("Request Deleted.");
    });
};

const updateStatus = (req, res, next) => {
    const id = parseInt(req.params.id);
    const status = req.body.status;
    pool.query(
        "UPDATE requests SET status = $1 WHERE id = $2", [status, id],
        (error, results) => {
            if (error) {
                throw error;
            }
            res.status(200).send(`Request status modified with ID: ${id}`);
            console.log("Request modified.");
        }
    );
};

module.exports = {
    getRequsets,
    getRequsetById,
    createRequest,
    updateRequest,
    deleteRequest,
    updateStatus,
};