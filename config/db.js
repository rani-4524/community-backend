import mongoose from 'mongoose';

const connectDb = async() => {
    try {
        // console.log("ENV VALUE 👉", process.env.MONGO_URL);
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongodb Connected");
    } catch (error) {
        console.log(`Error connecting to monogDb : ${error.message}`);
    }

};

export default connectDb;