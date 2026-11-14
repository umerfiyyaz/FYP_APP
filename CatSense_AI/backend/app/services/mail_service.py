import logging
import smtplib
from email.message import EmailMessage

from app.config import settings

log = logging.getLogger("uvicorn.error")

SUBJECTS = {
    "verify": "Your CatSense AI verification code",
    "reset": "Your CatSense AI password reset code",
}
INTRO = {
    "verify": "Use this code to verify your email address:",
    "reset": "Use this code to reset your password:",
}


def send_code(to: str, purpose: str, code: str) -> None:
    """Email the code. With no SMTP settings (development) the code is printed in the backend terminal."""
    if not (settings.smtp_host and settings.smtp_user and settings.smtp_password):
        log.warning("EMAIL NOT CONFIGURED - %s code for %s is: %s", purpose, to, code)
        return

    msg = EmailMessage()
    msg["Subject"] = SUBJECTS.get(purpose, "Your CatSense AI code")
    msg["From"] = settings.mail_from or settings.smtp_user
    msg["To"] = to
    msg.set_content(
        f"{INTRO.get(purpose, 'Your code:')}\n\n    {code}\n\n"
        "It works for 10 minutes. If you did not ask for it, you can ignore this email.\n\n- CatSense AI"
    )
    try:
        if settings.smtp_port == 465:
            with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=20) as s:
                s.login(settings.smtp_user, settings.smtp_password)
                s.send_message(msg)
        else:
            with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as s:
                s.starttls()
                s.login(settings.smtp_user, settings.smtp_password)
                s.send_message(msg)
    except Exception:  # the app must not fail because the mail server is down
        log.exception("Could not send the %s email to %s", purpose, to)