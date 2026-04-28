from sqlalchemy import func

from .extensions import bcrypt, db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), nullable=False, unique=True, index=True)
    email = db.Column(db.String(254), nullable=False, unique=True, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())

    listenings = db.relationship("Listening", back_populates="user", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="user", cascade="all, delete-orphan")
    favorites = db.relationship("Favorite", back_populates="user", cascade="all, delete-orphan")

    def set_password(self, password: str) -> None:
        pw_hash = bcrypt.generate_password_hash(password.encode("utf-8"))
        self.password_hash = pw_hash.decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password.encode("utf-8"))

    def to_public_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
        }


class Album(db.Model):
    __tablename__ = "albums"

    id = db.Column(db.Integer, primary_key=True)

    artist = db.Column(db.String(200), nullable=False)
    title = db.Column(db.String(200), nullable=False)

    # Normalized fields for simple case-insensitive uniqueness
    artist_lower = db.Column(db.String(200), nullable=False, index=True)
    title_lower = db.Column(db.String(200), nullable=False, index=True)

    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now())

    listenings = db.relationship("Listening", back_populates="album", cascade="all, delete-orphan")
    reviews = db.relationship("Review", back_populates="album", cascade="all, delete-orphan")
    favorites = db.relationship("Favorite", back_populates="album", cascade="all, delete-orphan")

    __table_args__ = (
        db.UniqueConstraint("artist_lower", "title_lower", name="uq_album_artist_title"),
    )

    def to_dict(self):
        return {"id": self.id, "artist": self.artist, "title": self.title}


class Listening(db.Model):
    __tablename__ = "listenings"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    album_id = db.Column(db.Integer, db.ForeignKey("albums.id", ondelete="CASCADE"), nullable=False, index=True)

    listened_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)

    user = db.relationship("User", back_populates="listenings")
    album = db.relationship("Album", back_populates="listenings")

    __table_args__ = (
        db.UniqueConstraint("user_id", "album_id", name="uq_listening_user_album"),
    )


class Review(db.Model):
    __tablename__ = "reviews"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    album_id = db.Column(db.Integer, db.ForeignKey("albums.id", ondelete="CASCADE"), nullable=False, index=True)

    body = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)
    updated_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    user = db.relationship("User", back_populates="reviews")
    album = db.relationship("Album", back_populates="reviews")

    __table_args__ = (
        db.UniqueConstraint("user_id", "album_id", name="uq_review_user_album"),
    )

    def to_dict(self, include_user=False):
        d = {
            "id": self.id,
            "albumId": self.album_id,
            "userId": self.user_id,
            "body": self.body,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_user:
            d["user"] = {"id": self.user.id, "username": self.user.username}
        return d


class Favorite(db.Model):
    __tablename__ = "favorites"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    album_id = db.Column(db.Integer, db.ForeignKey("albums.id", ondelete="CASCADE"), nullable=False, index=True)

    favorited_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)

    user = db.relationship("User", back_populates="favorites")
    album = db.relationship("Album", back_populates="favorites")

    __table_args__ = (
        db.UniqueConstraint("user_id", "album_id", name="uq_favorite_user_album"),
    )


class Follow(db.Model):
    __tablename__ = "follows"

    id = db.Column(db.Integer, primary_key=True)
    follower_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    following_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True)

    __table_args__ = (
        db.UniqueConstraint("follower_id", "following_id", name="uq_follow_pair"),
    )

