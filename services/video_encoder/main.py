from fastapi import FastAPI, BackgroundTasks, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from api.routes import encoding
from core.config import settings
import uvicorn
import os

app = FastAPI(
    title="Video Encoding Microservice",
    description="Enterprise HLS/DASH Video Transcoder using FFmpeg",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(encoding.router, prefix="/api/v1/encode", tags=["Encoding"])

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "video-encoder-service"}

if __name__ == "__main__":
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.OUTPUT_DIR, exist_ok=True)
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
