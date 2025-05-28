import ContactUs from "../models/ContactUs.js";

// Helper function to validate required fields
const validateContactFields = ({ name, email, contactNo, message }) => {
  return name && email && contactNo && message;
};

export const createContactMessage = async (req, res) => {
  try {
    const { name, email, contactNo, message } = req.body;

    if (!validateContactFields({ name, email, contactNo, message })) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }

    const newContact = new ContactUs({ name, email, contactNo, message });
    await newContact.save();

    return res
      .status(201)
      .json({ success: true, message: "Message sent successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const data = await ContactUs.find().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
