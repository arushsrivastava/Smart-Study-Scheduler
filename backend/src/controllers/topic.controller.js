import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Topic} from "../models/topic.model.js";


const createTopic = asyncHandler(async (req, res, next) => {
    // get topic title
    // get subject
    // get difficulty, priority, expected time
    // get tags
    // get notes

    const {title, subject, priority, difficulty, estimatedTime, tags, notes, completed} = req.body;

    if(
        [title, subject].some((field) => !field?.trim == "")
    ){
        throw new ApiError(400, `${field} can't be empty`);
    }

    const newTopic = await Topic.create({
        title,
        subject,
        priority,
        difficulty,
        estimatedTime,
        tags,
        notes,
        completed
    })

    if(!newTopic){
        throw new ApiError(400, "Failed to create topic");
    }

    return res.
    status(201)
    .json(
        new ApiResponse(200, "Topic created successfully", newTopic)
    )
})

const updateTopic = asyncHandler(async (req, res, next) => {
    const topicId = req.params.id;
    if(!topicId){
        throw new ApiError(400, "Unauthorized request");
    }
    const topic = await Topic.findById(topicId);
    if(!topic){
        throw new ApiError(404, "Topic not found");
    }
    const {title, subject, priority, difficulty, estimatedTime, tags, notes, completed} = req.body;
    if(
        [title, subject].some((field) => !field?.trim == "")
    ){
        throw new ApiError(400, `${field} can't be empty`);
    }
    topic.title = title;
    topic.subject = subject;
    topic.priority = priority;
    topic.difficulty = difficulty;
    topic.estimatedTime = estimatedTime;
    topic.tags = tags;
    topic.notes = notes;
    topic.completed = completed;
    await topic.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Topic updated successfully", topic)
    )
})

const deleteTopic = asyncHandler(async (req, res, next) => {
    const topicId = req.params.id;
    
    const deletion = await Topic.findByIdAndDelete(topicId);
    if(!deletion){
        throw new ApiError(404, "Failed to delete");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Topic deleted successfully", deletion)
    )

})

const getTopics = asyncHandler(async (req, res, next) => {
    
    const topic = await Topic.find().sort({createdAt : -1});
    if(!topic){
        throw new ApiError(404, "Topics not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Topic found", topic)
    )
})

const getTopicByName = asyncHandler(async (req, res, next) => {
    const topicName = req.params.name;
    const topics = await Topic.find({title: { $regex: new RegExp(`^${topicName}$`, 'i')}}).sort({createdAt : -1});
    if(!topics || topics.length === 0){
        throw new ApiError(404, "Topic not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Topic found", topics)
    )
})


export {createTopic, updateTopic, deleteTopic, getTopics, getTopicByName}  ;  