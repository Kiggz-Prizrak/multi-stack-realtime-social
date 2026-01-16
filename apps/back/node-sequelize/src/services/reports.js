// services/reports.js
const reportRepository = require('../repositories/reports');

const { toInt } = require('../utils/parsing');
const {
  safeUnlink,
  extractFilenameFromMediaUrl,
} = require('../utils/filesystem');
const { httpError } = require('../utils/httpError');
exports.createReport = async ({ authUserId, postId, commentId }) => {
  const parsedPostId = toIntOrNull(postId);
  const parsedCommentId = toIntOrNull(commentId);

  if (!parsedPostId && !parsedCommentId) {
    const err = new Error('please select comment or post to report');
    err.statusCode = 400;
    throw err;
  }

  if (parsedPostId && parsedCommentId) {
    const err = new Error('please select between comment or post to report');
    err.statusCode = 400;
    throw err;
  }

  const alreadyReported = await reportRepository.existsForUserOnTarget({
    userId: authUserId,
    postId: parsedPostId,
    commentId: parsedCommentId,
  });

  if (alreadyReported) {
    const err = new Error('element already reported');
    err.statusCode = 400;
    throw err;
  }

  try {
    await reportRepository.create({
      userId: authUserId,
      postId: parsedPostId,
      commentId: parsedCommentId,
    });
  } catch (e) {
    const err = new Error('Error');
    err.statusCode = 500;
    throw err;
  }
};

exports.getAllReports = async () => {
  try {
    return await reportRepository.findAll();
  } catch (e) {
    const err = new Error('Failed to fetch reports');
    err.statusCode = 500;
    throw err;
  }
};

exports.getOneReport = async (reportId) => {
  const id = toInt(reportId);
  if (!id) {
    const err = new Error('Invalid report id');
    err.statusCode = 400;
    throw err;
  }

  const report = await reportRepository.findById(id);

  if (!report) {
    const err = new Error('Report not found');
    err.statusCode = 404;
    throw err;
  }

  return report;
};

exports.deleteReport = async ({ reportId, authUserId, isAdmin }) => {
  const id = toInt(reportId);
  if (!id) {
    const err = new Error('Invalid report id');
    err.statusCode = 400;
    throw err;
  }

  const report = await reportRepository.findById(id);
  if (!report) {
    const err = new Error('report not found');
    err.statusCode = 404;
    throw err;
  }

  if (report.UserId !== authUserId && !isAdmin) {
    const err = new Error('Unauthorized request');
    err.statusCode = 403;
    throw err;
  }

  try {
    await reportRepository.deleteById(id);
  } catch (e) {
    const err = new Error('Failed to delete report');
    err.statusCode = 500;
    throw err;
  }
};
