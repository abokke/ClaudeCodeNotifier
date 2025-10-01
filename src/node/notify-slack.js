#!/usr/bin/env node

// ========================================
// Claude Code Hook: 直接Slack通知 (Node.js版)
// ~/.claude/hooks/notify-slack.js
// ========================================

// Slack Incoming Webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/T09GF9RTK/BMTKWHDEG/xxxxxxxxx';

// 環境変数から情報を取得
const event = process.env.CLAUDE_HOOK_EVENT || 'Unknown';
const sessionId = process.env.CLAUDE_SESSION_ID || '';
const toolName = process.env.CLAUDE_TOOL_NAME || '';
const filePaths = process.env.CLAUDE_FILE_PATHS || '';

// stdinからJSONデータを読み込み
let stdinData = '';
if (!process.stdin.isTTY) {
  process.stdin.on('data', chunk => {
    stdinData += chunk;
  });
}

process.stdin.on('end', async () => {
  let hookData = {};
  
  if (stdinData) {
    try {
      hookData = JSON.parse(stdinData);
    } catch (e) {
      // JSON解析失敗時は無視
    }
  }
  
  // Slack通知内容を構築
  const fields = [];
  
  fields.push({
    title: "イベント",
    value: event,
    short: true
  });
  
  if (sessionId) {
    fields.push({
      title: "セッションID",
      value: sessionId.substring(0, 8),
      short: true
    });
  }
  
  if (toolName) {
    fields.push({
      title: "使用ツール",
      value: toolName,
      short: true
    });
  }
  
  if (filePaths) {
    const files = filePaths.split(' ').slice(0, 5);
    fields.push({
      title: "変更ファイル",
      value: files.join('\n'),
      short: false
    });
  }
  
  const slackPayload = {
    username: "Claude Code BOT",
    icon_emoji: ":robot_face:",
    attachments: [{
      color: "good",
      title: "✅ Claude Code 実行完了",
      fields: fields,
      footer: "Claude Code Development Notifier",
      ts: Math.floor(Date.now() / 1000)
    }]
  };
  
  // Slackに直接POST
  try {
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slackPayload)
    });
    
    if (response.ok) {
      console.log('✓ Slack通知を送信しました');
    } else {
      console.error('✗ Slack通知エラー:', response.status);
    }
  } catch (error) {
    console.error('✗ 通信エラー:', error.message);
  }
});

// stdinの読み込み開始
if (process.stdin.isTTY) {
  process.stdin.emit('end');
}