import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { iconImg } from '../datas/images';

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
                    const postsFromApi = responseJson.allPosts.map(post => {
                        if (post.Likes.length > 0) {
                            let likes = 0;
                            for (let i = 0; i < post.Likes.length; i++) {
                                if (post.Likes[i].like_value === 1) {
                                    likes++;
                                }
                            }
                            return {...post, countLikes: likes}
                        } else {
                            return {...post, countLikes: null}
                        }
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

    const onSubmitPost = (e) => {
        e.preventDefault();
        fetchPostData();
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
    }

    const sendMessage = (userId) => {
        navigate('/message?userId='+userId);
    };

    const addLike = (e) => {
        e.preventDefault();
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(postId, "1");
    };

    const removeLike = (e) => {
        e.preventDefault();
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(postId, "0");
    };

    // Comments
    const displayComments = (e) => {
        const allComments = e.target.nextSibling;
        console.log(e.target.title)
        if (!allComments.style["display"]) {
            e.target.title = "Cacher"
            allComments.style["display"] = "flex";
            
        } else {
            e.target.title = "Afficher"
            allComments.style["display"] = "";
        }
    }

    const onChangeComment = (e) => {
        const content = e.target.value;        
        const previousComment = e.target.nextSibling;
        //console.log(e.target.parentElement.firstChild)

        if(content.trim() === "") {
            setAddComment(previousState => { return {...previousState, content: ''}});
        } else {
            if (content.length > 3 && previousComment.style["display"] === "none") {
                previousComment.style["display"] = "block";
            } else if (content.length < 3) {
                previousComment.style["display"] = "none";
            }
            setAddComment(previousState => { return {...previousState, content: content}});
        }
        setCommentValue(content);
    };

    const onSubmitComment = (e, postId) => {
        e.preventDefault();
        fetchCommentData(postId);
    };

    const resetComment = (postId) => {
        document.getElementById(`content-${postId}`).value = '';
    }

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
     * @description this function communicates with the API when adding a post
     */
    const fetchPostData = async () => {
        try {
            const response = await fetch(`https://localhost/api/posts/`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ content: addPost.content, image: addPost.image, userId: localStorage.session_id })
            });

            const responseJson = await response.json((err) => {
                if (err) throw err;
            });

            if (response.ok) {
                setNewPost(responseJson);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
    };

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
                setNewPost(`${postId} deleted`);
                alert(responseJson.message);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * @description this function communicates with the API when adding or removing a like
     * 
     * @param {String} postId the id of the publication
     * @param {String} like the value of the like
     */
    const fetchLikeData = async (postId, like) => {
        try {
            const response = await fetch(`https://localhost/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ like: like, postId: postId, userId: localStorage.session_id })
            });
            const responseJson = await response.json();
            if(responseJson.err) {
                alert(responseJson.err);
            }
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

    /**
     * @description this function allows to switch between the different like buttons
     * 
     * @param {Array} post the publication to like
     * @param {Object} like all likes of the publication
     */
    const switchLikeButton = (post) => {
        let favButton;
        if (post.countLikes === null) {
            favButton = (
                <span className="fav-before">
                    <input type="hidden" value={post.post_id} />
                    <i className="far fa-heart" onClick={addLike} title="J'adore"></i>
                </span>
            )
        } else {
            for (let i = 0; i < post.Likes.length; i++) {
                const likeArray = Object.entries(post.Likes[i]);
                let userId = parseInt(localStorage.session_id);

                if (post.Likes[i].like_value === 0 && post.Likes[i].like_user_id === userId) {
                    favButton = (
                        <span className="fav-before">
                            <input type="hidden" value={post.post_id} />
                            <i className="far fa-heart" onClick={addLike} title="J'adore"></i>
                        </span>
                    )
                } else if (post.Likes[i].like_value === 1 && post.Likes[i].like_user_id === userId) {
                    favButton = (
                        <span className="fav-after">
                            <input type="hidden" value={post.post_id} />
                            <i className="fas fa-heart" onClick={removeLike} title="J'adore plus"></i>
                        </span>
                    )
                }
            }
        }
        return favButton
    }        

    return (
        <div className="allPosts">
            {/* Formulaire d'ajout de post */}
            <div className="addPost">
                <h1>Envie de partager ?</h1>
                <form className="post-form">                   
                    <textarea 
                        name="postText"
                        placeholder="Écrivez quelque chose..."
                        onChange={onChangeContent}
                        rows="5"
                    >
                    </textarea>
                    <div className="post-options">
                        <label htmlFor="file" className="btn-uploadImg">
                            <img
                                src={iconImg.cover}
                                alt={iconImg.name}
                                title="Insérer une image"
                            />
                            <span className="isFile">{postImageFile ? (postImageFile.name): null}</span>
                        </label>
                        <input type="file" id="file" accept="image/*" onChange={onChangeImage} />
                    </div>
                    { 
                        addPost.content ? 
                        (<button className="btn btn-submit-post" onClick={onSubmitPost}>Publier</button>):
                        (<button className="btn btn-submit-post" disabled>Publier</button>)
                    }
                </form>
            </div>
            {
                allPosts.length > 1 ? 
                (<button className="btn btn-order" onClick={changeOrder}>Trier par date</button>): null
            }

            {/* Affichage des posts */}
            {allPosts.map(post => (                
                <div className="post" key={post.post_id}>
                    <span 
                        className="post-author"
                        onClick={() => sendMessage(post.post_user_id)}
                        title="Envoyer un message"
                    >
                        {post.User.user_firstname}
                    </span>
                    <div className="post-content">{post.post_content}</div>
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
                            <span className="nbLikes">{post.countLikes > 0 ? post.countLikes : null}</span>
                            { switchLikeButton(post) }
                        </div>
                    </div>
                    <hr className="post-split"></hr>
                    {
                        post.Comments.length > 0 ?
                        (
                            <span 
                                className="displayComments" 
                                onClick={displayComments}
                                title="Afficher"
                            >
                                {post.Comments.length} {post.Comments.length > 1 ? ("Commentaires"):("Commentaire")}
                            </span>
                        ): null
                    }
                    <div className="post-allComments">
                        {
                            post.Comments.map(comment => (
                                <span className="oneComment" key={comment.comment_id}>
                                    <span className="oneComment-author">{comment.User.user_firstname}</span>
                                    {comment.comment_content}
                                </span>
                            ))
                        }
                    </div>
                    <form className="post-comment">
                        <textarea id={`content-${post.post_id}`} onChange={onChangeComment} rows="1" placeholder="Écrire un commentaire..."></textarea>
                        <span className="post-comment-submit" onClick={(e) => onSubmitComment(e, post.post_id)}>
                            <i className="fas fa-check-circle" title="Envoyer le commentaire"></i>
                        </span>
                    </form>
                </div>
            ))}
        </div>
    )
};

export default AllPosts