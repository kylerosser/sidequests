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
- [ ] Quest submission page (upcoming)
- [ ] User profile page (upcoming)
- [ ] Content moderation queue with user reporting and filtering of inappropriate content (upcoming)
- [ ] Search quests by location and keywords (upcoming)

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

## Growth & Learning Highlights
Sidequests was my first real dive into full-stack development, and my first serious project using React & TypeScript. It taught me how to structure a non-trivial app, handle real-world authentication flows with JWT and Google OAuth, and work with geospatial data in MongoDB. 

I also learned how to deploy and manage a live application, and focused on writing clean, modular APIs using Express. Overall, the project helped me level up across the stack and gain confidence building and shipping real features.

## Next Steps
Soon you'll be able to submit your own quests and view the profiles of other users. I'm also adding content moderation tools to keep things safe and clean. Better search options will enable finding quests by location or keywords.

As the number of quests grows, maintaining smooth map performance will become more important. I plan to implement server-side clustering using spatial partitioning techniques like quadtrees to group nearby quests. This will reduce the number of markers sent to the client and improve load times.

I'm also planning to clean up the codebase by adding validation middleware to backend routes, which will make the code cleaner and adding new routes easier. Re-typing the Mongoose schemas is on the list too, to improve type safety. I'm also working on separating business logic from route handlers to keep things more modular and maintainable.

## License
This project is not licensed. All rights are reserved by the author.
You are not allowed to use, modify, or redistribute the code without explicit permission.
