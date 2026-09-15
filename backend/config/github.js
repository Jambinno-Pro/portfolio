const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_OWNER || !GITHUB_REPO || !GITHUB_TOKEN) {
  console.warn("⚠️ GitHub image storage environment variables are missing.");
}

module.exports = {
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_TOKEN,
};
