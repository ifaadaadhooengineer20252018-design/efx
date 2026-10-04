import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import jwt, JWTError


# =========================
# LOAD ENVIRONMENT VARIABLES
# =========================

load_dotenv()


# =========================
# PASSWORD HASHING
# =========================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================
# JWT SETTINGS
# =========================

SECRET_KEY = os.getenv("EFX_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError(
        "EFX_SECRET_KEY is not set in the .env file"
    )

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 30


# =========================
# HASH PASSWORD
# =========================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


# =========================
# VERIFY PASSWORD
# =========================

def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# =========================
# CREATE JWT ACCESS TOKEN
# =========================

def create_access_token(data: dict) -> str:
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({
        "exp": expire
    })

    token = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token


# =========================
# VERIFY JWT ACCESS TOKEN
# =========================

def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:
        return None


# =========================
# CHECK USER ROLE
# =========================

def require_role(
    user_role: str,
    allowed_roles: list[str]
) -> bool:
    return user_role in allowed_roles
