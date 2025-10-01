# 🚀 セットアップ手順

## ステップ1: Slack Incoming Webhook URL取得

1. SlackワークスペースでIncoming Webhooksを設定
2. Webhook URLをコピー

## ステップ2: Hookスクリプト作成

### 方法A: Node.js版 (推奨 - Windows/Mac/Linux対応)

```bash
# スクリプト作成
mkdir -p ~/.claude/hooks
nano ~/.claude/hooks/notify-slack.js

# 上記のNode.jsコードを貼り付け
# SLACK_WEBHOOK_URL を自分のURLに変更

# 実行権限付与
chmod +x ~/.claude/hooks/notify-slack.js
```

### 方法B: Bash版 (Mac/Linux - 最もシンプル)

```bash
nano ~/.claude/hooks/notify-slack.sh

# 上記のBashコードを貼り付け
chmod +x ~/.claude/hooks/notify-slack.sh
```

### 方法C: Python版 (クロスプラットフォーム)

```bash
nano ~/.claude/hooks/notify-slack.py

# 上記のPythonコードを貼り付け
chmod +x ~/.claude/hooks/notify-slack.py
```

## ステップ3: Claude Code設定

```bash
# Claude Code起動
claude

# Hooks設定
/hooks
```

または直接編集:

```bash
nano ~/.config/claude-code/settings.json
```

## 💡 メリット

✅ **高速**: 直接通信で遅延なし  
✅ **管理が楽**: スクリプト1つだけ  
✅ **デバッグ簡単**: ローカルで完結

## 🎯 動作確認

```bash
# テスト実行
node ~/.claude/hooks/notify-slack.js
# または
bash ~/.claude/hooks/notify-slack.sh
```

これで、Claude Codeでの作業完了時に自動でSlackに通知が飛びます!
