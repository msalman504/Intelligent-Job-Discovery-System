
# Intelligent Job Discovery System

An intelligent job discovery agent that uses Google Gemini to score opportunities against your resume and deliver deep market analysis.

This advanced dashboard allows users to discover, monitor, and analyze job opportunities using AI-powered search, personalized resume matching, and dynamic market intelligence.

![App Screenshot](https://storage.googleapis.com/project-screenshots/intelligent-job-discovery/screenshot.png)
*(Note: Replace the URL above with a real screenshot of your application.)*

---

## ✨ Core Features

*   **AI-Powered Job Scoring**: Upload your resume and get an instant "match score" (0-10) for every job listing, telling you how well it aligns with your experience.
*   **In-Depth Job Analysis**: Go beyond the description. The app uses Gemini to analyze job posts for hiring urgency, company growth signals, key skills, benefits, and overall sentiment.
*   **Resume-to-Job Matching**: Get detailed feedback on how your resume stacks up against a specific role, including what matches, areas for improvement, and missing keywords.
*   **AI Resume Tailoring**: Automatically generate a rewritten, tailored version of your resume optimized for a specific job description in one click.
*   **Dynamic Market Intelligence**: Explore interactive charts and AI-generated summaries for different job sectors (e.g., Construction, Real Estate, Tech) to understand hiring trends, salary benchmarks, and geographic demand.
*   **Curated Source Watchlist**: Monitor job openings from niche, expert-level sources and direct company career pages to find opportunities that aren't on mainstream job boards.

---

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI & Machine Learning**: Google Gemini API (`gemini-2.5-flash`)
*   **Job Data**: JSearch API (via RapidAPI)
*   **Charting**: Recharts
*   **Runtime**: Browser-based with ES Modules (via `importmap`)

---

## 🚀 Getting Started

This project is set up to run directly in the browser without a build step.

### Prerequisites

You will need API keys for the following services:

1.  **Google Gemini API**: For all AI-powered features. Get your key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  **JSearch API**: For fetching job listings. Get a key by subscribing to the API on [RapidAPI](https://rapidapi.com/apidojo/api/jsearch).

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/intelligent-job-discovery.git
    cd intelligent-job-discovery
    ```

2.  **Configure API Keys:**

    *   **Google Gemini API Key**:
        *   Open the file `services/geminiService.ts`.
        *   Find the line: `const API_KEY = "YOUR_GEMINI_API_KEY_HERE";`
        *   Replace `"YOUR_GEMINI_API_KEY_HERE"` with your actual Gemini API key.

    *   **JSearch API Key**:
        *   Open the file `services/jsearchService.ts`.
        *   Find the line: `const JSEARCH_API_KEY = "YOUR_JSEARCH_API_KEY_HERE";`
        *   Replace `"YOUR_JSEARCH_API_KEY_HERE"` with your own key from RapidAPI.

3.  **Serve the application:**
    Since there's no build process, you can use any simple static file server.

    *   **Using Python:**
        ```bash
        # If you have Python 3
        python -m http.server
        ```

    *   **Using Node.js (with `http-server`):**
        ```bash
        # Install http-server globally if you haven't already
        npm install -g http-server
        
        # Run the server
        http-server
        ```

4.  **Open in browser:**
    Navigate to `http://localhost:8000` (or the port specified by your server). The application should now be running.

---

## 📁 Project Structure

```
/
├── components/         # Reusable React components (JobCard, SearchBar, etc.)
├── pages/              # Page-level components (JobDiscoveryPage, MarketTrendsPage, etc.)
├── services/           # API service integrations (geminiService, jsearchService)
├── types.ts            # Core TypeScript types and interfaces
├── constants.tsx       # Icons and predefined data
├── App.tsx             # Main application component and routing logic
├── index.html          # Entry point HTML file with importmap
└── index.tsx           # React root renderer
```

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
