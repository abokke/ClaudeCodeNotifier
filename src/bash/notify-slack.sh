# ========================================
# シンプル版 (curl使用 - Bash)
# ~/.claude/hooks/notify-slack.sh
# ========================================

#!/bin/bash

SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T09GF9RTK/BMTKWHDEG/xxxxxxxxx"

# 環境変数から情報取得
EVENT="${CLAUDE_HOOK_EVENT:-Unknown}"
SESSION_ID="${CLAUDE_SESSION_ID:-N/A}"
TOOL_NAME="${CLAUDE_TOOL_NAME:-N/A}"
FILE_PATHS="${CLAUDE_FILE_PATHS:-N/A}"

# ファイルパスを整形（最初の3つまで）
if [ "$FILE_PATHS" != "N/A" ]; then
  FILE_DISPLAY=$(echo "$FILE_PATHS" | tr ' ' '\n' | head -3 | paste -sd ',' -)
else
  FILE_DISPLAY="なし"
fi

# Slack通知用JSON作成
JSON_PAYLOAD=$(cat <<EOF
{
  "username": "Claude Code BOT",
  "icon_emoji": ":robot_face:",
  "attachments": [
    {
      "color": "good",
      "title": "✅ Claude Code 実行完了",
      "fields": [
        {
          "title": "イベント",
          "value": "$EVENT",
          "short": true
        },
        {
          "title": "使用ツール",
          "value": "$TOOL_NAME",
          "short": true
        },
        {
          "title": "変更ファイル",
          "value": "$FILE_DISPLAY",
          "short": false
        }
      ],
      "footer": "Claude Code Development Notifier",
      "ts": $(date +%s)
    }
  ]
}
EOF
)

# Slackに直接POST
curl -s -X POST "$SLACK_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$JSON_PAYLOAD" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo "✓ Slack通知を送信しました"
else
  echo "✗ Slack通知エラー"
fi