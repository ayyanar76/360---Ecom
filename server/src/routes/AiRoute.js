import express from "express";
import { chat, recommend } from "../controllers/Aicontroller.js";

const AiRouter = express.Router();

AiRouter.route("/airecommend").post(recommend);
AiRouter.route("/aichat").post(chat);

export default AiRouter;
