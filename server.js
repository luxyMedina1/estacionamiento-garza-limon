const express = require('express');
const path = require('path');
const webRoutes = require('./routes/webRoutes');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', webRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});