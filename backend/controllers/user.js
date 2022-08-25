const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("./pool.js").Pool;

//Registration Function

exports.register = async(req, res) => {
    const { email, password } = req.body;
    try {
        const data = await pool.query(`SELECT * FROM users WHERE email= $1;`, [
            email,
        ]); //Checking if user already exists
        const arr = data.rows;
        if (arr.length != 0) {
            return res.status(400).json({
                message: "این ایمیل در حال حاضر وجود دارد. لطفا وارد شوید.",
            });
        } else {
            bcrypt
                .hash(password, 10)
                .then((hash) => {
                    const user = { email, password: hash };
                    pool.query(
                        `INSERT INTO users (email, password) VALUES ($1,$2);`, [user.email, user.password],
                        (err) => {
                            if (err) {
                                console.error(err);
                                return res.status(500).json({ message: "مشکل دیتابیس" });
                            } else {
                                res
                                    .status(200)
                                    .send({ message: "حساب ایجاد شد. لطفا وارد شوید." });
                            }
                        }
                    );
                })
                .catch((error) =>
                    res.status(500).json({
                        message: "مشکل سرور",
                    })
                );
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "مشکلی برای دیتابیس حین عملیات ثبت نام پیش آمد.", //Database connection error
        });
    }
};

exports.login = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const data = await pool.query(`SELECT * FROM users WHERE email= $1;`, [
            email,
        ]); //Verifying if the user exists in the database
        const user = data.rows;
        if (user.length === 0) {
            res.status(400).json({
                massege: "چنین کاربری وجود ندارد. لطفا ابتدا ثبت نام کنید",
            });
        } else {
            bcrypt.compare(password, user[0].password).then((result) => {
                if (!result) {
                    return res.status(401).json({ message: "رمز عبور اشتباه است." });
                }
                const token = jwt.sign({ email: email, password: password, userId: user[0].id },
                    process.env.JWT_KEY, {
                        expiresIn: "1h",
                    }
                );
                let isAdmin = false;
                if (
                    email == "admin@mail.com" &&
                    jwt.verify(token, process.env.JWT_KEY).password == "admin"
                ) {
                    isAdmin = true;
                }

                res.status(200).json({
                    token: token,
                    expiresIn: 3600,
                    userId: user[0].id,
                    email: email,
                    isAdmin: isAdmin,
                });
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "در حین عملیات ورود مشکلی پیش آمد!", //Database connection error
        });
    }
};
