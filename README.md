# RouteLink

> 計畫數位化，行程更精準

RouteLink 是一款路線規劃與管理應用程式，幫助有效管理常用地點並規劃每日行程。

## 功能特色

### 常用地點庫

- 儲存地點
- 新增地點名稱與完整地址
- 編輯與刪除地點
- 依名稱搜尋地點

### 今日行程

- 將地點加入今日行程
- 查看所有未完成項目
- 標記完成狀態
- 為每筆行程新增備註
- 一鍵開啟 Google Maps 導航
- 全部完成後自動清空行程

### 使用體驗

- 響應式設計（手機與桌面）
- PWA 支援，可安裝至主畫面
- 美觀的海洋背景主題

## 技術架構

### 前端

- **框架**: Nuxt 4 (Vue 3)
- **樣式**: Tailwind CSS 4
- **狀態管理**: Pinia
- **資料請求**: TanStack Vue Query + Axios
- **PWA**: @vite-pwa/nuxt

### 後端

- **執行環境**: Nuxt Server Routes
- **資料庫**: PostgreSQL
- **認證**: Supabase Auth

## 快速開始

### 環境需求

- Node.js 18+
- PostgreSQL
- Supabase 專案

### 安裝步驟

```bash
# 1. 複製專案
git clone <repository-url>
cd deliver-helper

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 填入 Supabase 與資料庫連線資訊

# 4. 啟動開發伺服器
npm run dev
```

### 環境變數

```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
DATABASE_URL=postgresql://user:password@host:port/database
```

### 資料庫結構

```sql
-- 地點表
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name VARCHAR NOT NULL,
  address VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 行程表
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  location_id UUID NOT NULL REFERENCES locations(id),
  note TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 專案結構

```
deliver-helper/
├── app/
│   ├── pages/           # 頁面元件
│   ├── components/      # 共用元件
│   ├── layouts/         # 版面配置
│   ├── middleware/      # 路由守衛
│   ├── stores/          # Pinia 狀態管理
│   └── plugins/         # Nuxt 插件
├── server/
│   ├── api/             # API 端點
│   └── utils/           # 伺服器工具
├── public/              # 靜態資源
└── nuxt.config.ts       # Nuxt 設定
```

## API 端點

### 地點 API

| 方法   | 路徑                  | 說明         |
| ------ | --------------------- | ------------ |
| GET    | `/api/locations`      | 取得所有地點 |
| POST   | `/api/locations`      | 新增地點     |
| PUT    | `/api/locations/[id]` | 更新地點     |
| DELETE | `/api/locations/[id]` | 刪除地點     |

### 行程 API

| 方法   | 路徑                  | 說明                       |
| ------ | --------------------- | -------------------------- |
| GET    | `/api/schedules`      | 取得所有行程（含地點資料） |
| POST   | `/api/schedules`      | 新增行程                   |
| PUT    | `/api/schedules/[id]` | 更新行程（備註/完成狀態）  |
| DELETE | `/api/schedules/[id]` | 刪除行程                   |

## 部署

### 建置

```bash
npm run build
```

### 預覽

```bash
npm run preview
```
