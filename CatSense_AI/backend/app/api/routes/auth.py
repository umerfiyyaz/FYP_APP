from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user_any
from app.core.security import create_access_token
from app.db.models import User
from app.db.session import get_db
from app.schemas.email_code import CodeIn, ForgotIn, ResetIn
from app.schemas.profile import EmailCheckIn, UserUpdate
from app.schemas.user import LoginIn, SignUpIn, TokenOut, UserOut
from app.services import auth_service, email_code_service, mail_service

router = APIRouter(prefix="/auth", tags=["auth"])


def _queue_code(db: Session, user: User, purpose: str, background: BackgroundTasks) -> None:
    """Make a code and email it after the answer is sent (sending can take a few seconds)."""
    code = email_code_service.issue_code(db, user, purpose)
    background.add_task(mail_service.send_code, user.email, purpose, code)


def _token_for(user: User) -> TokenOut:
    return TokenOut(access_token=create_access_token(user.id), user=UserOut.model_validate(user))


@router.post("/signup", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
def signup(data: SignUpIn, background: BackgroundTasks, db: Session = Depends(get_db)) -> TokenOut:
    try:
        user = auth_service.create_user(db, data)
    except auth_service.EmailTaken:
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with this email already exists")
    _queue_code(db, user, "verify", background)  # the app opens the "enter your code" screen next
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
def me(user: User = Depends(get_current_user_any)) -> User:
    return user


@router.patch("/me", response_model=UserOut)
def update_me(data: UserUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user_any)) -> User:
    return auth_service.update_name(db, user, data.full_name)


# ---- email verification (sign up) ----------------------------------------------------------


@router.post("/verify-email", response_model=UserOut)
def verify_email(data: CodeIn, db: Session = Depends(get_db), user: User = Depends(get_current_user_any)) -> User:
    if user.email_verified:
        return user
    if not email_code_service.check_code(db, user, "verify", data.code):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "The code is incorrect or has expired")
    return auth_service.mark_verified(db, user)


@router.post("/resend-code")
def resend_code(
    background: BackgroundTasks, db: Session = Depends(get_db), user: User = Depends(get_current_user_any)
) -> dict[str, bool]:
    if user.email_verified:
        raise HTTPException(status.HTTP_409_CONFLICT, "Your email is already verified")
    try:
        _queue_code(db, user, "verify", background)
    except email_code_service.TooSoon as e:
        raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, f"Please wait {e.seconds} seconds before asking for a new code")
    return {"ok": True}


# ---- forgot password -----------------------------------------------------------------------


@router.post("/forgot-password")
def forgot_password(data: ForgotIn, background: BackgroundTasks, db: Session = Depends(get_db)) -> dict[str, bool]:
    """Always answers ok, so the answer does not tell whether the email has an account."""
    user = auth_service.find_by_email(db, data.email)
    if user is not None:
        try:
            _queue_code(db, user, "reset", background)
        except email_code_service.TooSoon:
            pass  # the code sent a moment ago still works
    return {"ok": True}


@router.post("/reset-password")
def reset_password(data: ResetIn, db: Session = Depends(get_db)) -> dict[str, bool]:
    user = auth_service.find_by_email(db, data.email)
    if user is None or not email_code_service.check_code(db, user, "reset", data.code):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "The code is incorrect or has expired")
    auth_service.set_password(db, user, data.new_password)
    return {"ok": True}