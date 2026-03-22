import { readFileSync, writeFileSync } from 'fs';
import { TwitterApi } from 'twitter-api-v2';
import { appendFileSync } from 'fs';

// ---- Dry-run mode (手動テスト用: 投稿せず状態も更新しない) ----
const isDryRun = process.env.DRY_RUN === 'true';
if (isDryRun) {
  console.log('=== DRY RUN MODE (投稿・状態更新をスキップ) ===');
}

// ---- Load data ----
const posts = JSON.parse(readFileSync('data/posts.json', 'utf-8')).posts;
const state = JSON.parse(readFileSync('state/post-state.json', 'utf-8'));

const postsA = posts.filter(p => p.type === 'A');
const postsB = posts.filter(p => p.type === 'B');

// ---- Determine post type (A:B = 2:1) ----
const rotation = state.rotationCount % 3;
const postType = rotation < 2 ? 'A' : 'B';
const targetPosts = postType === 'A' ? postsA : postsB;
const usedKey = postType === 'A' ? 'usedA' : 'usedB';

// ---- Select random unused post ----
let cycleCompleted = false;
let available = targetPosts.filter(p => !state[usedKey].includes(p.id));

if (available.length === 0) {
  // All posts used — reset and notify
  state[usedKey] = [];
  available = targetPosts;
  cycleCompleted = true;
}

const selected = available[Math.floor(Math.random() * available.length)];

// ---- Compose tweet ----
let tweetText = selected.text;
if (selected.url) {
  tweetText += '\n' + selected.url;
}
if (selected.tags) {
  tweetText += '\n\n' + selected.tags;
}

console.log(`Type: ${postType} | ID: ${selected.id}`);
console.log(`Tweet: ${tweetText}`);

// ---- Post to X ----
if (isDryRun) {
  console.log('DRY RUN: 投稿をスキップしました');
  console.log('DRY RUN: 状態更新をスキップしました');
} else {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY,
    appSecret: process.env.X_API_SECRET,
    accessToken: process.env.X_ACCESS_TOKEN,
    accessSecret: process.env.X_ACCESS_SECRET,
  });

  try {
    const result = await client.v2.tweet(tweetText);
    console.log(`Posted successfully: ${result.data.id}`);
  } catch (error) {
    console.error(`Failed to post: ${error.message}`);
    if (error.data) {
      console.error(JSON.stringify(error.data, null, 2));
    }
    process.exit(1);
  }

  // ---- Update state ----
  state[usedKey].push(selected.id);
  state.rotationCount += 1;
  writeFileSync('state/post-state.json', JSON.stringify(state, null, 2) + '\n');
  console.log('State updated.');
}

// ---- Set GitHub Actions outputs ----
const ghOutput = process.env.GITHUB_OUTPUT;
if (ghOutput) {
  if (cycleCompleted) {
    const typeName = postType === 'A' ? '寄り添い（A）' : '紹介（B）';
    appendFileSync(ghOutput, `cycle_completed=true\n`);
    appendFileSync(ghOutput, `completed_type=${typeName}\n`);
    appendFileSync(ghOutput, `cycle_message=${typeName}タイプの全投稿が一巡しました。新しいサイクルが開始されました。\n`);
  } else {
    appendFileSync(ghOutput, `cycle_completed=false\n`);
  }
}
