const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.listen(3000);

app.use(express.static('views'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Redirection vers index
app.get('/', (req, res) => { 
    res.sendFile("index.html");
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // reception de n'importe quel serveur
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Accepter les demandes de get, post, update et delete
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Access-Control-Allow-Headers : indique les headers autorisés : content-Type
    next();
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ensaf_node_rest'
});

connection.connect((err) => {
    if (err) {
        console.error(err)
        return;
    }
    console.log("Connected!");
});



// Ajout d'un enregistrement
app.post('/product', (req, res) => {
    const { productName, description, price } = req.body;
    const sql = 'INSERT INTO product (productName, description, price) VALUES (?, ?, ?)';
    connection.query(sql, [productName, description, price], (err, result) => { 
        if (err) return res.status(500).send({ Message: 'Error creating user.', Success: false });
        res.status(201).send({ Message: 'Product created successfully.', Success: true });
     });
});

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    connection.query(sql, [name, email, password], (err, result) => { 
        if (err) return res.status(500).send({ Message: 'Error creating user.', Success: false });
        res.status(201).send({ Message: 'User created successfully.', Success: true });
     });
});

// Affichage de tous les enregistrements
app.get('/product', (req, res) => {
    const sql = 'SELECT * FROM product';
    connection.query(sql, (err, result) => { 
        if (err) { return res.status(500).send({ Message: 'Error reading user', Success: false }); }
        res.send(result);
     });
});

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    connection.query(sql,(err, result) => { 
        if (err) { return res.status(500).send({ Message: 'Error reading user', Success: false }); }
        res.send(result);
     });
});

// Suppression (delete) d'un enregistrement
app.delete('/product/:id', (req, res) => {
    const sql = 'DELETE FROM product WHERE id = ?';
    console.log(req.params.id);
    connection.query(sql, [req.params.id], (err, result) => { 
        if (err) { return res.status(500).send({ Message: 'Error deleting user', Success: false }); }
        res.send({ Message: 'Product deleted successfully.', Success: true });
     });
});

// Mise à jour (Update) d'un enregistrement
app.put('/product/:id', (req, res) => {
    const { productName, description, price } = req.body;
    console.log(req.params.id);
    const sql = 'UPDATE product SET productName = ?, description = ?, price = ? WHERE id = ?';
    connection.query(sql, [ productName, description, price, req.params.id ], (err, result) => { 
        if (err) { return res.status(500).send({ Message: 'Error reading user', Success: false }); }
        res.send({ Message: 'Product updated successfully.', Success: true });
     });
});

// const PORT = process.env.PORT || process.argv[2] || 3000;
// app.listen(PORT, ()=>console.log(`Server is running on port ${PORT}.`));

// connection.end();