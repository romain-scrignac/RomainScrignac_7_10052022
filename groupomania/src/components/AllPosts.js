import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { iconImg } from '../datas/images';
import { switchLikeButton, switchLoveButton, switchLaughButton } from './Emojis';

const AllPosts = () => {
    document.title = 'Groupomania';
    const navigate = useNavigate();
    const [order, setOrder] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [postContentValue, setPostContentValue] = useState('');
    const [postImageFile, setPostImageFile] = useState(null);
    const [addPost, setAddPost] = useState({
        content: postContentValue,
        image: postImageFile
    });
    const [newPost, setNewPost] = useState('');
    const [commentValue, setCommentValue] = useState('');
    const [addComment, setAddComment] = useState({
        content: commentValue
    });
    const [newComment, setNewComment] = useState('');
    const [allLikes, setAllLikes] = useState('');
    const [allDislikes, setAllDislikes] = useState('');
    const [textareaheight, setTextareaheight] = useState(5);
    
    useEffect(() => {
        /**
         * @description this function communicates with the API to display all posts
         */
        const getPosts = async () => {
            try{
                const response = await fetch(`https://localhost/api/posts/${order}`, {
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.session_token}`
                    }
                });
                if (response.ok) {
                    const responseJson = await response.json();
                    // Ajout de compteurs de likes
                    const postsFromApi = responseJson.allPosts.map(post => {
                        let likes = 0;
                        let loves = 0;
                        let laughs = 0;
                        for (let i = 0; i < post.Likes.length; i++) {
                            if (post.Likes[i].like_value === 1 && post.Likes[i].like_type === "like") {
                                likes++;
                            }
                            if (post.Likes[i].like_value === 1 && post.Likes[i].like_type === "love") {
                                loves++;
                            }
                            if (post.Likes[i].like_value === 1 && post.Likes[i].like_type === "laugh") {
                                laughs++;
                            }
                        }
                        return {...post, countLikes: likes, countLoves: loves, countLaughs: laughs}
                    });
                    setAllPosts(postsFromApi);
                }
            } catch (err) {
                console.error(err);
            }        
        };    
        getPosts();
    }, [allLikes, allDislikes, order, newPost, newComment]);

    const changeOrder = () => {
        if (order === "?order=date") {
            setOrder("");
        } 
        if (order === "") {
            setOrder("?order=date");
        }
    };

    // Posts
    const onChangeContent = (e) => {
        const content = e.target.value;

        if (e.target.scrollHeight > e.target.clientHeight) {
            setTextareaheight(textareaheight + 1);
        } else if (textareaheight > 5) {
            setTextareaheight(textareaheight - 1);
        }

        if(content.length < 10 || content.trim() === "") {
            setAddPost(previousState => { return {...previousState, content: ''}});
        } else {
            setAddPost(previousState => { return {...previousState, content: content}});
        }
        setPostContentValue(content);
    };

    const onChangeImage = (e) => {
        const file = e.target.files[0];
        if(file.size > (1024 * 1024)) {
            setAddPost(previousState => { return {...previousState, image: null}});
        } else {
            setAddPost(previousState => { return {...previousState, image: file}});
        }
        setPostImageFile(file);
    };

    const onModifyPost = (e) => {
        e.preventDefault();
        const previousInput = e.target.parentNode.previousSibling;
        console.log(previousInput.innerText)
    };

    const onDeletePost = (e, postId) => {
        e.preventDefault();
        const text = "Confirmez-vous la suppression du post ?";
        if (window.confirm(text)) {
            fetchDeletePost(postId);
        }
    };

    const onSubmitPost = (e) => {
        e.preventDefault();
        fetchPostData();
    };
    
    const resetPost = () => {
        setAddPost({ content: "", image: "" });
        document.getElementById('postText').value = '';
        document.getElementById('file').value = '';
        document.getElementById('isFile').innerText = '';
    }

    const sendMessage = (userId) => {
        navigate('/message?userId='+userId);
    };

    // Likes
    const addEmoji = (e, type) => {
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(type, postId, "1");
    };

    const removeEmoji = (e, type) => {
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(type, postId, "0");
    };

    // Comments
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
    }

    const onChangeComment = (e) => {
        e.preventDefault();
        const content = e.target.value;
        const submitBtn = e.target.nextSibling;

        if(content.trim() === "") {
            setAddComment(previousState => { return {...previousState, content: ''}});
            submitBtn.style["display"] = "none";

        } else {
            setAddComment(previousState => { return {...previousState, content: content}});
            submitBtn.style["display"] = "unset";
        }
        setCommentValue(content);
    };

    // const displayCommentoptions = (e) => {
    //     e.preventDefault();
    // };

    const onModifyComment = (e, commentId) => {

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

    const resetComment = (postId) => {
        setAddComment({ comment: '' });
        document.getElementById(`content-${postId}`).value = '';
    };

    /**
     * @description this function communicates with the API when adding a post
     */
    const fetchPostData = async () => {
        try {
            let response;
            if (addPost.image) {
                const formData = new FormData();
                formData.append("content", addPost.content)
                formData.append("file", addPost.image);
                formData.append('fileName', addPost.image.name);

                response = await fetch(`https://localhost/api/posts/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.session_token}`
                    },
                    body: formData
                });
            } else {
                response = await fetch(`https://localhost/api/posts/`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.session_token}`
                    },
                    body: JSON.stringify({ content: addPost.content })
                });
            }
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                resetPost();
                setNewPost(responseJson);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * @description this function communicates with the API when deleting a post
     */
    const fetchDeletePost = async (postId) => {
        try {
            const response = await fetch(`https://localhost/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ postId: postId })
            });
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                setNewPost(`Post ${postId} deleted`);
                console.log(responseJson.message);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
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
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                resetComment(postId);
                setNewComment(responseJson);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
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
                },
                body: JSON.stringify({ commentId: commentId })
            });
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                setNewComment(`Comment ${commentId} deleted`);
                console.log(responseJson.message);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * @description this function communicates with the API when adding or removing a like
     * 
     * @param {String} postId the id of the publication
     * @param {String} like the value of the like
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
                body: JSON.stringify({ like: like, postId: postId, userId: localStorage.session_id, type: type })
            });
            if (response.ok) {
                if (like === "1") {
                    setAllLikes(previousState => {
                        return {...previousState, postId: postId, like: like, userId: localStorage.session_id}
                    });
                }
                if (like === "0") {
                    setAllDislikes(previousState => {
                        return {...previousState, postId: postId, like: like, userId: localStorage.session_id} 
                    });
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="allPosts">
            {/* Publication form */}
            <div className="addPost">
                <h1>Envie de partager ?</h1>
                <form className="post-form">                   
                    <textarea 
                        id="postText"
                        name="postText"
                        placeholder="Écrivez quelque chose..."
                        onChange={onChangeContent}
                        rows="5"
                    >
                    </textarea>
                    <div className="post-form__options">
                        <label htmlFor="file" className="uploadImg">
                            <img
                                src={iconImg.cover}
                                alt={iconImg.name}
                                title="Insérer une image"
                            />
                            <span id="isFile" className="isFile">{postImageFile ? (postImageFile.name): null}</span>
                        </label>
                        <input id="file" type="file" accept="image/*" onChange={onChangeImage} />
                    </div>
                    { 
                        addPost.content || addPost.image ? 
                        (<button className="btn btn-submit-post" onClick={onSubmitPost}>Publier</button>):
                        (<button className="btn btn-submit-post" disabled>Publier</button>)
                    }
                </form>
            </div>
            {
                allPosts.length > 1 ? 
                (<button className="btn btn-order" onClick={changeOrder}>Trier par date</button>): null
            }
            {/* Display of publications */}
            {allPosts.map(post => (                
                <div className="post" key={post.post_id}>
                    <span 
                        className="post-author"
                        onClick={() => sendMessage(post.post_user_id)}
                        title="Envoyer un message"
                    >
                        {post.User.user_firstname}
                    </span>
                    {
                        post.post_image ? 
                        (<span className="post-image">
                            <img src={post.post_image} alt="Illustration du post" />
                        </span>) : null
                    }
                    {
                        post.post_content ?
                        (<div className="post-content">{post.post_content}</div>): null
                    }                    
                    <hr className="post-split"></hr>
                    <div className="post-various"> 
                        {
                            post.post_user_id === parseInt(localStorage.session_id) ? 
                            (
                                <div>
                                    <span className="post-various__edit" title="Modifier le post">
                                        <i className="fas fa-edit" onClick={(e) => onModifyPost(e, post.post_id)}></i>
                                    </span>
                                    <span className="post-various__delete" title="Supprimer le post">
                                        <i className="fas fa-trash-alt" onClick={(e) => onDeletePost(e, post.post_id)}></i>
                                    </span>
                                </div>
                            ): null
                        }
                        <div className="post-various__emotes" key={post.post_id}>
                            <span className="nbLoves">{post.countLoves > 0 ? post.countLoves : null}</span>
                            { switchLikeButton(post, addEmoji, removeEmoji) }
                            <span className="nbLikes">{post.countLikes > 0 ? post.countLikes : null}</span>
                            { switchLoveButton(post, addEmoji, removeEmoji) }
                            <span className="nbLaughs">{post.countLaughs > 0 ? post.countLaughs : null}</span>
                            { switchLaughButton(post, addEmoji, removeEmoji) }
                        </div>
                    </div>
                    <hr className="post-split"></hr>
                    {/* Display of comments */}
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
                    <div className="post-allComments">
                        {
                            post.Comments.map(comment => (
                                <div className="oneComment" key={comment.comment_id}>
                                    <span className="oneComment-author">{comment.User.user_firstname}</span>
                                    <span>{comment.comment_content}</span>
                                    {
                                        comment.comment_user_id === parseInt(localStorage.session_id) ?
                                        (
                                            <div className="oneComment-options">
                                                <div className="oneComment-options--display">
                                                    <span className="oneComment-options--dots">...</span>
                                                    <div className="oneComment-options--choices">
                                                        <span title="Modifier le commentaire" onClick={onModifyComment}>
                                                            Modifier
                                                        </span>
                                                        <span title="Supprimer le commentaire" onClick={onDeleteComment}>
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
                    <form className="post-addComment">
                        <textarea id={`content-${post.post_id}`} onChange={onChangeComment} rows="1" placeholder="Écrire un commentaire..."></textarea>
                        <span className="post-addComment__submit" onClick={(e) => onSubmitComment(e, post.post_id)}>
                            <i className="fas fa-check-circle" title="Envoyer le commentaire"></i>
                        </span>
                    </form>
                </div>
            ))}
        </div>
    )
};

export default AllPosts