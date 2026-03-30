# Job Hunting Management System

就職活動における企業情報、ES内容、および選考スケジュールを効率的に一元管理するためのWebアプリケーションです。

## 公開URL

https://job-hunting-management-ahkndzx40-kennnnnnos-projects.vercel.app/

## 🛠 使用技術

- **Frontend**: Next.js (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Dexie.js (IndexedDB)
- **Deployment**: Vercel

## 主な機能と技術的アピールポイント

企業ごとのID/PWなどの機密情報を外部サーバーに送信せず、ブラウザ内データベース（IndexedDB）のみで完結させることで、プライバシーに配慮したセキュアな情報管理を実現しています。また外部データベースを利用しないことで、コストをかけずに安定したデプロイを可能にしました。
また企業詳細モーダルを開いた際、使用頻度を考慮して「Upcoming Events（直近の予定）」「Entry Sheet / Notes(メモ)」「My Page Info(IDなど)」の順に配置しました。必要な情報を最短ステップで確認できる設計にこだわりました。

## ディレクトリ構成

```text
src/
├── app/
│   └── page.tsx        # メインロジック・タブ切り替え
├── components/
│   ├── ListView.tsx    # 企業一覧表示
│   ├── CalendarView.tsx # カレンダー表示
│   ├── CompanyDetailModal.tsx # 企業詳細・ES編集（切り出し済み）
│   └── AddCompanyModal.tsx    # 新規企業登録（切り出し済み）
└── lib/
    └── db.ts           # Dexie.js データベース定義
```
