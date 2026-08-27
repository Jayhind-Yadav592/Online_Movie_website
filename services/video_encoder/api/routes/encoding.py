from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from core.ffmpeg_wrapper import FFmpegEncoder
from core.config import settings
import uuid
import os
import aiofiles

router = APIRouter()

def process_video_task(job_id: str, file_path: str):
    """Background task to encode video into multiple resolutions."""
    print(f"Starting background job: {job_id}")
    try:
        encoder = FFmpegEncoder(input_filepath=file_path, output_dir=settings.OUTPUT_DIR, job_id=job_id)
        
        playlists = {}
        for res in settings.RESOLUTIONS.keys():
            m3u8_path = encoder.encode_hls(res)
            playlists[res] = m3u8_path
            
        encoder.generate_master_playlist(playlists)
        print(f"Job {job_id} completed successfully!")
        
    except Exception as e:
        print(f"Job {job_id} failed: {str(e)}")
    finally:
        # In production, we might upload to S3 here and delete the local file
        # os.remove(file_path)
        pass

@router.post("/")
async def upload_video(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    """Uploads a raw mp4 file and starts the encoding pipeline."""
    if not file.filename.endswith('.mp4'):
        raise HTTPException(status_code=400, detail="Only .mp4 files are supported")

    job_id = str(uuid.uuid4())
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, f"{job_id}.mp4")
    
    # Save file asynchronously
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    # Queue the background processing
    background_tasks.add_task(process_video_task, job_id, file_path)
    
    return {
        "message": "Video uploaded successfully. Encoding started in background.",
        "job_id": job_id,
        "status_endpoint": f"/api/v1/encode/status/{job_id}"
    }

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    """Checks the status of an encoding job."""
    job_dir = os.path.join(settings.OUTPUT_DIR, job_id)
    master_path = os.path.join(job_dir, "master.m3u8")
    
    if os.path.exists(master_path):
        return {"job_id": job_id, "status": "COMPLETED", "master_playlist": master_path}
    elif os.path.exists(os.path.join(settings.UPLOAD_DIR, f"{job_id}.mp4")):
        return {"job_id": job_id, "status": "PROCESSING"}
    else:
        raise HTTPException(status_code=404, detail="Job not found")
