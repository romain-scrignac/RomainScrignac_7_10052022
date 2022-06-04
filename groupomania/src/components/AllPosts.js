import { useState, useEffect } from "react";
import { iconImg } from '../datas/images';

const AllPosts = () => {
    document.title = 'Groupomania';
    const [order, setOrder] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [allLikes, setAllLikes] = useState('');
    const [allDislikes, setAllDislikes] = useState('');
    const [postContentValue, setPostContentValue] = useState('');
    const [postImageFile, setPostImageFile] = useState(null);
    const [addPost, setAddPost] = useState({
        content: postContentValue,
        image: postImageFile
    });
    
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
                        let likes = 0;
                        for (let i = 0; i < post.Likes.length; i++) {
                            if (post.Likes[i].like_value === 1) {
                                likes++;
                            }
                        }
                        return {...post, countLikes: likes}
                    });
                    setAllPosts(postsFromApi);    
                }
            } catch (err) {
                console.error(err);
            }        
        };    
        getPosts();
    }, [allLikes, allDislikes, order, newPost]);

    const changeOrder = () => {
        if (order === "?order=date") {
            setOrder("");
        } 
        if (order === "") {
            setOrder("?order=date");
        }
    };

    const onChangeContent = (e) => {
        const content = e.target.value;
        if(content.length < 10) {
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

    const addLike = (e) => {
        e.preventDefault();
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(postId, "1");
    }

    const removeLike = (e) => {
        e.preventDefault();
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(postId, "0");
    }

    const modifyPost = (e) => {
        e.preventDefault();
        const previousInput = e.target.parentNode.previousSibling;
        console.log(previousInput.innerText)
    }

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

            if (!response.ok) {
                console.log(localStorage.session_id)
                alert(responseJson.err);
            } else {
                setNewPost(responseJson);
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
    const switchButton = (post, like) => {
        let favButton;
        Object.entries(like).forEach(
            ([key, value]) => key === "like_user_id" && value === parseInt(localStorage.session_id) ?
            (
                like.like_value === 0 ?
                (
                    favButton = (
                        <div className="btn-fav" key={like.like_id}>
                            <button 
                                className="fav"
                                title="J'aime"
                            >
                                <span className="nbLikes">{post.countLikes}</span>
                                <span className="fav-before">
                                    <input type="hidden" value={post.post_id} />
                                    <i className="far fa-heart" onClick={addLike}></i>
                                </span>
                            </button>
                        </div>
                    )
                ):(
                    favButton = (
                        <div className="btn-fav" key={like.like_id}>
                            <button 
                                className="fav"
                                title="J'aime plus"
                            >
                                <span className="nbLikes">{post.countLikes > 0 ? post.countLikes : null}</span>
                                <span className="fav-after">
                                    <input type="hidden" value={post.post_id} />
                                    <i className="fas fa-heart" onClick={removeLike} ></i>
                                </span>
                            </button>
                        </div>
                    )
                )
            ): null
        )
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
                    <p className="post-content">Post n° {post.post_id}:</p>
                    <p>{post.post_content}</p>
                    {
                        post.user_id !== parseInt(localStorage.session_id) ? 
                        (
                            <span className="btn-nav" title="Modifier le post">
                                <i className="fas fa-edit" onClick={modifyPost}></i>
                            </span>
                        ): null
                    }
                    <span title= {post.User.user_email} className="post-name">{post.User.user_firstname}</span>
                    
                    {/* Affichage des likes */}
                    {
                        post.countLikes === 0 ?
                        (
                            <div className="btn-fav">
                                <button 
                                    className="fav"
                                    title="J'aime"
                                >
                                    <span className="fav-before">
                                        <input type="hidden" value={post.post_id} />
                                        <i className="far fa-heart" onClick={addLike}></i>
                                    </span>
                                </button>
                            </div>
                        ):(
                            post.Likes.map( like => (
                                switchButton(post, like)
                            ))
                        )
                    }
                </div>
            ))}
        </div>
    )
};

export default AllPosts