# sidequests.nz

<img src="https://sidequests.nz/wordmark.svg" alt="Sidequests Logo" height="40" style="background-color:white; padding: 13px" />

[Sidequests](https://sidequests.nz) is a web app that helps users discover and complete small adventures ("sidequests") near them... from scenic trails to quirky urban landmarks. The goal is to build a community-driven platform of user-submitted quests across New Zealand, where users can track progress, leave comments, and view each other’s profiles.

The first phase of the project is live and deployed, with ongoing development underway.

View it for yourself: [https://sidequests.nz](https://sidequests.nz)

## Features Roadmap
- [x] Login with email/password & one-click Google sign-in using JWT authentication
- [x] Email verification & password resets via tokens with TTL stored in the database
- [x] Interactive Leaflet map to explore quests across New Zealand, featuring debounced, lazy loading for performance
- [x] Quest checklist with progress tracking, saved state, user comments, and recent activity feed
- [x] Quest submission form
- [x] Search quests with natural language query processing
- [ ] User profile page (upcoming)
- [ ] Content moderation queue with user reporting and filtering of inappropriate content (upcoming)

## Screenshots

<img src="https://sidequests.nz/github_screenshot.png" alt="Screenshot of the Sidequests app" width="700px" />

## Technical Description

### Frontend
The frontend is built with **React** and **TypeScript**, leveraging modern React features such as **functional components, hooks, and context API** for clean, efficient state management. The app is bundled with **Vite** for fast development and optimized builds, with navigation handled by **React Router**.

The app uses the **Leaflet** map library with **React-Leaflet** bindings, displaying styled maps from **OpenStreetMap** via **CARTO’s Voyager** tile service.

Styling is done with **Tailwind CSS**, enabling utility-first styling with a responsive design approach.

### Backend
The backend is built with **TypeScript** and **Node.js**, using **Express** for routing and HTTPS handling due to its simplicity, flexibility, and wide ecosystem support.

**MongoDB** was chosen as the database for its flexible schema design and native support for geospatial queries, which are essential for location-based quest discovery. **Mongoose** is used as an ODM to provide a structured, schema-based approach to modeling and querying data.

Authentication is implemented with **JSON Web Tokens** for secure, stateless sessions, along with **Google OAuth** login support for seamless login UX.

Email functionality is handled with **Resend**, using **MJML** for responsive email templating.

### Deployment
Sidequests is deployed on a **DigitalOcean Ubuntu Droplet**. The backend is managed with **PM2** for process management, while **Caddy** acts as a reverse proxy and handles HTTPS automatically.

### Quest Search Feature
One of Sidequests’ standout features is the search system. Users can type natural language queries like "easy walk near Auckland with water view" and the system parses it intelligentsly:
1. The query is cleaned and normalised (lowercased, accents removed, punctuation stripped)
2. Monograms (instances of a single word) and bigrams (sequential two-word combinations e.g. "mount eden") are generated (collectively referred to as n-grams.)
3. Stopwords (filler words e.g. "at", "and", "near") are removed to reduce noise.
4. Monograms are lemmatized to improve matching of different word-forms (e.g. caving &rarr; cave).
5. [LINZ location data](https://www.linz.govt.nz/) is used to match monograms to towns/suburbs/cities in NZ and their latitude/longitude/radius.
6. The database is geospatially queried for quests near matching locations, expanding the search radius if there are too few results.
7. Search results are scored based on their proximity to the matching places.
8. Search results are also scored based on the term frequency (TF) of query n-grams in the quest title/description/checklist.
9. Search results are sorted based on their combined geo and TF score, and truncated for performance.

## Growth & Learning Highlights
This project taught me:
- Structuring a full-stack TypeScript application with modular frontend and backend code
- Implementing real-world authentication flows with JWT and Google OAuth (including forgot password email flows)
- Working with geospatial data in MongoDB
- Building an natural language search system with data cleaning, tokenisation, and proximity scoring
- Deploying and maintaining a live production application

## Next Steps
- User profile pages and social features for tracking friends’ progress
- Enhanced content moderation tools to ensure safe, high-quality quests
- Server-side clustering for map markers using spatial partitioning to maintain smooth performance as the number of quests grows
- Validation middleware, typed Mongoose schemas, and separation of business logic for cleaner, more maintainable backend code

## License
This project is not licensed. All rights are reserved by the author.
You are not allowed to use, modify, or redistribute the code without explicit permission.
