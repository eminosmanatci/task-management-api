from pydantic import BaseModel, EmailStr, ConfigDict


# ==================== BASE ====================
class UserBase(BaseModel):
    email: EmailStr


# ==================== REQUEST ====================
class UserCreate(UserBase):
    password: str  # Register için


class UserLogin(UserBase):
    password: str  # Login için


# ==================== RESPONSE ====================
class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    is_active: bool


# ==================== TOKEN ====================
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: int | None = None  # user_id