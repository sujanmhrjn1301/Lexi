from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..models import User, UserSettings
from ..schemas import UserSettingsUpdate, UserSettingsResponse
from ..auth import get_current_active_user
from ..database import get_db

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/{user_id}/settings", response_model=UserSettingsResponse)
async def get_user_settings(
    user_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user settings"""
    
    if current_user.id != int(user_id):  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this user's settings"
        )
    
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == user_id
    ).first()
    
    if not settings:
        # Create default settings
        settings = UserSettings(user_id=user_id)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@router.put("/{user_id}/settings", response_model=UserSettingsResponse)
async def update_user_settings(
    user_id: int,
    settings_data: UserSettingsUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user settings"""
    
    if current_user.id != int(user_id):  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to modify this user's settings"
        )
    
    settings = db.query(UserSettings).filter(
        UserSettings.user_id == user_id
    ).first()
    
    if not settings:
        settings = UserSettings(user_id=user_id)
        db.add(settings)
    
    if settings_data.theme:
        settings.theme = settings_data.theme  # type: ignore
    if settings_data.language:
        settings.language = settings_data.language  # type: ignore
    if settings_data.notifications_enabled is not None:
        settings.notifications_enabled = settings_data.notifications_enabled  # type: ignore
    
    db.commit()
    db.refresh(settings)
    
    return settings
