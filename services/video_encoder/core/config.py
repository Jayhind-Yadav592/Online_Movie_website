from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Video Encoder Service"
    UPLOAD_DIR: str = "./tmp/uploads"
    OUTPUT_DIR: str = "./tmp/encoded"
    FFMPEG_PATH: str = "ffmpeg"
    
    # Supported Resolutions
    RESOLUTIONS: dict = {
        "480p": {"width": 854, "height": 480, "bitrate": "1500k"},
        "720p": {"width": 1280, "height": 720, "bitrate": "3000k"},
        "1080p": {"width": 1920, "height": 1080, "bitrate": "6000k"},
    }

    class Config:
        env_file = ".env"

settings = Settings()
