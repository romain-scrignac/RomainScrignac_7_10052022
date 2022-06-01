import { useState, useEffect } from "react";
import { iconImg } from '../datas/images';

const AllPosts = () => {
    document.title = 'Groupomania';
    const [order, setOrder] = useState(false);
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
    let countLikes = [];
    
    useEffect(() => {
        getPosts();
    }, [allLikes, allDislikes, order, newPost]);

    function changeOrder() {
        if (order === false) {
            setOrder(true);
        } 
        if (order === true) {
            setOrder(false);
        }
    };

    function onChangeContent(e) {
        const content = e.target.value;
        if(content.length < 10) {
            setAddPost(previousState => { return {...previousState, content: ''}});
        } else {
            setAddPost(previousState => { return {...previousState, content: content}});
        }
        setPostContentValue(content);
    };

    function onChangeImage(e) {
        const file = e.target.files[0];
        if(file.size > (1024 * 1024)) {
            setAddPost(previousState => { return {...previousState, image: null}});
        } else {
            setAddPost(previousState => { return {...previousState, image: file}});
        }
        setPostImageFile(file);
    };

    function onSubmitPost(e) {
        e.preventDefault();
        fetchPostData();
    };

    function addLike(e) {
        e.preventDefault();
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(postId, "1");
    }

    function removeLike(e) {
        e.preventDefault();
        const postId = e.target.previousElementSibling.value;
        fetchLikeData(postId, "0");
    }

    const getPosts = async () => {
        try{
            const response = await fetch(`https://localhost/api/posts/`, {
                headers: { 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`,
                    'Query': `order ${order}`
                },
                Query: order
            });
            if (response.ok) {
                const responseJson = await response.json();
                setAllPosts(responseJson.allPosts);
                responseJson.allPosts.map(post => {
                    post.Likes.map(like => {
                        if (like.like_value === 1) {
                            countLikes.push({postId: post.post_id, like: 1, userId: like.like_user_id});
                        }
                        if (like.like_value === 0) {
                            countLikes.push({postId: post.post_id, like: 0, userId: like.like_user_id});
                        }
                        return like.like_value;
                    });
                    return post.Likes;
                });
            }
        } catch (err) {
            console.error(err);
        }        
    };

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
                alert(responseJson.err);
            } else {
                setNewPost(responseJson);
            }
            
        } catch (err) {
            console.error(err);
        }
    };

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
    
    return (
        <div className="allPosts">
            <div className="addPost">
                <h2>Publier</h2>
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
                (<button className="btn-order" onClick={changeOrder}>Trier par date</button>): null
            }
            
            {allPosts.map(post => (
                
                <div className="post" key={post.post_id}>
                    <p className="post-content">Post n° {post.post_id}:</p>
                    <p>{post.post_content}</p>
                    <span title= {post.User.user_email} className="post-name">{post.User.user_firstname}</span>
                    {
                        post.Likes.length === 0 ? 
                        (
                            <div className="btn-fav" key={post.post_id}>
                                <button 
                                    className="fav"
                                    title="Ajouter like"
                                >
                                    <span onClick={addLike} className="fav-before">
                                        <input type="hidden" value={post.post_id} />
                                        <i className="far fa-heart"></i>
                                    </span>
                                </button>
                            </div>
                        ):(
                            post.Likes.map( like => (
                                like.like_user_id !== parseInt(localStorage.session_id) ? 
                                (
                                    <div className="btn-fav" key={post.post_id}>
                                        <button 
                                            className="fav"
                                            title="Ajouter like"
                                        >
                                            <span onClick={addLike} className="fav-before">
                                                <input type="hidden" value={post.post_id} />
                                                <i className="far fa-heart"></i>
                                            </span>
                                        </button>
                                    </div>
                                ):(
                                    <div className="btn-fav" key={like.like_id}>
                                    {
                                        like.like_value === 0 && like.like_user_id === parseInt(localStorage.session_id) ?
                                        (
                                            <button 
                                                className="fav"
                                                title="Ajouter like"
                                            >
                                                <span onClick={addLike} className="fav-before">
                                                    <input type="hidden" value={post.post_id} />
                                                    <i className="far fa-heart"></i>
                                                </span>
                                            </button>
                                        ): null
                                    }
                                    {
                                        like.like_value === 1 && like.like_user_id === parseInt(localStorage.session_id) ?
                                        (
                                            <button 
                                                className="fav"
                                                title="Retirer like"
                                            >
                                                <span onClick={removeLike} className="fav-after">
                                                    <input type="hidden" value={post.post_id} />
                                                    <i className="fas fa-heart" ></i>
                                                </span>
                                            </button>
                                        ): null
                                    }
                                    </div>
                                )
                            ))
                        )
                    }
                </div>
            ))}
        </div>
    )
};

export default AllPosts