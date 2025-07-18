import {Router} from "express";
import {createTopic, deleteTopic, getTopics, updateTopic} from "../controllers/topic.controller.js";

const router = Router();

router.route("/").get(getTopics).post(createTopic);
router.route("/:id").put(updateTopic).delete(deleteTopic);

export default router