/**
 * @description this function allows to switch between the different laugh buttons
 * 
 * @param {Array} post the publication to laugh
 */
export const switchLaughButton = (post, addEmoji, removeEmoji) => {
    let laughButton;
    const type = "laugh";
    const userId = parseInt(localStorage.session_id);

    if (post.countLaughs === 0) {
        laughButton = (
            <span className="laugh-before">
                <input type="hidden" value={post.post_id} />
                <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
            </span>
        )
    } else {
        
        post.Likes.map(like => {
            if (like.like_user_id === userId && like.like_type === "laugh") {
                if (like.like_value === 0) {
                    laughButton = (
                        <span className="laugh-before">
                            <input type="hidden" value={post.post_id} />
                            <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
                        </span>
                    )
                } else if (like.like_value === 1) {
                    laughButton = (
                        <span className="laugh-after">
                            <input type="hidden" value={post.post_id} />
                            <i className="fas fa-grin-tears" onClick={(e) => removeEmoji(e, type)} title="C'est plus marrant"></i>
                        </span>
                    )
                }
            } 
            else {
                laughButton = (
                    <span className="laugh-before">
                        <input type="hidden" value={post.post_id} />
                        <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
                    </span>
                )
            }
            return laughButton;
        });
    }
    return laughButton;
}

/**
 * @description this function allows to switch between the different like buttons
 * 
 * @param {Array} post the publication to like
 */
export const switchLikeButton = (post, addEmoji, removeEmoji) => {
    let likeButton;
    const type = "like";
    const userId = parseInt(localStorage.session_id);

    if (post.countLikes === 0) {
        likeButton = (
            <span className="like-before">
                <input type="hidden" value={post.post_id} />
                <i className="far fa-thumbs-up" onClick={(e) => addEmoji(e, type)} title="J'aime"></i>
            </span>
        )
    } else {
        post.Likes.map(like => {
            if (like.like_user_id === userId && like.like_type === "like") {
                if (like.like_value === 0) {
                    likeButton = (
                        <span className="like-before">
                            <input type="hidden" value={post.post_id} />
                            <i className="far fa-thumbs-up" onClick={(e) => addEmoji(e, type)} title="J'aime"></i>
                        </span>
                    )
                } else if (like.like_value === 1) {
                    likeButton = (
                        <span className="like-after">
                            <input type="hidden" value={post.post_id} />
                            <i className="fas fa-thumbs-up" onClick={(e) => removeEmoji(e, type)} title="J'aime plus"></i>
                        </span>
                    )
                }
            } else {
                likeButton = (
                    <span className="like-before">
                        <input type="hidden" value={post.post_id} />
                        <i className="far fa-thumbs-up" onClick={(e) => addEmoji(e, type)} title="J'aime"></i>
                    </span>
                )
            }
            return likeButton;
        })
    }
    return likeButton;
};

/**
 * @description this function allows to switch between the different love buttons
 * 
 * @param {Array} post the publication to love
 */
export const switchLoveButton = (post, addEmoji, removeEmoji) => {
    let loveButton;
    const type = "love";
    const userId = parseInt(localStorage.session_id);

    if (post.countLoves === 0) {
        loveButton = (
            <span className="love-before">
                <input type="hidden" value={post.post_id} />
                <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
            </span>
        )
    } else {
        post.Likes.map(like => {
            if (like.like_user_id === userId && like.like_type === "love") {
                if (like.like_value === 0) {
                    loveButton = (
                        <span className="love-before">
                            <input type="hidden" value={post.post_id} />
                            <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
                        </span>
                    )
                } else if (like.like_value === 1) {
                    loveButton = (
                        <span className="love-after">
                            <input type="hidden" value={post.post_id} />
                            <i className="fas fa-heart" onClick={(e) => removeEmoji(e, type)} title="J'adore plus"></i>
                        </span>
                    )
                }
            } else {
                loveButton = (
                    <span className="love-before">
                        <input type="hidden" value={post.post_id} />
                        <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
                    </span>
                )
            }
            return loveButton;
        });
    }
    return loveButton;
};