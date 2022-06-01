import { useState, useEffect } from "react";
import { iconImg } from '../datas/images';

const AllPosts = () => {

    const [order, setOrder] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [allLikes, setAllLikes] = useState([]);
    const [allDislikes, setAllDislikes] = useState([]);
    const [postContentValue, setPostContentValue] = useState('');
    const [postImageFile, setPostImageFile] = useState(null);
    const [addPost, setAddPost] = useState({
        content: postContentValue,
        image: postImageFile
    });
    
    useEffect(() => {
        getPosts()
    }, []);

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
        const postId = e.target.value;
        fetchLikeData(postId, "1");
        
    }

    function addDislike(e) {
        e.preventDefault();
        const postId = e.target.value;        
        fetchLikeData(postId, "-1");
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
                
                for (let i = 0; i < responseJson.allPosts.length; i++) {
                    if (responseJson.allPosts[i].Likes[0]) {
                        if (responseJson.allPosts[i].Likes[0].like_value === 1) {
                            setAllLikes(
                                previousState => {
                                    return {
                                        ...previousState,
                                        postId: responseJson.allPosts[i].post_id,
                                        like: 1
                                    }
                                }
                            )
                        } else {
                            //setAllLikes(allLikes.push({postId: responseJson.allPosts[i].post_id, like: 0}))
                        }

                        if (responseJson.allPosts[i].Likes[0].like_value === -1) {
                            setAllDislikes(
                                previousState => {
                                    return {
                                        ...previousState,
                                        postId: responseJson.allPosts[i].post_id,
                                        like: -1
                                    }
                                }
                            )
                        } else {
                            //setAllDislikes(allDislikes.push({postId: responseJson.allPosts[i].post_id, dislike: 0}))
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }        
    };

    // const getLikes = async () => {
    //     const response = await fetch('https://localhost/api/posts/', {
    //         headers: { 
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${localStorage.session_token}`
    //         }
    //     });
    //     if (response.ok) {
    //         const responseJson = await response.json();
    //         const likes = responseJson.allLikes;
    //         setAllLikes(likes);
    //     }
    // };

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

            if (!response.ok) {
                const responseJson = await response.json((err) => {
                    if (err) throw err;
                });
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchLikeData = async (postId, like) => {
        try {
            await fetch(`https://localhost/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: JSON.stringify({ like: like, postId: postId, userId: localStorage.session_id })
            });
        } catch (err) {
            console.error(err);
        }
    }

    // console.log(allLikes)
    function likeList (post_id) {
        for (let i = 0; i < allLikes; i++) {
            if (allLikes[i].postId === post_id) {
                 return allLikes.like
                }
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
                allPosts.length > 1 ? (<button onClick={changeOrder}>Trier par date</button>): null
            }
            
            {allPosts.map(post => (
                <div className="post" key={post.post_id}>
                    <p className="post-content">Post n° {post.post_id}:</p>
                    <p>{post.post_content}</p>
                    <span title= {post.User.user_email} className="post-name">{post.User.user_firstname}</span>
                        {
                            post.Likes.like_value ?
                            (<p>Likes: 1</p>):
                            (<p>Likes: 0</p>)
                        }
                        {
                            allDislikes.postId === post.post_id ? 
                            (<p>Dislikes: {allDislikes.dislike}</p>):
                            (<p>Dislikes: 0</p>)
                        }
                    
                        <button onClick={addLike} value={post.post_id}>+</button>
                        <button onClick={addDislike} value={post.post_id}>-</button>
                    
                </div>
            ))}
        </div>
    )
};

export default AllPosts