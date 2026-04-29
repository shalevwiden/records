from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import desc, or_

from ..extensions import db
from ..models import Album, Favorite, Follow, Listening, Review, User
from . import api_bp


def _current_user() -> User:
    user_id = get_jwt_identity()
    return db.session.get(User, int(user_id))


@api_bp.get("/auth/me")
@jwt_required()
def auth_me():
    u = _current_user()
    return jsonify(u.to_public_dict())


@api_bp.post("/auth/signup")
def signup():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not username or not email or len(password) < 6:
        return jsonify({"error": "username, email, and password (min 6 chars) are required"}), 400

    if User.query.filter(or_(User.username == username, User.email == email)).first():
        return jsonify({"error": "username or email already exists"}), 409

    u = User(username=username, email=email)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()
    return jsonify(u.to_public_dict()), 201


@api_bp.post("/auth/login")
def login():
    # #region agent log
    import json
    import time

    _AGENT_LOG = "/Users/shalevwiden/Downloads/Projects/cursor/records/.cursor/debug-e9bd46.log"

    def _agent_log(message: str, data: dict, hypothesis_id: str) -> None:
        try:
            with open(_AGENT_LOG, "a", encoding="utf-8") as _f:
                _f.write(
                    json.dumps(
                        {
                            "sessionId": "e9bd46",
                            "location": "backend/routes/api.py:login",
                            "message": message,
                            "data": data,
                            "timestamp": int(time.time() * 1000),
                            "hypothesisId": hypothesis_id,
                        },
                        default=str,
                    )
                    + "\n"
                )
        except Exception:
            pass

    # #endregion

    try:
        data = request.get_json(silent=True) or {}
        identifier = (data.get("emailOrUsername") or "").strip()
        password = data.get("password") or ""

        # #region agent log
        _agent_log(
            "login entry",
            {"id_len": len(identifier), "has_at": "@" in identifier, "pw_len": len(password)},
            "H1",
        )
        # #endregion

        if not identifier or not password:
            return jsonify({"error": "emailOrUsername and password are required"}), 400

        if "@" in identifier:
            u = User.query.filter(User.email == identifier.lower()).first()
        else:
            u = User.query.filter(User.username == identifier).first()

        # #region agent log
        _agent_log("after user lookup", {"user_found": u is not None, "user_id": getattr(u, "id", None)}, "H1")
        # #endregion

        pw_ok = False
        if u:
            # #region agent log
            try:
                pw_ok = u.check_password(password)
                _agent_log("check_password done", {"ok": pw_ok}, "H2")
            except Exception as _pw_exc:
                _agent_log(
                    "check_password raised",
                    {"exc_type": type(_pw_exc).__name__, "exc_msg": str(_pw_exc)},
                    "H2",
                )
                raise
            # #endregion
        if not u or not pw_ok:
            return jsonify({"error": "invalid credentials"}), 401

        # #region agent log
        _agent_log("before create_access_token", {"user_id": u.id}, "H3")
        # #endregion
        token = create_access_token(identity=str(u.id))

        # #region agent log
        _agent_log("after create_access_token", {"token_len": len(token) if token else 0}, "H3")
        # #endregion

        pub = u.to_public_dict()

        # #region agent log
        _agent_log("to_public_dict ok", {"keys": list(pub.keys())}, "H4")
        # #endregion

        return jsonify({"accessToken": token, "user": pub})
    except Exception as e:
        # #region agent log
        _agent_log(
            "login unhandled exception",
            {"exc_type": type(e).__name__, "exc_msg": str(e)},
            "H5",
        )
        # #endregion
        raise


@api_bp.get("/me")
@jwt_required()
def me():
    u = _current_user()
    favorites_count = Favorite.query.filter_by(user_id=u.id).count()
    return jsonify({**u.to_public_dict(), "favoritesCount": favorites_count})


