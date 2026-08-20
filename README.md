# A-MAX

A-MAX is a cinematic digital home for filmmakers: a place to showcase work, build a portfolio, find collaborators, learn the craft, and join communities.

## Run locally

```bash
npm install
npm install --prefix client
npm install --prefix server
npm run dev
```

The client runs at `http://localhost:5173` and the API at `http://localhost:5000`. Copy `server/.env.example` to `server/.env` and `client/.env.example` to `client/.env` when configuring persistence and Google sign-in. Add `http://localhost:5173` as an authorized JavaScript origin in Google Cloud Console. The API intentionally boots without MongoDB so the client can be explored before infrastructure is configured.

## Architecture

```text
A-MAX/
  client/                  Vite + React application
    src/
      App.jsx              Route shell and phase-one product surfaces
      styles.css            Cinematic responsive design system
      main.jsx              Browser entrypoint
  server/                  Express + Socket.IO API
    src/
      models/               Mongoose domain models
      routes/               Resource-focused REST routes
      middleware/           Authentication and authorization
      server.js             HTTP, Socket.IO, and Mongo bootstrap
```

The client uses React Router and is ready to move API calls into an Axios service layer as each module becomes persistent. The server separates transport, domain models, and access control. Socket.IO rooms are used for conversation membership; the next messaging phase can add a Conversation and Message model without changing the client shell.

## Domain schema

The data model is intentionally reference-oriented:

- `User`: identity, flexible creative roles, profile, skills, followers, and following.
- `Content`: films, trailers, scripts, stories, and BTS media owned by a creator.
- `Community`: members and moderators; community posts and comments will reference both community and author.
- `Comment`, `Review`, `Bookmark`, `Follow`, `Notification`: activity records referencing users and their target resource.
- `Conversation`, `Message`, `Group`: direct and group communication, with Socket.IO room IDs.
- `MarketplaceProduct`, `Wishlist`: equipment listings, seller ownership, and buyer saves.
- `LearningModule`, `LearningProgress`: structured lessons and per-user completion state.
- `Report`: moderation queue with reporter, target, reason, status, and moderator resolution.

## Page map

Public routes: `/`, `/explore`, `/films/:id`, `/scripts/:id`, `/profile/:username`, `/marketplace`, `/products/:id`, `/learn`, `/learn/:slug`, `/news`, `/login`, `/register`.

Protected routes: `/home`, `/upload`, `/profile/edit`, `/dashboard`, `/messages`, `/communities`, `/communities/:id`, `/notifications`, `/bookmarks`, `/wishlist`, `/listings`, `/settings`.

Admin routes: `/admin`, `/admin/users`, `/admin/content`, `/admin/marketplace`, `/admin/communities`.

The current UI implements the high-signal first slice: home feed, film exploration, creator profile, learning workshop, communities, responsive navigation, create/upload entry points, and route placeholders for the remaining modules. It uses remote image URLs for prototype media; production uploads should be routed through a signed Cloudinary or S3 flow and persisted as media metadata.

## Delivery phases

1. Foundation: auth, roles, profiles, navigation, database connection.
2. Core showcase: uploads, film detail, interactions, follows, portfolio.
3. Community: posts, discussions, direct and group messaging, notifications.
4. Learning: modules, search, bookmarks, completion progress.
5. Marketplace: listings, filters, wishlists, seller dashboard.
6. Integrations: movie metadata and industry news, kept separate from user content.
7. Admin and polish: moderation, analytics, validation, testing, and performance.