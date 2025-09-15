import express from "express";

import { submitFeedback, getAllFeedback } from "../../controllers/User/FeedBackController.js";
const router = express.Router();

router.post("/", submitFeedback);   
router.get("/", getAllFeedback);    

export default router;