@api_bp.post("/me/listen")
@jwt_required()
def listen():
    u = _current_user()
    data = request.get_json(silent=True) or {}
    artist = (data.get("artist") or "").strip()
    title = (data.get("title") or "").strip()

    if not artist or not title:
        return jsonify({"error": "artist and title are required"}), 400

    artist_lower = artist.lower()
    title_lower = title.lower()

    album = Album.query.filter_by(artist_lower=artist_lower, title_lower=title_lower).first()
    if not album:
        album = Album(artist=artist, title=title, artist_lower=artist_lower, title_lower=title_lower)
        db.session.add(album)
        db.session.flush()  # get album.id

    listening = Listening.query.filter_by(user_id=u.id, album_id=album.id).first()
    if listening:
        listening.listened_at = db.func.now()
    else:
        listening = Listening(user_id=u.id, album_id=album.id)
        db.session.add(listening)

    db.session.commit()
    return jsonify({"album": album.to_dict()}), 201


@api_bp.get("/me/library")
@jwt_required()
def library():
    u = _current_user()
    rows = (
        db.session.query(Listening, Album, Review)
        .join(Album, Listening.album_id == Album.id)
        .outerjoin(Review, (Review.album_id == Album.id) & (Review.user_id == u.id))
        .filter(Listening.user_id == u.id)
        .order_by(desc(Listening.listened_at))
        .all()
    )

    items = []
    for listening, album, review in rows:
        items.append(
            {
                "listenedAt": listening.listened_at.isoformat() if listening.listened_at else None,
                "album": album.to_dict(),
                "review": review.to_dict(include_user=False) if review else None,
                "isFavorite": Favorite.query.filter_by(user_id=u.id, album_id=album.id).first() is not None,
            }
        )

    return jsonify({"items": items})


@api_bp.post("/me/reviews")
@jwt_required()
def upsert_review():
    u = _current_user()
    data = request.get_json(silent=True) or {}
    album_id = data.get("albumId")
    body = (data.get("body") or "").strip()

    if not album_id or not body:
        return jsonify({"error": "albumId and body are required"}), 400

    album = db.session.get(Album, int(album_id))
    if not album:
        return jsonify({"error": "album not found"}), 404

    review = Review.query.filter_by(user_id=u.id, album_id=album.id).first()
    if review:
        review.body = body
    else:
        review = Review(user_id=u.id, album_id=album.id, body=body)
        db.session.add(review)

    db.session.commit()
    return jsonify({"review": review.to_dict(include_user=False)}), 201


@api_bp.get("/albums/<int:album_id>")
def album_detail(album_id: int):
    album = db.session.get(Album, album_id)
    if not album:
        return jsonify({"error": "album not found"}), 404
    # Reviews count is handy in UI
    reviews_count = Review.query.filter_by(album_id=album.id).count()
    return jsonify({**album.to_dict(), "reviewsCount": reviews_count})


@api_bp.get("/albums/<int:album_id>/reviews")
def album_reviews(album_id: int):
    album = db.session.get(Album, album_id)
    if not album:
        return jsonify({"error": "album not found"}), 404

    rows = (
        Review.query.filter_by(album_id=album.id)
        .join(User, Review.user_id == User.id)
        .order_by(desc(Review.created_at))
        .limit(50)
        .all()
    )
    items = [r.to_dict(include_user=True) for r in rows]
    return jsonify({"items": items})


@api_bp.post("/me/favorites")
@jwt_required()
def favorite_toggle():
    u = _current_user()
    data = request.get_json(silent=True) or {}
    album_id = data.get("albumId")
    favorite = data.get("favorite")  # optional

    if not album_id:
        return jsonify({"error": "albumId is required"}), 400

    album = db.session.get(Album, int(album_id))
    if not album:
        return jsonify({"error": "album not found"}), 404

    existing = Favorite.query.filter_by(user_id=u.id, album_id=album.id).first()

    # If favorite is omitted -> toggle.
    if favorite is None:
        if existing:
            db.session.delete(existing)
            db.session.commit()
            return jsonify({"favorited": False})
        existing = Favorite(user_id=u.id, album_id=album.id)
        db.session.add(existing)
        db.session.commit()
        return jsonify({"favorited": True})

    want = bool(favorite)
    if want and not existing:
        db.session.add(Favorite(user_id=u.id, album_id=album.id))
        db.session.commit()
        return jsonify({"favorited": True})
    if not want and existing:
        db.session.delete(existing)
        db.session.commit()
    return jsonify({"favorited": want})


