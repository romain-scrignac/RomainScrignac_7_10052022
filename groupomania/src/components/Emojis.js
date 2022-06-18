import { 
    GrinTearsButtonEmpty, GrinTearsButtonFilled, 
    ThumbUpButtonEmpty, ThumbUpButtonFilled,
    HeartButtonEmpty, HeartButtonFilled 
} from "./Buttons";

// Verification of reactions values
const userHasLaughedThisPost = (post, userId) => {
    return post.Likes.some(like => like.user_id === userId && like.value === 1 && like.type === 'laugh');
};
const userHasLikedThisPost = (post, userId) => {
    return post.Likes.some(like => like.user_id === userId && like.value === 1 && like.type === 'like');
};
const userHasLovedThisPost = (post, userId) => {
    return post.Likes.some(like => like.user_id === userId && like.value === 1 && like.type === 'love');
};

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
     * @description this function communicates with the API when adding or removing a reaction to the publication
     * 
     * @param {String} postId the id of the publication
     * @param {String} like the value of the reaction
     * @param {String} type the type of the reaction
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
            //console.error(err);
        }
    };

    const userId = parseInt(localStorage.session_id);
    const postId = post.id;
    const countLaughs = post.countLaughs;
    const countLikes = post.countLikes;
    const countLoves = post.countLoves;

    /**
     * @description this function allows to switch between the different grin-tears buttons
     * 
     * @param {Array} post the publication to laugh
     */
    const switchGrinTearsButton = () => {
        const type = "laugh";

        // si l'utilisateur n'a jamais "laugh" ce post ou qu'il est redevenu neutre
        if (!userHasLaughedThisPost(post, userId) || countLaughs === 0) {
            return <GrinTearsButtonEmpty postId={postId} type={type} addEmoji={addEmoji}/>;
        } else {
            return <GrinTearsButtonFilled postId={postId} type={type} removeEmoji={removeEmoji}/>
        }
    };

    /**
     * @description this function allows to switch between the different thumb-up buttons
     * 
     * @param {Array} post the publication to like
     */
    const switchThumbUpButton = () => {
        const type = "like";

        // si l'utilisateur n'a jamais "like" ce post ou qu'il est redevenu neutre
        if (!userHasLikedThisPost(post, userId) || countLikes === 0) {
            return <ThumbUpButtonEmpty postId={postId} type={type} addEmoji={addEmoji}/>;
        } else {
            return <ThumbUpButtonFilled postId={postId} type={type} removeEmoji={removeEmoji}/>
        }
    };

    /**
     * @description this function allows to switch between the different heart buttons
     * 
     * @param {Array} post the publication to love
     */
    const switchHeartButton = () => {
        const type = "love";

        // si l'utilisateur n'a jamais "love" ce post ou qu'il est redevenu neutre
        if (!userHasLovedThisPost(post, userId) || countLoves === 0) {
            return <HeartButtonEmpty postId={postId} type={type} addEmoji={addEmoji}/>;
        } else {
            return <HeartButtonFilled postId={postId} type={type} removeEmoji={removeEmoji}/>
        }
    };

    return (
        <div className="post-various__emotes" key={postId}>
            <span className="nbLaughs">{countLaughs > 0 ? countLaughs : null}</span>
            {switchGrinTearsButton()}
            <span className="nbLikes">{countLikes > 0 ? countLikes : null}</span>
            { switchThumbUpButton()}
            <span className="nbLoves">{countLoves > 0 ? countLoves : null}</span>
            {switchHeartButton()}
        </div>
    )
};

export default Emojis