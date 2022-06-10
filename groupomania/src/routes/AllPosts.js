import { useState, useEffect, lazy } from "react";
import { useNavigate } from 'react-router-dom';
import ModifyPost from '../components/ModifyPost';
// import Comments from '../components/Comments';
// import Emojis from '../components/Emojis';
const Emojis = lazy(() => import('../components/Emojis'));
const Comments = lazy(() => import('../components/Comments'));

const AllPosts = () => {
    document.title = 'Groupomania';

    const navigate = useNavigate();
    const [order, setOrder] = useState('');
    const [allPosts, setAllPosts] = useState([]);
    const [postContentValue, setPostContentValue] = useState('');
    const [postImageFile, setPostImageFile] = useState(null);
    const [postVideoLink, setPostVideoLink] = useState(null);
    const [postValue, setPostValue] = useState({
        content: postContentValue,
        image: postImageFile,
        video: postVideoLink
    });
    const [newMessage, setNewMessage] = useState('');
    
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
                    // Likes counters
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
    }, [order, newMessage]);

    // Order of posts
    const changeOrder = () => {
        if (order === "?order=date") {
            setOrder("");
        } 
        if (order === "") {
            setOrder("?order=date");
        }
    };

    // Send message to user
    const sendMessage = (userId) => {
        navigate('/message?userId='+userId);
    };

    // Publications
    const onChangeContent = (e) => {
        const oldContent = e.target.defaultValue;
        const content = e.target.value;

        if (oldContent !== content) {
            if(content.length < 3 || content.trim() === "") {
                setPostValue(previousState => { return {...previousState, content: ''}});
            } else {
                setPostValue(previousState => { return {...previousState, content: content}});
            }
            setPostContentValue(content);
        };
    };

    const onChangeImage = (e) => {
        const file = e.target.files[0];
        if(file.size > (1024 * 1024 * 5)) {
            setPostValue(previousState => { return {...previousState, image: null}});
        } else {
            setPostValue(previousState => { return {...previousState, image: file}});
        }
        setPostImageFile(file);
    };

    const onChangeVideo = (e) => {
        const oldVideoLink = e.target.defaultValue;
        const videoLink = e.target.value;
        const regexVideo = /^https?:\/\/[a-zA-Z0-9]{3,}.[a-z]{2,}.?\/?([?=a-zA-Z0-9]{2,})?/
        
        if (oldVideoLink !== videoLink) {
            console.log("test")
            if (!videoLink.match(regexVideo)) {
                setPostValue(previousState => { return {...previousState, video: null}});
            } else {
                setPostValue(previousState => { return {...previousState, video: videoLink}});
            }
            setPostVideoLink(videoLink);
        }
    };

    const displayInputVideo = (e) => {
        e.preventDefault();
        const videoLink = document.getElementById('video-link');

        if (videoLink.style["display"] === "" ) {
            videoLink.style["display"] = "block";
        } else {
            videoLink.style["display"] = "";
        }
    };

    const onModifyPost = (e, postId) => {
        e.preventDefault();
        const form = document.getElementById(`modify-form-${postId}`);
        const content = document.getElementById(`modify__content-${postId}`);
        const image = document.getElementById(`modify__image-${postId}`);
        const video = document.getElementById(`modify__video-${postId}`);
        setPostValue({
            content: content.defaultValue,
            image: image.defaultValue,
            video: video.defaultValue
        });

        if (form.style["display"] === "") {
            form.style["display"] = "flex";
        }
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
        console.log(postValue)
        fetchPostData();
    };
    
    const resetPost = () => {
        setPostValue({ content: "", image: null, video: null });
        document.getElementById('postText').value = '';
        document.getElementById('image-file').file = null;
        document.getElementById('isFile').innerText = '';
        document.getElementById('video-link').value = '';
    };

    const videoPlayer = (post) => {
        let videoUrl;
        if (post.post_video.match(/www.youtube.com\/watch\?v=/)) {
            videoUrl = post.post_video.replace("watch?v=", "embed/");
        } else {
            videoUrl = post.post_video;
        }
        return (
            <iframe
                className="post-video"
                src={videoUrl}
                loading="lazy"
                autohide="1" 
                frameBorder="0" 
                scrolling="no"
                title={`video-${post.post_id}`}
            ></iframe>
        )
    };

    /**
     * @description this function communicates with the API when adding a publication
     */
    const fetchPostData = async () => {
        try {
            let response;
            if (postValue.image) {
                const formData = new FormData();
                formData.append("content", postValue.content);
                formData.append("video", postValue.video);
                formData.append("file", postValue.image);
                formData.append('fileName', postValue.image.name);

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
                    body: JSON.stringify({ content: postValue.content, video: postValue.video })
                });
            }
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                resetPost();
                setNewMessage(`Post added ${responseJson.postId}`);
                console.log(responseJson.message);
            } else {
                alert(responseJson.error);
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
                setNewMessage(`Post ${postId} deleted`);
                console.log(responseJson.message);
            } else {
                alert(responseJson.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        
        <div className="allPosts" id="allPosts">
            
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
                        <label htmlFor="image-file" className="uploadFile">
                            <span className="uploadFile-image" title="Insérer une image">
                                <i className="far fa-file-image"></i>
                            </span>
                        </label>
                        <input id="image-file" type="file" accept="image/*" onChange={onChangeImage} />
                        <span id="isFile" className="isFile">
                            {postImageFile ? (postImageFile.name): null}
                        </span>
                        <label htmlFor="video-link" className="uploadFile" onClick={displayInputVideo}>
                            <span className="uploadFile-video"  title="Insérer un lien vers une vidéo">
                                <i className="far fa-file-video"></i>
                            </span>
                        </label>
                        <input id="video-link" type="url" placeholder="http(s)://" onChange={onChangeVideo} />
                    </div>
                    { 
                        postValue.content || postValue.image ? 
                        (<button className="btn btn-submit-post" onClick={onSubmitPost}>Publier</button>):
                        (<button className="btn btn-submit-post" disabled>Publier</button>)
                    }
                </form>
            </div>
            {/* Button to change the order of the publications */}
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
                        post.post_video ? videoPlayer(post) : null
                    }
                    {
                        post.post_content ?
                        (<div className="post-content">{post.post_content}</div>): null
                    }
                    {/* Modify post form */}
                    <ModifyPost 
                        post={post}
                        postValue={postValue}
                        setPostValue={setPostValue}
                        onChangeContent={onChangeContent}
                        onChangeImage={onChangeImage}
                        onChangeVideo={onChangeVideo}
                        setNewMessage={setNewMessage}
                    />

                    <hr className="post-split"></hr>
                    {/* Post options */}
                    <div className="post-various">
                        {
                            post.post_user_id === parseInt(localStorage.session_id) ? 
                            (
                                <div className="post-various--options">
                                    <span className="post-various--options__edit" title="Modifier le post">
                                        <i className="fas fa-edit" onClick={(e) => onModifyPost(e, post.post_id)}></i>
                                    </span>
                                    <span className="post-various--options__delete" title="Supprimer le post">
                                        <i className="fas fa-trash-alt" onClick={(e) => onDeletePost(e, post.post_id)}></i>
                                    </span>
                                </div>
                            ): null
                        }
                        {/* Emojis */}
                        <Emojis post={post} setNewMessage={setNewMessage} />
                    </div>
                    <hr className="post-split"></hr>
                    {/* Comments */}
                    <Comments post={post} setNewMessage={setNewMessage} />
                </div>
            ))}
        </div>
    )
};

export default AllPosts