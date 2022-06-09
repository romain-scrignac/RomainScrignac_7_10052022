const Emojis = ({ post, setNewMessage }) => {
    
    const addEmoji = (e, type) => {
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(type, postId, "1");
    };

    const removeEmoji = (e, type) => {
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(type, postId, "0");
    };

    /**
     * @description this function communicates with the API when adding or removing a like
     * 
     * @param {String} postId the id of the publication
     * @param {String} like the value of the like
     * @param {String} type the type of the like
     */
     const fetchLikeData = async (type, postId, like) => {
        try {
            const response = await fetch(`https://localhost/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ like: like, postId: postId, type: type })
            });
            if (response.ok) {
                setNewMessage(`Emoji ${postId} modified, like ${like}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const postId = post.post_id;
    const Likes = post.Likes;
    const countLaughs = post.countLaughs;
    const countLikes = post.countLikes;
    const countLoves = post.countLoves;

    /**
     * @description this function allows to switch between the different laugh buttons
     * 
     * @param {Array} post the publication to laugh
     */
    const switchLaughButton = () => {
        let laughButton;
        const type = "laugh";
        const userId = parseInt(localStorage.session_id);

        if (countLaughs === 0) {
            laughButton = (
                <span className="laugh-before">
                    <input type="hidden" value={postId} />
                    <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
                </span>
            )
        } else {            
            Likes.map(like => {
                if (like.like_user_id === userId && like.like_type === "laugh") {
                    if (like.like_value === 0) {
                        laughButton = (
                            <span className="laugh-before">
                                <input type="hidden" value={postId} />
                                <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
                            </span>
                        )
                    } else if (like.like_value === 1) {
                        laughButton = (
                            <span className="laugh-after">
                                <input type="hidden" value={postId} />
                                <i className="fas fa-grin-tears" onClick={(e) => removeEmoji(e, type)} title="C'est plus marrant"></i>
                            </span>
                        )
                    }
                } 
                else {
                    laughButton = (
                        <span className="laugh-before">
                            <input type="hidden" value={postId} />
                            <i className="far fa-grin-tears" onClick={(e) => addEmoji(e, type)} title="Haha"></i>
                        </span>
                    )
                }
                return laughButton;
            });
        }
        return laughButton;
    };

    /**
     * @description this function allows to switch between the different like buttons
     * 
     * @param {Array} post the publication to like
     */
    const switchLikeButton = () => {
        let likeButton;
        const type = "like";
        const userId = parseInt(localStorage.session_id);

        if (countLikes === 0) {
            likeButton = (
                <span className="like-before">
                    <input type="hidden" value={postId} />
                    <i className="far fa-thumbs-up" onClick={(e) => addEmoji(e, type)} title="J'aime"></i>
                </span>
            )
        } else {
            Likes.map(like => {
                if (like.like_user_id === userId && like.like_type === "like") {
                    if (like.like_value === 0) {
                        likeButton = (
                            <span className="like-before">
                                <input type="hidden" value={postId} />
                                <i className="far fa-thumbs-up" onClick={(e) => addEmoji(e, type)} title="J'aime"></i>
                            </span>
                        )
                    } else if (like.like_value === 1) {
                        likeButton = (
                            <span className="like-after">
                                <input type="hidden" value={postId} />
                                <i className="fas fa-thumbs-up" onClick={(e) => removeEmoji(e, type)} title="J'aime plus"></i>
                            </span>
                        )
                    }
                } else {
                    likeButton = (
                        <span className="like-before">
                            <input type="hidden" value={postId} />
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
    const switchLoveButton = () => {
        let loveButton;
        const type = "love";
        const userId = parseInt(localStorage.session_id);

        if (countLoves === 0) {
            loveButton = (
                <span className="love-before">
                    <input type="hidden" value={postId} />
                    <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
                </span>
            )
        } else {
            Likes.map(like => {
                if (like.like_user_id === userId && like.like_type === "love") {
                    if (like.like_value === 0) {
                        loveButton = (
                            <span className="love-before">
                                <input type="hidden" value={postId} />
                                <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
                            </span>
                        )
                    } else if (like.like_value === 1) {
                        loveButton = (
                            <span className="love-after">
                                <input type="hidden" value={postId} />
                                <i className="fas fa-heart" onClick={(e) => removeEmoji(e, type)} title="J'adore plus"></i>
                            </span>
                        )
                    }
                } else {
                    loveButton = (
                        <span className="love-before">
                            <input type="hidden" value={postId} />
                            <i className="far fa-heart" onClick={(e) => addEmoji(e, type)} title="J'adore"></i>
                        </span>
                    )
                }
                return loveButton;
            });
        }
        return loveButton;
    };

    return (
        <div className="post-various__emotes" key={postId}>
            <span className="nbLaughs">{countLaughs > 0 ? countLaughs : null}</span>
            {switchLaughButton()}
            <span className="nbLikes">{countLikes > 0 ? countLikes : null}</span>
            {switchLikeButton()}
            <span className="nbLoves">{countLoves > 0 ? countLoves : null}</span>
            {switchLoveButton()}
        </div>
    )
};

export default Emojis