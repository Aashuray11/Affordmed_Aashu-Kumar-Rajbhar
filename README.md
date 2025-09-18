# Affordmed_Aashu-Kumar-Rajbhar

## URL Shortener Service

Full stack URL shortener with Node.js, Express, MongoDB, React, Vite, Material UI.

### Backend

Environment variables (create `backend/.env` based on example):

```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/url_shortener
HOSTNAME=http://localhost:4000
```

Install and run:

```
cd backend
npm install
npm run dev
```

API Endpoints:

POST /shorturls  
Request JSON: { url: string, validity: integer minutes optional default 30, shortcode: string optional }  
Response: { shortLink, expiry }

GET /shorturls  
List all shortened urls summary.

GET /shorturls/:shortcode  
Stats for a shortcode including click logs.

GET /:shortcode  
Redirect if valid else error JSON.

POST /shorturls/batch  
Send an array of objects. Each object: { url, validity (minutes, optional), shortcode (optional) }.  
Request JSON example:
```
[
	{ "url": "https://example.com", "validity": 45 },
	{ "url": "https://github.com", "shortcode": "gh" }
]
```
Response: Array of result objects: { shortLink, expiry, url } or { error, shortcode? }

Click tracking stores timestamp, referrer, user-agent, accept-language.

### Frontend

Environment variables (create `frontend/.env` based on example):

```
VITE_API_BASE=http://localhost:4000
```

Install and run:

```
cd frontend
npm install
npm run dev
```

Pages:
- Shorten URL: batch create up to 5 at a time, shows results.
- Statistics: table with summary and modal click logs.

### Notes

Logging middleware writes access logs into `backend/logs/access.log`.
No logic duplicated in frontend; all data fetched from backend APIs.

### Development
Ensure MongoDB is running locally or update `MONGODB_URI`.
