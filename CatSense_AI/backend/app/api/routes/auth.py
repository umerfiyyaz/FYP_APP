from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.security import create_access_token
from app.db.models import User
from app.db.session import get_db
from app.schemas.profile import EmailCheckIn, UserUpdate
from app.schemas.user import LoginIn, SignUpIn, TokenOut, UserOut
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


def _token_for(user: User) -> TokenOut:
    return TokenOut(access_token=create_access_token(user.id), user=UserOut.model_validate(user))


@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def signup(data: SignUpIn, db: Session = Depends(get_db)) -> TokenOut:
    try:
        user = auth_service.create_user(db, data)
    except auth_service.EmailTaken:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    return _token_for(user)


@router.post("/check-email")
def check_email(data: EmailCheckIn, db: Session = Depends(get_db)) -> dict[str, bool]:
    """Is this email free? (the sign-up screen asks before the user presses the button twice)"""
    return {"available": not auth_service.email_taken(db, data.email)}


@router.post("/login", response_model=TokenOut)
def login(data: LoginIn, db: Session = Depends(get_db)) -> TokenOut:
    user = auth_service.authenticate(db, data)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Incorrect email or password")
    return _token_for(user)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)) -> User:
    return user


@router.patch("/me", response_model=UserOut)
def update_me(data: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)) -> User:
    return auth_service.update_name(db, user, data.full_name)