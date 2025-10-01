# ========================================
# Python版 (クロスプラットフォーム対応)
# ~/.claude/hooks/notify-slack.py
# ========================================

#!/usr/bin/env python3
import os
import sys
import json
from datetime import datetime

try:
    from urllib import request
except ImportError:
    import urllib2 as request

# Slack Incoming Webhook URL
SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/T09GF9RTK/BMTKWHDEG/xxxxxxxxx'

def send_slack_notification():
    # 環境変数から情報取得
    event = os.environ.get('CLAUDE_HOOK_EVENT', 'Unknown')
    session_id = os.environ.get('CLAUDE_SESSION_ID', 'N/A')
    tool_name = os.environ.get('CLAUDE_TOOL_NAME', 'N/A')
    file_paths = os.environ.get('CLAUDE_FILE_PATHS', 'N/A')
    
    # ファイルパス整形
    if file_paths != 'N/A':
        files = file_paths.split()[:3]
        file_display = '\n'.join(files)
    else:
        file_display = 'なし'
    
    # Slack通知ペイロード
    payload = {
        "username": "Claude Code BOT",
        "icon_emoji": ":robot_face:",
        "attachments": [{
            "color": "good",
            "title": "✅ Claude Code 実行完了",
            "fields": [
                {
                    "title": "イベント",
                    "value": event,
                    "short": True
                },
                {
                    "title": "使用ツール",
                    "value": tool_name,
                    "short": True
                },
                {
                    "title": "変更ファイル",
                    "value": file_display,
                    "short": False
                }
            ],
            "footer": "Claude Code Development Notifier",
            "ts": int(datetime.now().timestamp())
        }]
    }
    
    # Slackに直接POST
    data = json.dumps(payload).encode('utf-8')
    req = request.Request(
        SLACK_WEBHOOK_URL,
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    
    try:
        response = request.urlopen(req)
        if response.status == 200:
            print('✓ Slack通知を送信しました')
        else:
            print(f'✗ Slack通知エラー: {response.status}', file=sys.stderr)
    except Exception as e:
        print(f'✗ 通信エラー: {str(e)}', file=sys.stderr)

if __name__ == '__main__':
    send_slack_notification()
