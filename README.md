# Movie App Project

A movie app built with React and Axios to fetch and display movies and tv series using the TMDB API.

## Features
- Display popular movies.
- Display tv series.
- Search functionality for both movie and tv series.
- Cache API responses in the local storage to reduce redundant calls.
- Responsive design for an optimal user experience.

## Requirements
- Node.js (version 16 or higher)
- A TMDB API key.

## Setup Instructions
1. Clone the repository:
   git clone https://github.com/Yaser-2004/MoviesDatabase.git

2. Navigate to the project directory:
   cd MoviesDatabase

3. Install dependencies:
   npm install

4. Configure the environment variables:
   - Create a .env file in the root directory.
   - Add the following line to the file:
     VITE_APP_API_KEY=your_tmdb_api_key
     Replace your_tmdb_api_key with your TMDB API key.

5. Start the development server:
   npm run dev

6. Access the app: Open your browser and go to:
   http://localhost:5173
