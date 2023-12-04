const DB = require('./../../config/database');
const jwt = require('jsonwebtoken');

const LogIn = (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        // Check email using a parameterized query
        const query1 = 'SELECT * FROM user WHERE email = ?';
        DB.connection.query(query1, [email], (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).json({ status: 500, message: 'Internal Server Error' });
            } else if (result.length > 0 && result[0].password === password) {
                // Password is valid, generate and set token
                const token = jwt.sign({
                    id: result[0].user_id,
                    role: result[0].user_role
                }, 'secret', { expiresIn: '1h' });


                res.cookie('jwt', token, { httpOnly: true, secure: false });
     

                res.json({ 
                    status: 200,
                     message: 'Login successful', 
                     token:token,
                     user_id:result[0].user_id,
                     role:result[0].user_role
                     });



            } else {
                // Invalid password or email not found
                res.status(400).json({ status: 400, message: 'Invalid email or password' });
            }
        });
    } else {
        // Invalid email or password format
        res.status(400).json({ status: 400, message: 'Invalid email or password format' });
    }
};

module.exports = LogIn;
