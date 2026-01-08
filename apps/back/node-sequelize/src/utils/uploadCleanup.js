const fs = require('fs/promises');

function getUploadedAvatarPath(req) {
  const file = req?.files?.avatar?.[0];
  if (!file?.filename) return null;
  return `images/${file.filename}`;
}

async function cleanupUploadedAvatar(req) {
  const path = getUploadedAvatarPath(req);
  if (!path) return;
  try {
    await fs.unlink(path);
  } catch (_) {
    console.log("file may already be deleted / doesn't exist");
  }
}

module.exports = { cleanupUploadedAvatar, getUploadedAvatarPath };
