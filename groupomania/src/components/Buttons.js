/* Emoji button components  */

export const GrinTearsButtonEmpty = ({ addEmoji, postId, type }) => {
    return (
        <span className="laugh-before">
            <input type="hidden" value={postId} />
            <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
        </span>
    )
}

export const GrinTearsButtonFilled = ({ removeEmoji, postId, type }) => {
    return (
        <span className="laugh-after">
            <input type="hidden" value={postId} />
            <i className="fas fa-grin-tears" onClick={(e) => removeEmoji(e, type)} title="C'est plus marrant"></i>
        </span>
    )
}

export const ThumbUpButtonEmpty = ({ addEmoji, postId, type }) => {
    return(
        <span className="like-before">
            <input type="hidden" value={postId} />
            <i className="far fa-thumbs-up" onClick={(e) => addEmoji(e, type)} title="J'aime"></i>
        </span>
    )
};

export const ThumbUpButtonFilled = ({ removeEmoji, postId, type }) => {
    return (
        <span className="like-after">
            <input type="hidden" value={postId} />
            <i className="fas fa-thumbs-up" onClick={(e) => removeEmoji(e, type)} title="J'aime plus"></i>
        </span>
    )
};

export const HeartButtonEmpty = ({ addEmoji, postId, type  }) => {
    return (
        <span className="love-before">
            <input type="hidden" value={postId} />
            <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
        </span>
    )
};

export const HeartButtonFilled = ({ removeEmoji, postId, type }) => {
    return (
        <span className="love-after">
            <input type="hidden" value={postId} />
            <i className="fas fa-heart" onClick={(e) => removeEmoji(e, type)} title="J'adore plus"></i>
        </span>
    )
};