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
// const mongouri = 'mongodb+srv://contact:My9J9xnpsYSRnH6@cluster0.ncmj4.mongodb.net/shannonDatabase?retryWrites=true&w=majority'
const mongouri='mongodb://contact:My9J9xnpsYSRnH6@cluster0-shard-00-00.ncmj4.mongodb.net:27017,cluster0-shard-00-01.ncmj4.mongodb.net:27017,cluster0-shard-00-02.ncmj4.mongodb.net:27017/shannonDatabase?ssl=true&replicaSet=atlas-10vj3b-shard-0&authSource=admin&retryWrites=true&w=majority'
mongoose.connect(mongouri, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then((result) => {
    console.log('mongo connected');
})
    .catch((err) => { console.log(err) });


app.post('/email', (req, res) => {

    const { username ,password} = req.body

    return res.status(200).json({ success: "changed succesfully" })
    // const cheched = validator.validate("ranrt654reg4536a@bal.com");
    // if (cheched) {
    //     return res.send(cheched);
    // }
    // return res.send('not exists');

})

const port = process.env.PORT || 5000;

app.listen(port, () => { console.log(`server run at ${port}`) })
app.use(router)