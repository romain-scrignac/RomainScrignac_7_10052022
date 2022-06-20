const express = require('express');
const app = express();
const path = require('path');
const sequelize = require('./database/config');

require('./database/models');

const userRoutes = require('./routes/user');
const postsRoutes = require('./routes/posts');
const commentsRoutes = require('./routes/comments');

// Synchronization of the models with the database
async function synchroDb() {
    try {
        await sequelize.sync();
        console.log("All models were synchronized successfully.");
    } catch (err) { 
        console.error('Unable to synchronize with database:', err)
    }
}
synchroDb();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-with, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comments', commentsRoutes);

module.exports = app;