const reportService = require('../services/reports');

exports.createReport = async (req, res) => {
  try {
    await reportService.createReport({
      authUserId: req.auth.UserId,
      postId: req.body.PostId,
      commentId: req.body.CommentId,
    });

    return res.status(201).json({ message: 'Reported !' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await reportService.getAllReports();
    return res.status(200).json(reports);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.getOneReport = async (req, res) => {
  try {
    const report = await reportService.getOneReport(req.params.id);
    return res.status(200).json(report);
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};

exports.deleteReport = async (req, res) => {
  try {
    await reportService.deleteReport({
      reportId: req.params.id,
      authUserId: req.auth.UserId,
      isAdmin: !!req.auth.isAdmin,
    });

    return res.status(200).json({ message: 'report supprimé !' });
  } catch (error) {
    const status = error?.statusCode || 500;
    return res.status(status).json({
      message: error?.message || 'An error occurred',
    });
  }
};
