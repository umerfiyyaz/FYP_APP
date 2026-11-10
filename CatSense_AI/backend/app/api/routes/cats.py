import uuid

from fastapi import APIRouter, Depends, File, HTTPException, Response, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import Cat, User
from app.db.session import get_db
from app.schemas.cat import CatCreate, CatOut, CatUpdate
from app.services import cat_service, storage_service

router = APIRouter(prefix="/cats", tags=["cats"])


def _own_cat(db: Session, user: User, cat_id: uuid.UUID) -> Cat:
    cat = cat_service.get_cat(db, user, cat_id)
    if cat is None:  # also hides other users' cats
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Cat not found")
    return cat


@router.get("", response_model=list[CatOut])
def list_cats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return cat_service.list_cats(db, user)


@router.post("", response_model=CatOut, status_code=status.HTTP_201_CREATED)
def create_cat(data: CatCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return cat_service.present(db, cat_service.create_cat(db, user, data))


@router.get("/{cat_id}", response_model=CatOut)
def get_cat(cat_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return cat_service.present(db, _own_cat(db, user, cat_id))


@router.patch("/{cat_id}", response_model=CatOut)
def update_cat(cat_id: uuid.UUID, data: CatUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cat = cat_service.update_cat(db, _own_cat(db, user, cat_id), data)
    return cat_service.present(db, cat)


@router.delete("/{cat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_cat(cat_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cat_service.delete_cat(db, _own_cat(db, user, cat_id))
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# ---- cat photo ----------------------------------------------------------------------------
# photo_url in CatOut is a path like  /cats/<id>/photo?v=<token>  (the app adds the server address).


@router.post("/{cat_id}/photo", response_model=CatOut)
def upload_photo(
    cat_id: uuid.UUID,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    cat = cat_service.set_photo(db, _own_cat(db, user, cat_id), file)
    return cat_service.present(db, cat)


@router.get("/{cat_id}/photo")
def get_photo(cat_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cat = _own_cat(db, user, cat_id)
    if not cat.photo_url:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "This cat has no photo")
    path = storage_service.absolute_path(cat.photo_url)
    if not path.is_file():
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Photo file is missing")
    return FileResponse(
        path,
        media_type=storage_service.PHOTO_TYPES.get(path.suffix.lower(), "application/octet-stream"),
        headers={"Cache-Control": "private, max-age=31536000, immutable"},  # the ?v= token changes with a new photo
    )


@router.delete("/{cat_id}/photo", response_model=CatOut)
def remove_photo(cat_id: uuid.UUID, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    cat = cat_service.clear_photo(db, _own_cat(db, user, cat_id))
    return cat_service.present(db, cat)