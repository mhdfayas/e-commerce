const { MongoClient } = require('mongodb');

const state = {
    db: null
};

module.exports.connect = function (done) {
    const url = 'mongodb://localhost:27017';
    const dbname = 'shopping';

    MongoClient.connect(url )
        .then((client) => {
            console.log('Connected successfully to MongoDB');
            state.db = client.db(dbname);
            done();
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB:', err);
            done(err);
        });
};

module.exports.get = function () {
    return state.db;
};