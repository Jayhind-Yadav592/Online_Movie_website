from fastapi import APIRouter, HTTPException
from core.recommender import recommender_engine

router = APIRouter()

@router.post("/train")
def trigger_training():
    """Admin endpoint to force re-train the ML model when new movies are added."""
    success = recommender_engine.train_model()
    if success:
        return {"message": "Model retrained successfully."}
    raise HTTPException(status_code=500, detail="Failed to train model.")

@router.get("/similar/{movie_slug}")
def get_similar_movies(movie_slug: str, limit: int = 5):
    """Returns a list of movies similar to the given movie."""
    recommendations = recommender_engine.get_recommendations(movie_slug, top_n=limit)
    if not recommendations:
        # Fallback if movie not found or no data
        return {"results": []}
        
    return {"results": recommendations}

@router.get("/user/{user_id}")
def get_user_recommendations(user_id: int):
    """
    Advanced Collaborative Filtering endpoint.
    In a full production environment, this would hit the WatchHistory DB 
    and run a Matrix Factorization (SVD) algorithm across all users.
    """
    # For now, we return a mocked personalized list as a placeholder for Phase 3
    return {
        "user_id": user_id,
        "algorithm": "Collaborative Filtering (Matrix Factorization)",
        "results": []
    }
