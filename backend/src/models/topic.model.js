import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
    title :{
        type : String,
        required : true,
        trim : true
    },
    subject : {
        type : String,
        required : true,
        trim : true
    },
    estimatedTime: {
        type: Number,
        required: true,
        min: 1,           // at least 1 minute
        default: 60       // you can adjust the default
    },
    tags: {
        type: [String],   // array of comma‑separated tags
        default: []
    },
    notes: {
        type: String,
        default: ''
    },
    priority :{
        type : String,
        enum : ["Low","Medium","High"],
        default : "Medium"
    },
    difficulty :{
        type : String,
        enum : ["Easy", "Medium", "Difficult"],
        default : "Medium",
        required : true,

    },
    completed :{
        type : Boolean,
        default : false,
    }

}, {timestamps : true});

export const Topic = mongoose.model("Topic", topicSchema);