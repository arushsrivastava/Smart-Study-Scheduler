import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Topic} from "../models/topic.model.js";
import { Session } from "../models/session.model.js";

const createSession = asyncHandler(async (req, res, next) => {
    const {topic, duration} = req.body;

    if(topic!=null){
        const topicExists = await Topic.findById(topic);
        if(!topicExists){
            throw new ApiError(404, "Topic not found");
        }
    }

    const newSession = await Session.create({
        topic : topic || null,
        duration
    })

    if(!newSession){
        throw new ApiError(400, "Failed to create session");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Session created successfully", newSession)
    )

})

const getSessions = asyncHandler(async (req, res, next) => {
    const sessions = await Session.find().populate('topic').sort({ completedAt: -1 });
    if(!sessions){
        throw new ApiError(404, "Sessions not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Sessions found", sessions)
    )
})

const deleteSession = asyncHandler(async (req, res, next) => {
    const sessionId = req.params.id;
    if(!sessionId){
        throw new ApiError(400, "Unauthorized request");
    }

    const deletedSession = await Session.findByIdAndDelete(sessionId);
    if(!deletedSession){
        throw new ApiError(404, "Session not found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Session deleted successfully", deletedSession)
    )
})
const updateSession = asyncHandler(async (req, res, next) => {
    const sessionId = req.params.id;
    if(!sessionId){
        throw new ApiError(400, "Unauthorized request");
    }
    const session = await Session.findById(sessionId);
    if(!session){
        throw new ApiError(404, "Session not found");
    }
    const {topic, duration} = req.body;
    if(topic!=null){
        const topicExists = await Topic.findById(topic);
        if(!topicExists){
            throw new ApiError(404, "Topic not found");
        }
    }
    session.topic = topic || null;
    session.duration = duration;
    await session.save();
    return res
    .status(200)
    .json(
        new ApiResponse(200, "Session updated successfully", session)
    )
})

export {createSession, getSessions, deleteSession, updateSession};