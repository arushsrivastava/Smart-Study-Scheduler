import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import {Topic} from "../models/topic.model.js";
import {Session} from "../models/session.model.js";

export const getAnalytics = asyncHandler(async (req, res, next) => {
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate()-now.getDay()));

    const totalAgg = await Session.aggregate([
        { $match: { completedAt: { $gte: startOfWeek } } },
        {
          $group: {
            _id: null,
            totalTime: { $sum: "$duration" },
            sessionCount: { $sum: 1 }
          }
        }
      ]);

      if(!totalAgg) throw new ApiError(401,"Failed to fetch data");
  
      const totalTime = totalAgg[0]?.totalTime || 0;
      const sessionCount = totalAgg[0]?.sessionCount || 0;
      const avgSession = sessionCount > 0 ? Math.floor(totalTime / sessionCount) : 0;

      const timeByDay = await Session.aggregate([
        { $match: { completedAt: { $gte: startOfWeek } } },
        {
          $group: {
            _id: { day: { $dayOfWeek: "$completedAt" } },
            total: { $sum: "$duration" }
          }
        }
      ]);

      if(!timeByDay) throw new ApiError(401,"Failed to fetch data");
  
      // 3. Time by difficulty
      const timeByDifficulty = await Session.aggregate([
        { $match: { topic: { $ne: null }, completedAt: { $gte: startOfWeek } } },
        {
          $lookup: {
            from: "topics",
            localField: "topic",
            foreignField: "_id",
            as: "topicDetails"
          }
        },
        { $unwind: "$topicDetails" },
        {
          $group: {
            _id: "$topicDetails.difficulty",
            total: { $sum: "$duration" }
          }
        }
      ]);

      if(!timeByDifficulty) throw new ApiError(401,"Failed to fetch data");

      const mostStudied = await Session.aggregate([
        { $match: { topic: { $ne: null }, completedAt: { $gte: startOfWeek } } },
        {
          $group: {
            _id: "$topic",
            sessions: { $sum: 1 },
            time: { $sum: "$duration" }
          }
        },
        { $sort: { time: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "topics",
            localField: "_id",
            foreignField: "_id",
            as: "topicDetails"
          }
        },
        { $unwind: "$topicDetails" }
      ]);

      if(!mostStudied) throw new ApiError(401,"Failed to fetch data");

      return res
      .status(200)
      .json({
        totalTime,
        sessionCount,
        avgSession,
        timeByDay,
        timeByDifficulty,
        mostStudied
      });

}
) 



