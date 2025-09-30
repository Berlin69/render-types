# Next + shadcn Test App

Тестовое задание: Next.js (App Router), 4 вида рендеринга (CSR/SSR/SSG/ISR), работа с API (jsonplaceholder), модальное
окно (text + file) с POST на внутренний API, прогресс загрузки файла (XHR), демо WebSocket (public echo). UI —
shadcn/ui + Tailwind.

## Содержание

* [Демо и репозиторий](#демо-и-репозиторий)
* [Стек и решения](#стек-и-решения)
* [Структура проекта](#структура-проекта)
* [Страницы и режимы рендеринга](#страницы-и-режимы-рендеринга)
* [Работа с API](#работа-с-api)
* [Модалка, POST и прогресс загрузки (XHR)](#модалка-post-и-прогресс-загрузки-xhr)
* [WebSocket demo](#websocket-demo)
* [Запуск локально](#запуск-локально)
* [Скрипты npm](#скрипты-npm)
* [Переменные окружения](#переменные-окружения)
* [Деплой на Vercel](#деплой-на-vercel)
* [Доступность и стили](#доступность-и-стили)
* [Ограничения и заметки](#ограничения-и-заметки)

## Демо и репозиторий

> Ссылки добавьте после деплоя

* Прод: `https://<your-app>.vercel.app/`
* Репозиторий: `https://github.com/<you>/<repo>`

## Стек и решения

* **Next.js (App Router) + TypeScript**
* **Tailwind CSS + shadcn/ui** (компоненты: dialog, input, textarea, button, navigation-menu, progress, sonner)
* **Data fetching**: в зависимости от страницы (см. ниже)

    * CSR: SWR
    * SSR: fetch с `cache: "no-store"`
    * SSG: `dynamic = "force-static"`
    * ISR: `revalidate = 60`
* **Формы**: `react-hook-form + zod`
* **Уведомления**: `sonner`

## Структура проекта

```
/app
  page.tsx                # Главная (статическая)
  /client/page.tsx        # CSR
  /todos/page.tsx         # SSR
  /posts/page.tsx         # SSG
  /users/page.tsx         # ISR
  /ws-demo/page.tsx       # WebSocket demo (echo)
  /api/submit/route.ts    # POST endpoint для модалки
/components
  /navbar.tsx             # Top navigation (shadcn NavigationMenu)
  /upload-modal.tsx       # Dialog с text + file, XHR-прогресс
  /theme-provider.tsx
  /ui/*                   # shadcn компоненты
/lib
  /api.ts                 # jsonplaceholder хелперы (типизировано)
/styles
  globals.css             # Tailwind base
```

## Страницы и режимы рендеринга

* **`/client` (CSR)** — чистый клиентский рендер. Данные запрашиваются на стороне клиента через SWR (`useSWR`).
* **`/todos` (SSR)** — серверный рендер на каждый запрос. Используется `fetch(..., { cache: "no-store" })` и
  `export const dynamic = "force-dynamic"`.
* **`/posts` (SSG)** — статическая генерация на билд‑тайме: `export const dynamic = "force-static"` и `fetch` с
  `revalidate: false`.
* **`/users` (ISR)** — инкрементальная регенерация: `export const revalidate = 60`, Next заново собирает страницу не
  чаще, чем раз в 60 сек при обращении.

## Работа с API

**Источник данных:** `https://jsonplaceholder.typicode.com`

Хелперы в `lib/api.ts`:

* `getTodos(limit)` — SSR (no-store)
* `getPosts(limit)` — SSG (static)
* `getUsers()` — ISR (revalidate: 60)

Каждая страница отображает данные в своём стиле (списки/таблица), состояния загрузки/ошибок предусмотрены.

## Модалка, POST и прогресс загрузки (XHR)

* Компонент `UploadModal` открывается из Navbar → шадсн `Dialog`.
* Поля: `name` (text), `comment` (textarea), `file` (file). Валидация `zod`.
* Отправка данных на **внутренний API** `/api/submit`:

    * Если выбран файл, используется **XHR** для получения **прогресса загрузки** (`xhr.upload.onprogress`).
    * Отображается `Progress` (shadcn) и процент.
    * По завершении — уведомления через `sonner`.
* Сервер отвечает эхо‑JSON (имя, размер файла и т.п.). Хранение не требуется (демо).

## WebSocket demo

**Цель:** показать рабочее WS‑соединение без бэкенда.

* По умолчанию используется публичный **echo WebSocket**: `wss://socketsbay.com/wss/v2/1/demo/`.
* Фоллбэки (указать вручную в `.env.local`, если основной недоступен):

    * `wss://ws.ifelse.io`
    * `wss://ws.vi-server.org/mirror`
    * `wss://echo-websocket.fly.dev`
* Страница `/ws-demo`:

    * статус соединения, поле ввода, отправка сообщений, лог `[send]/[recv]`, авто‑reconnect (экспоненциальный бэкофф,
      до 5с).

## Запуск локально

```bash
# Установка зависимостей
npm i

# (опционально) создать .env.local
cp .env.local.example .env.local
# отредактируйте NEXT_PUBLIC_WS_URL при необходимости

# Dev-режим
npm run dev
# http://localhost:3000
```

## Скрипты npm

* `dev` — запуск dev-сервера
* `build` — сборка
* `start` — запуск прод-сборки локально
* `lint` — ESLint

## Переменные окружения

```
NEXT_PUBLIC_WS_URL=wss://socketsbay.com/wss/v2/1/demo/
```

> При деплое на Vercel добавьте эту переменную в **Project Settings → Environment Variables**.

## Деплой на Vercel

1. Подключите репозиторий GitHub к Vercel.
2. В Project Settings → Environment Variables добавьте `NEXT_PUBLIC_WS_URL`.
3. Deploy → проверьте `/`, `/client`, `/todos`, `/posts`, `/users`, `/ws-demo`.

## Доступность и стили

* Компоненты shadcn/ui уже содержат базовые a11y‑атрибуты.
* Навигация с клавиатуры, закрытие диалога по `Esc` и клику‑оверлею.
* Tailwind для отступов/типографики; единый радиус через CSS‑переменную `--radius`.

## Ограничения и заметки

* Публичные echo‑WS могут быть недоступны в некоторых сетях — используйте фоллбэк.
* Лимиты Vercel для размера запроса/времени выполнения: для демо‑аплоада достаточно, но большие файлы не предназначены.
* jsonplaceholder — публичный демо‑API, данные фиксированные, без auth.

---

**Авторские заметки (для ревью):**

* Показаны все режимы рендеринга Next (CSR/SSR/SSG/ISR) на разных страницах.
* Реализована форма с валидацией, отправка `FormData` на внутренний API и визуализация прогресса аплоада через XHR.
* WebSocket‑демо на публичном echo без бэкенда, с устойчивым reconnect и логом.
