// import Feedback from "../../models/Feedback.js";
import Feedback from "../../models/FeedBack.js";

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const feedback = await Feedback.create({
      name,
      email,
      mobile,
      message,
    });

    res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({ order: [["createdAt", "DESC"]] });
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.status(500).json({ message: "Server error" });
  }
};
