import express from "express";
const router = express.Router();
import {
  createContactMessage,
  getContactMessages,
} from "../controllers/contactUsController.js";

// GET all contact messages
router.get("/", getContactMessages);

// POST a new contact message
router.post("/", createContactMessage);

export default router;
