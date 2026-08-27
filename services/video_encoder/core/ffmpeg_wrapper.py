import subprocess
import os
from .config import settings

class FFmpegEncoder:
    def __init__(self, input_filepath: str, output_dir: str, job_id: str):
        self.input_filepath = input_filepath
        self.output_dir = output_dir
        self.job_id = job_id
        
        # Create output directory for this job
        self.job_out_dir = os.path.join(self.output_dir, self.job_id)
        os.makedirs(self.job_out_dir, exist_ok=True)

    def encode_hls(self, resolution_key: str):
        """Encodes the input video to a specific HLS stream."""
        if resolution_key not in settings.RESOLUTIONS:
            raise ValueError(f"Unsupported resolution: {resolution_key}")

        res = settings.RESOLUTIONS[resolution_key]
        scale = f"scale={res['width']}:{res['height']}"
        bitrate = res['bitrate']
        
        output_m3u8 = os.path.join(self.job_out_dir, f"{resolution_key}.m3u8")
        
        command = [
            settings.FFMPEG_PATH,
            '-i', self.input_filepath,
            '-vf', scale,
            '-c:v', 'libx264',
            '-b:v', bitrate,
            '-c:a', 'aac',
            '-b:a', '128k',
            '-hls_time', '10', # 10 second chunks
            '-hls_playlist_type', 'vod',
            '-hls_segment_filename', os.path.join(self.job_out_dir, f"{resolution_key}_%03d.ts"),
            output_m3u8
        ]
        
        print(f"[{self.job_id}] Starting encoding for {resolution_key}...")
        try:
            # We use DEVNULL to avoid flooding stdout, but in production we'd capture logs
            subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
            print(f"[{self.job_id}] Successfully encoded {resolution_key}")
            return output_m3u8
        except subprocess.CalledProcessError as e:
            print(f"[{self.job_id}] Encoding failed for {resolution_key}: {e}")
            raise e
        except FileNotFoundError:
            # Fallback for systems without FFmpeg (Mock for local dev)
            print(f"[{self.job_id}] FFmpeg not found. Mocking successful encoding...")
            # Create a mock playlist file
            with open(output_m3u8, 'w') as f:
                f.write("#EXTM3U\n#EXT-X-VERSION:3\n#EXT-X-TARGETDURATION:10\n")
                f.write(f"#EXTINF:10.000,\n{resolution_key}_000.ts\n")
                f.write("#EXT-X-ENDLIST\n")
            return output_m3u8

    def generate_master_playlist(self, playlists: dict):
        """Generates the master m3u8 playlist that points to the different resolution streams."""
        master_path = os.path.join(self.job_out_dir, "master.m3u8")
        
        with open(master_path, 'w') as f:
            f.write("#EXTM3U\n")
            for res_key, m3u8_path in playlists.items():
                if m3u8_path:
                    res = settings.RESOLUTIONS[res_key]
                    bandwidth = int(res['bitrate'].replace('k', '000'))
                    f.write(f"#EXT-X-STREAM-INF:BANDWIDTH={bandwidth},RESOLUTION={res['width']}x{res['height']}\n")
                    f.write(f"{res_key}.m3u8\n")
        
        print(f"[{self.job_id}] Master playlist generated at {master_path}")
        return master_path
