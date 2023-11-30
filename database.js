import mongoose  from 'mongoose'
const mongouri='mongodb://contact:My9J9xnpsYSRnH6@cluster0-shard-00-00.ncmj4.mongodb.net:27017,cluster0-shard-00-01.ncmj4.mongodb.net:27017,cluster0-shard-00-02.ncmj4.mongodb.net:27017/shannonDatabase?ssl=true&replicaSet=atlas-10vj3b-shard-0&authSource=admin&retryWrites=true&w=majority'


// const mongouri='mongodb://hockeyJob:hockJob345WE@ac-mx3bdn2-shard-00-00.uugspp0.mongodb.net:27017,ac-mx3bdn2-shard-00-01.uugspp0.mongodb.net:27017,ac-mx3bdn2-shard-00-02.uugspp0.mongodb.net:27017/myfirstDatabase?ssl=true&replicaSet=atlas-nxhsix-shard-0&authSource=admin&retryWrites=true&w=majority'
const connectDB = () => {

    mongoose.connect(mongouri
    ).then((result) => {
        console.log('mongo connected');
    })
        .catch((err) => { console.log(err) });
}

export default connectDB




