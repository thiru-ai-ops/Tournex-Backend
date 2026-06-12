const Message = require('../models/Message');

/**
 * @desc    Get user messages
 * @route   GET /api/messages
 * @access  Private
 */
const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json({
      success: true,
      count: messages.length,
      messages: messages.map(m => ({
        id: m._id,
        sender: m.sender,
        text: m.text,
        image: m.image,
        time: m.time
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new message
 * @route   POST /api/messages
 * @access  Private
 */
const createMessage = async (req, res, next) => {
  try {
    const { sender, text, image, time } = req.body;

    if (!sender || !text || !time) {
      return res.status(400).json({ success: false, error: 'Please provide all required message fields' });
    }

    const message = await Message.create({
      user: req.user._id,
      sender,
      text,
      image: image || '',
      time
    });

    res.status(201).json({
      success: true,
      message: {
        id: message._id,
        sender: message.sender,
        text: message.text,
        image: message.image,
        time: message.time
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Clear all user messages
 * @route   DELETE /api/messages/all/clear
 * @access  Private
 */
const clearMessages = async (req, res, next) => {
  try {
    await Message.deleteMany({ user: req.user._id });
    res.json({ success: true, message: 'All user messages cleared successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
  clearMessages
};
