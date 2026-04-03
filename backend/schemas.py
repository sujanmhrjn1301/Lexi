from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# --- Auth Schemas ---
class UserSignUp(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: int

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    full_name: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Message Schemas ---
class MessageCreate(BaseModel):
    content: str = Field(..., min_length=1)

class MessageResponse(BaseModel):
    id: int
    chat_id: int
    user_id: int
    content: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Chat Schemas ---
class ChatCreate(BaseModel):
    title: Optional[str] = "New Chat"
    description: Optional[str] = None

class ChatUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_archived: Optional[bool] = None

class ChatResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str]
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ChatDetailResponse(ChatResponse):
    messages: List[MessageResponse] = []

# --- Settings Schemas ---
class UserSettingsUpdate(BaseModel):
    theme: Optional[str] = None
    language: Optional[str] = None
    notifications_enabled: Optional[bool] = None

class UserSettingsResponse(BaseModel):
    id: int
    user_id: int
    theme: str
    language: str
    notifications_enabled: bool
    
    class Config:
        from_attributes = True
