from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import get_password_hash, verify_password


class UserService:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User | None:
        """Email ile kullanıcı bul"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User | None:
        """ID ile kullanıcı bul"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, email: str, password: str) -> User:
        """Yeni kullanıcı oluştur"""
        # Şifreyi hash'le
        hashed_password = get_password_hash(password)
        
        # Kullanıcı oluştur
        db_user = User(email=email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        return db_user

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User | None:
        """Kullanıcı doğrula (login)"""
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user