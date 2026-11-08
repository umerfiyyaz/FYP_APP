from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import alerts, analysis, auth, cats, health, history, results, videos

app = FastAPI(title="CatSense AI API", version="0.1.0")

# Development: allow the Expo app / web to call the API. Tighten before deploying.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(cats.router)
app.include_router(history.router)
app.include_router(analysis.router)
app.include_router(alerts.router)
app.include_router(videos.router)
app.include_router(results.router)