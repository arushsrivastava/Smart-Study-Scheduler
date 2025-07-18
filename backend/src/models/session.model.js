import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    topic :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Topic',
        required:true
    },
    completedAt :{
        type : Date,
        default : Date.now
    },
    duration :{
        type : Number,
        required : true
    }
}, {timestamps : true});

export const Session = mongoose.model("Session", sessionSchema);