const express = require('express');
const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose')
const cors = require('cors')
const app = express();
const router = require('./routes/authroute');
app.use(cors())
app.use(express.json());


// const mongouri='mongodb+srv://userSimon:SimonntHJ3322@cluster0.ckww6.mongodb.net/userData?retryWrites=true&w=majority';
const mongouri = 'mongodb+srv://contact:My9J9xnpsYSRnH6@cluster0.ncmj4.mongodb.net/shannonDatabase?retryWrites=true&w=majority'

// const mongouri = 'mongodb://20.235.98.213:27017'
mongoose.connect(mongouri, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then((result) => {
    console.log('mongo connected');
})
    .catch((err) => { console.log(err) });


app.get('/email', (req, res) => {
    return res.send("exists");
    // const cheched = validator.validate("ranrt654reg4536a@bal.com");
    // if (cheched) {
    //     return res.send(cheched);
    // }
    // return res.send('not exists');

})

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`server run at ${port}`) })
app.use(router)