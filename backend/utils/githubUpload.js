const { Octokit } = require("@octokit/rest");

const { GITHUB_OWNER, GITHUB_REPO, GITHUB_TOKEN } = require("../config/github");

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

/* =========================================
   UPLOAD IMAGE TO GITHUB
========================================= */

const uploadImageToGitHub = async ({
  buffer,
  fileName,
  folder = "projects",
}) => {
  if (!buffer) {
    throw new Error("Image buffer is required.");
  }

  if (!fileName) {
    throw new Error("Image file name is required.");
  }

  const filePath = `${folder}/${fileName}`;

  const content = buffer.toString("base64");

  const response = await octokit.repos.createOrUpdateFileContents({
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    path: filePath,
    message: `Upload ${filePath}`,
    content,
  });

  return {
    path: filePath,
    sha: response.data.content.sha,
    url: `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/main/${filePath}`,
  };
};

/* =========================================
   DELETE IMAGE FROM GITHUB
========================================= */

const deleteImageFromGitHub = async (filePath) => {
  if (!filePath) {
    return;
  }

  try {
    const fileResponse = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
    });

    if (Array.isArray(fileResponse.data)) {
      return;
    }

    await octokit.repos.deleteFile({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Delete ${filePath}`,
      sha: fileResponse.data.sha,
    });
  } catch (error) {
    // Don't break project deletion if
    // the GitHub image is already gone.

    if (error.status === 404) {
      console.warn(`GitHub image not found: ${filePath}`);

      return;
    }

    throw error;
  }
};

/* =========================================
   EXPORTS
========================================= */

module.exports = {
  uploadImageToGitHub,
  deleteImageFromGitHub,
};
