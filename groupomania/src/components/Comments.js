import { useState } from 'react';

const Comments = ({ post, setNewMessage }) => {

    const [commentValue, setCommentValue] = useState('');
    const [addComment, setAddComment] = useState({
        content: commentValue
    });

    /**
     * @description this function is used to display comments
     */
    const displayComments = (e) => {
        e.preventDefault();
        const allComments = e.target.nextSibling;

        if (!allComments.style["display"]) {
            e.target.title = "Cacher"
            allComments.style["display"] = "flex";
        } else {
            e.target.title = "Afficher"
            allComments.style["display"] = "";
        }
    };

    const onChangeComment = (e) => {
        e.preventDefault();
        const content = e.target.value;
        const submitButton = e.target.nextSibling;

        if(content.trim() === "") {
            setAddComment(previousState => { return {...previousState, content: ''}});
            submitButton.style["display"] = "none";
        } else {
            setAddComment(previousState => { return {...previousState, content: content}});
            submitButton.style["display"] = "block";
        }
        setCommentValue(content);
    };

    const onDeleteComment = (e, commentId) => {
        e.preventDefault();
        const text = "Confirmez-vous la suppression du commentaire ?";
        if (window.confirm(text)) {
            fetchDeleteComment(commentId);
        }
    };

    const onSubmitComment = (e, postId) => {
        e.preventDefault();
        fetchCommentData(postId);
    };

    /**
     * @description this function is used to reset comment form
     */
    const resetComment = (postId) => {
        setAddComment({ comment: '' });
        document.getElementById(`content-${postId}`).value = '';
        document.getElementById(`submit-comment-${postId}`).style["display"] = 'none';
    };

    /**
     * @description this function communicates with the API when adding a comment
     */
     const fetchCommentData = async (postId) => {
        try {
            const response = await fetch(`https://localhost/api/comments/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ content: addComment.content, postId: postId })
            });
            const responseJson = await response.json();

            if (response.ok) {
                resetComment(postId);
                setNewMessage(`Comment ${responseJson.commentId} added`);
            }
        } catch (err) {
            //console.log(err);
        }
    };

    /**
     * @description this function communicates with the API when deleting a comment
     */
     const fetchDeleteComment = async (commentId) => {
        try {
            const response = await fetch(`https://localhost/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                }
            });
            const responseJson = await response.json();
            
            if (response.ok) {
                setNewMessage(`Comment ${commentId} deleted`);
            } else if (responseJson.error && responseJson.error === 'Unauthorized request!') {
                alert("Vous n'avez pas les droits requis pour cette action !");
            }
        } catch (err) {
            //console.log(err);
        }
    };

    return (
        <div>
            {/* Comments display option */}
            {
                post.Comments.length > 0 ?
                (
                    <span 
                        className="displayComments" 
                        onClick={displayComments}
                        title="Afficher"
                    >
                        {post.Comments.length} {post.Comments.length > 1 ? ("Commentaires") : ("Commentaire")}
                    </span>
                ): null
            }
            {/* Display of comments */}
            <div className="post-allComments">
                {
                    post.Comments.map(comment => (
                        <div className="oneComment" key={comment.id}>
                            <span className="oneComment-author">{comment.User.firstname}</span>
                            <span id={`comment-${comment.id}`}>{comment.content}</span>
                            {
                                comment.user_id === Number(localStorage.session_id) || Number(localStorage.session_rank) === 3 ?
                                (
                                    <div className="oneComment-options">
                                        <div className="oneComment-options--display">
                                            <span className="oneComment-options--dots">...</span>
                                            <div className="oneComment-options--choices">
                                                <span 
                                                    title="Supprimer le commentaire" 
                                                    onClick={(e) => onDeleteComment(e, comment.id)}
                                                >
                                                    Supprimer
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : null
                            }
                        </div>
                    ))
                }
            </div>
            {/* Comment form  */}
            <form className="post-addComment">
                <textarea id={`content-${post.id}`} onChange={onChangeComment} rows="1" placeholder="Écrire un commentaire..."></textarea>
                <span id={`submit-comment-${post.id}`} className="post-addComment__submit" onClick={(e) => onSubmitComment(e, post.id)}>
                    <i className="fas fa-check-circle" title="Envoyer le commentaire"></i>
                </span>
            </form>
        </div>
    )
};

export default Comments