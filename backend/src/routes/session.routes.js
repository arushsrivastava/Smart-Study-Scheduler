import {Router} from "express";
import {createSession, deleteSession, getSessions, updateSession} from "../controllers/session.controller.js";

const router = Router();

router.route("/").get(getSessions).post(createSession);
router.route("/:id").put(updateSession).delete(deleteSession);

export default router