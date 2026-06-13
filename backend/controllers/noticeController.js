const Notice = require('../models/Notice');

exports.getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ hostel: req.user.hostel })
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: notices });
  } catch (error) {
    next(error);
  }
};

exports.createNotice = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ success: false, message: 'Please provide title and body.' });
    }

    const notice = new Notice({
      title,
      body,
      hostel: req.user.hostel,
      postedBy: req.user.id
    });

    await notice.save();
    return res.status(201).json({ success: true, message: 'Notice posted successfully.', data: notice });
  } catch (error) {
    next(error);
  }
};

exports.editNotice = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    // Verify it belongs to the same hostel
    if (notice.hostel.toString() !== req.user.hostel) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    if (title) notice.title = title;
    if (body) notice.body = body;

    await notice.save();
    return res.json({ success: true, message: 'Notice updated successfully.', data: notice });
  } catch (error) {
    next(error);
  }
};

exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) {
      return res.status(404).json({ success: false, message: 'Notice not found.' });
    }

    // Verify it belongs to the same hostel
    if (notice.hostel.toString() !== req.user.hostel) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Notice deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
