const express = require('express');
const knex = require('knex');
const cors = require('cors');
// const bodyParser = require('body-parser');
require('dotenv').config();

const db = knex({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: 'postgres',
        password: process.env.DB_PASS,
        database: 'postgres'
    }
})

const app = express();
app.use(express.json());
app.use(cors());

app.get('/search', (req, res) => {
    var query = db.select('*').from('locations');
    if (req.body.area !== '') {
        console.log(req.body.area);
        query.where('area', '=', req.body.area);
    }
    if (req.body.time !== '') {
        query.andWhere(`${req.body.day}_start`, '<=', req.body.time);
        query.andWhere(`${req.body.day}_end`, '>', req.body.time);
    }
    query.then(locs => {
        console.log(locs);
        res.json(locs);
    })
})

app.get('/areas', (req, res) => {
    console.log('here');
    db.select('name').from('areas')
        .then(areas => {
            console.log([].concat.apply([], areas.map(Object.values)));
            res.json([].concat.apply([], areas.map(Object.values)));
        })
})

app.get('/features', (req, res) => {
    db.select('name').from('features')
        .then(features => {
            console.log([].concat.apply([], features.map(Object.values)));
            res.json([].concat.apply([], features.map(Object.values)));
        })
})

app.listen(process.env.PORT, () => {
    console.log(`listening at http://localhost:${process.env.PORT}`)
})