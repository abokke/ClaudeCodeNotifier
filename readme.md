# Claude Code Slack通知Hook 📢

## 概要

このツールは、**Claude Code**でのコード編集・実行完了時に、自動的に**Slack**にリアルタイム通知を送信するHookシステムです。

### 🎯 主な機能
- Claude Codeでの作業完了時に自動でSlack通知
- 実行されたツール名、変更ファイル、セッション情報を通知
- 3つの実装方式（Node.js/Bash/Python）から選択可能
- ローカル環境で完結する高速・軽量設計

### 📋 通知内容
- イベント種別（Write、Edit、Read等）
- 使用したClaude Codeツール名
- 変更されたファイルパス
- セッションID（短縮版）
- 実行時刻

## 前提条件

このツールを使用するには、以下のランタイム環境が必要です：

### 必須要件
- **Claude Code**: インストール済み
- **curl**: HTTP通信用（Bash版で使用）

### 選択可能なランタイム（いずれか1つ）

#### 方法A: Node.js版 (推奨)
- **Node.js**: v14.0.0以上
- **対応OS**: Windows/Mac/Linux
- **特徴**: fetch APIを使用した高速通信

#### 方法B: Bash版 (最もシンプル)
- **Bash**: 4.0以上
- **curl**: HTTP通信用
- **対応OS**: Mac/Linux
- **特徴**: 外部依存なし、最小構成

#### 方法C: Python版 (クロスプラットフォーム)
- **Python**: 3.6以上
- **対応OS**: Windows/Mac/Linux
- **特徴**: 標準ライブラリのみ使用

### 環境確認コマンド

```bash
# Node.js版の確認
node --version

# Bash版の確認
bash --version && curl --version

# Python版の確認
python3 --version
```

## ステップ1: Slack Incoming Webhook URL取得

### 1. Slackアプリの作成
1. [Slack API](https://api.slack.com/apps)にアクセス
2. 「Create New App」をクリック
3. 「From scratch」を選択
4. アプリ名（例: Claude Code Notifier）とワークスペースを選択

### 2. Incoming Webhookの有効化
1. 左メニューから「Incoming Webhooks」を選択
2. 「Activate Incoming Webhooks」をONに設定
3. 「Add New Webhook to Workspace」をクリック
4. 通知を送信するチャンネルを選択
5. 「Allow」をクリック

### 3. Webhook URLのコピー
- 作成されたWebhook URLをコピー（`https://hooks.slack.com/services/...`形式）

## ステップ2: Hookスクリプト作成

### 方法A: Node.js版 (推奨 - Windows/Mac/Linux対応)

```bash
# スクリプト作成
mkdir -p ~/.claude/hooks
cp src/node/notify-slack.js ~/.claude/hooks/

# Webhook URLを編集（YOUR_WEBHOOK_URLを実際のURLに変更）
nano ~/.claude/hooks/notify-slack.js

# 実行権限付与
chmod +x ~/.claude/hooks/notify-slack.js
```

### 方法B: Bash版 (Mac/Linux - 最もシンプル)

```bash
# スクリプト作成
mkdir -p ~/.claude/hooks
cp src/bash/notify-slack.sh ~/.claude/hooks/

# Webhook URLを編集（YOUR_WEBHOOK_URLを実際のURLに変更）
nano ~/.claude/hooks/notify-slack.sh

# 実行権限付与
chmod +x ~/.claude/hooks/notify-slack.sh
```

### 方法C: Python版 (クロスプラットフォーム)

```bash
# スクリプト作成
mkdir -p ~/.claude/hooks
cp src/python/notify-slack.py ~/.claude/hooks/

# Webhook URLを編集（YOUR_WEBHOOK_URLを実際のURLに変更）
nano ~/.claude/hooks/notify-slack.py

# 実行権限付与
chmod +x ~/.claude/hooks/notify-slack.py
```

## ステップ3: Claude Code Hook設定

### 方法A: Claude Code内で設定（推奨）

```bash
# Claude Code起動
claude

# Hooks設定コマンドを実行
/hooks
```

設定画面で以下を入力：
- **Hook名**: `slack-notify`
- **実行条件**: `on_tool_complete` (ツール実行完了時)
- **スクリプトパス**:
  - Node.js版: `~/.claude/hooks/notify-slack.js`
  - Bash版: `~/.claude/hooks/notify-slack.sh`
  - Python版: `~/.claude/hooks/notify-slack.py`

### 方法B: 設定ファイル直接編集

```bash
# Claude Code設定ファイルを編集
nano ~/.claude/settings.json
```

以下の設定を追加：

```json
{
  "hooks": {
    "on_tool_complete": [
      {
        "name": "slack-notify",
        "command": "~/.claude/hooks/notify-slack.js",
        "enabled": true
      }
    ]
  }
}
```

> **注意**: Bash版の場合は `"command": "/bin/bash ~/.claude/hooks/notify-slack.sh"`
> Python版の場合は `"command": "python3 ~/.claude/hooks/notify-slack.py"`

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

## 📚 利用可能な環境変数

スクリプトでは以下の環境変数を自動取得して通知に含めます：

| 環境変数 | 説明 | 例 |
|---------|------|-----|
| `CLAUDE_HOOK_EVENT` | 発生したイベント種別 | `Write`, `Edit`, `Read` |
| `CLAUDE_TOOL_NAME` | 実行されたツール名 | `Write`, `MultiEdit`, `Bash` |
| `CLAUDE_FILE_PATHS` | 操作対象ファイルパス（スペース区切り） | `src/main.js config.json` |
| `CLAUDE_SESSION_ID` | セッション識別子（通知では短縮版） | `abc12345...` |

## 🔧 トラブルシューティング

### 通知が送信されない場合

1. **Webhook URLの確認**
   ```bash
   # URLが正しく設定されているか確認
   grep "SLACK_WEBHOOK_URL" ~/.claude/hooks/notify-slack.*
   ```

2. **スクリプトの実行権限確認**
   ```bash
   ls -la ~/.claude/hooks/notify-slack.*
   # 実行権限(-x)があることを確認
   ```

3. **手動テスト実行**
   ```bash
   # Node.js版
   CLAUDE_HOOK_EVENT=test_event node ~/.claude/hooks/notify-slack.js

   # Bash版
   CLAUDE_HOOK_EVENT=test_event bash ~/.claude/hooks/notify-slack.sh

   # Python版
   CLAUDE_HOOK_EVENT=test_event python3 ~/.claude/hooks/notify-slack.py
   ```

### よくあるエラーと解決方法

| エラー | 原因 | 解決方法 |
|-------|------|---------|
| `403 Forbidden` | 無効なWebhook URL | Slack設定を再確認 |
| `Permission denied` | 実行権限なし | `chmod +x` で権限付与 |
| `Command not found` | ランタイム未インストール | Node.js/Python3をインストール |
| `Connection failed` | ネットワーク問題 | インターネット接続を確認 |

### Claude Code Hook設定の確認

```bash
# 設定ファイルの確認
cat ~/.claude/settings.json

# Hookディレクトリの確認
ls -la ~/.claude/hooks/
```

### ログ確認（Node.js版のみ）

デバッグ用に詳細ログを有効にする場合：

```javascript
// notify-slack.js の console.log を有効化
console.log('Hook data:', hookData);
console.log('Payload:', JSON.stringify(slackPayload, null, 2));
```