@api_bp.get("/me/favorites")
@jwt_required()
def my_favorites():
    u = _current_user()
    rows = (
        Album.query.join(Favorite, Favorite.album_id == Album.id)
        .filter(Favorite.user_id == u.id)
        .order_by(desc(Favorite.favorited_at))
        .all()
    )
    return jsonify({"items": [a.to_dict() for a in rows]})


@api_bp.get("/users/<string:username>/profile")
def profile(username: str):
    user = User.query.filter(User.username == username).first()
    if not user:
        return jsonify({"error": "user not found"}), 404

    favorites = (
        Album.query.join(Favorite, Favorite.album_id == Album.id)
        .filter(Favorite.user_id == user.id)
        .order_by(desc(Favorite.favorited_at))
        .limit(5)
        .all()
    )

    followers_count = Follow.query.filter_by(following_id=user.id).count()
    following_count = Follow.query.filter_by(follower_id=user.id).count()

    # Profile is public; we do not include follow state unless authenticated.
    follow_state = None
    me_id = None
    try:
        # Only works if a token exists; otherwise it will throw.
        from flask_jwt_extended import verify_jwt_in_request

        verify_jwt_in_request(optional=True)
        if False:  # pragma: no cover
            pass
    except Exception:
        pass

    if "Authorization" in request.headers:
        try:
            me_id = get_jwt_identity()
        except Exception:
            me_id = None

    if me_id:
        follow_state = Follow.query.filter_by(follower_id=int(me_id), following_id=user.id).first() is not None

    return jsonify(
        {
            "user": user.to_public_dict(),
            "favorites": [a.to_dict() for a in favorites],
            "followersCount": followers_count,
            "followingCount": following_count,
            "isFollowing": follow_state,
        }
    )


@api_bp.get("/me/following")
@jwt_required()
def following():
    u = _current_user()
    rows = (
        User.query.join(Follow, Follow.following_id == User.id)
        .filter(Follow.follower_id == u.id)
        .order_by(User.username)
        .all()
    )
    return jsonify({"items": [{"id": x.id, "username": x.username} for x in rows]})


@api_bp.post("/me/follows/<string:username>")
@jwt_required()
def follow(username: str):
    u = _current_user()
    target = User.query.filter(User.username == username).first()
    if not target:
        return jsonify({"error": "user not found"}), 404
    if target.id == u.id:
        return jsonify({"error": "cannot follow yourself"}), 400

    if Follow.query.filter_by(follower_id=u.id, following_id=target.id).first():
        return jsonify({"following": True}), 200

    db.session.add(Follow(follower_id=u.id, following_id=target.id))
    db.session.commit()
    return jsonify({"following": True}), 201


@api_bp.delete("/me/follows/<string:username>")
@jwt_required()
def unfollow(username: str):
    u = _current_user()
    target = User.query.filter(User.username == username).first()
    if not target:
        return jsonify({"error": "user not found"}), 404

    existing = Follow.query.filter_by(follower_id=u.id, following_id=target.id).first()
    if existing:
        db.session.delete(existing)
        db.session.commit()
    return jsonify({"following": False}), 200


@api_bp.get("/me/feed")
@jwt_required()
def feed():
    u = _current_user()

    following_ids = [r[0] for r in db.session.query(Follow.following_id).filter(Follow.follower_id == u.id).all()]
    user_ids = following_ids + [u.id]

    rows = (
        Review.query.filter(Review.user_id.in_(user_ids))
        .join(User, Review.user_id == User.id)
        .join(Album, Review.album_id == Album.id)
        .order_by(desc(Review.created_at))
        .limit(50)
        .all()
    )

    items = []
    for r in rows:
        items.append(
            {
                "review": r.to_dict(include_user=True),
                "album": r.album.to_dict() if r.album else None,
                "author": {"id": r.user.id, "username": r.user.username} if r.user else None,
            }
        )
    return jsonify({"items": items})

