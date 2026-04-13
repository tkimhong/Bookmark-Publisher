# Book It

A bookmark manager built with Express, Handlebars, and vhost subdomain routing.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

- Public: http://localhost:3000
- Admin: http://admin.localhost:3000

## Credentials

| Username | Password |
| -------- | -------- |
| admin    | admin123 |

## Routes

### Public (`localhost:3000`)

| Method | Path             | Description             |
| ------ | ---------------- | ----------------------- |
| GET    | /                | Home – recent bookmarks |
| GET    | /bookmarks       | All active bookmarks    |
| GET    | /bookmarks/:slug | Bookmark detail         |
| GET    | /tag/:tagSlug    | Bookmarks by tag        |
| GET    | /search?q=…      | Search by title         |

### Admin (`admin.localhost:3000`)

| Method | Path                       | Description        |
| ------ | -------------------------- | ------------------ |
| GET    | /login                     | Login page         |
| POST   | /login                     | Submit login       |
| POST   | /logout                    | Logout             |
| GET    | /                          | Dashboard          |
| GET    | /bookmarks                 | All bookmarks      |
| GET    | /bookmarks/new             | New bookmark form  |
| POST   | /bookmarks/new             | Create bookmark    |
| GET    | /bookmarks/:slug/edit      | Edit bookmark form |
| POST   | /bookmarks/:slug/edit      | Update bookmark    |
| POST   | /bookmarks/:slug/delete    | Delete bookmark    |
| POST   | /bookmarks/:slug/archive   | Archive bookmark   |
| POST   | /bookmarks/:slug/unarchive | Unarchive bookmark |

## Middleware Order

1. `logger` - logs every request
2. `/login` - public, no auth required
3. `adminAuth` - checks session cookie, redirects to `/login` if missing
4. controllers - route handlers run here
5. `autoRender` - fallback for static views with no explicit route
6. `notFound` - 404 catch-all

`adminAuth` is registered with `router.use()` after the login routes and before all protected routes, so login is always reachable but everything else requires a valid session.

## Notes

- In-memory storage only, data resets on server restart
- Archived bookmarks are hidden on the public side but visible in admin
- Seed data in `data/mock.js` (8 bookmarks, mixed tags, 2 archived)
