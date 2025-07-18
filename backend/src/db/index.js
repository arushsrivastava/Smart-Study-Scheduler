import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
    try {
        const conectionInstance =   await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`MongoDB Connected... DB Host : ${conectionInstance.connection.host}`);
    } catch (error) {
        console.error("ERROR : ", error);
        process.exit(1);
    }
}

export default connectDB;