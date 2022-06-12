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
    const [order, setOrder] = useState('dateDesc');
    const [offset, setOffset] = useState(0);
    const [allPosts, setAllPosts] = useState([]);
    const [isModifPost, setIsModifPost] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [postValues, setPostValues] = useState({
        content: '',
        video: null
    });
    const [modifyImageFile, setModifyImageFile] = useState(null);
    const [modifyPostValues, setModifyPostValues] = useState({
        content: '',
        video: null
    });
    const [newMessage, setNewMessage] = useState('');
    
    useEffect(() => {
        /**
         * @description this function communicates with the API to display all posts
         */
        const getPosts = async () => {            
            try{
                const response = await fetch(`https://localhost/api/posts/?offset=${offset}&order=${order}`, {
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
                            if (post.Likes[i].value === 1 && post.Likes[i].type === "like") {
                                likes++;
                            }
                            if (post.Likes[i].value === 1 && post.Likes[i].type === "love") {
                                loves++;
                            }
                            if (post.Likes[i].value === 1 && post.Likes[i].type === "laugh") {
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
    }, [order, offset, newMessage]);

    const lastConnection = (last_connection, last_disconnection) => {
        const dateLastConnection = new Date(last_connection);
        const dateLastDisconnection = new Date(last_disconnection);
        const hour = new Intl.DateTimeFormat(
            'fr', {timeStyle: "short"}
            ).format(dateLastConnection);

        if (dateLastConnection > dateLastDisconnection) {
            return `En ligne depuis ${hour}`
        }
        else {
            return "Hors ligne"
        }
    };
    
    const formatDate = (post) => {
        const createdAt = new Date(post.createdAt);
        const updatedAt = new Date(post.updatedAt);
        const formatCreatedAt = new Intl.DateTimeFormat(
            'fr', {dateStyle: "short"}
        ).format(createdAt);
        const formatUpdatedAt = new Intl.DateTimeFormat(
            'fr', {dateStyle: "short"}
        ).format(updatedAt);

        if (updatedAt > createdAt) {
            return (
                `Mis à jour le ${formatUpdatedAt}`
            )
        } else {
            return (
                `Publié le ${formatCreatedAt}`
            )
        }
    };

    // Pagination
    const changeOffset = () => {
        setOffset(offset + 10);
    };

    // Order of posts
    const changeOrder = () => {
        if (order === "dateDesc") {
            setOrder("dateAsc");
        }
        if (order === "dateAsc") {
            setOrder("dateDesc");
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
                if (!isModifPost) {
                    setPostValues(previousState => { return {...previousState, content: ''} });
                } else {
                    setModifyPostValues(previousState => { return {...previousState, content: ''} });
                }
            } else {
                if (!isModifPost) {
                    setPostValues(previousState => { return {...previousState, content: content}});
                } else {
                    setModifyPostValues(previousState => { return {...previousState, content: content} });
                }
            }
        };
    };

    const onChangeImage = (e, postId) => {
        const file = e.target.files[0];
        if(file.size > (1024 * 1024 * 5)) {
            if (!isModifPost) {
                setImageFile(null);
                document.getElementById('isFile').style["display"] = "none";
            } else {
                setModifyImageFile(null);
                document.getElementById(`modify__isFile-${postId}`).style["display"] = "none";
            }
        } else {
            if (!isModifPost) {
                setImageFile(file);
                document.getElementById('isFile').style["display"] = "block";
            } else {
                setModifyImageFile(file);
                document.getElementById(`modify__isFile-${postId}`).style["display"] = "block";
            }
        }
    };

    const onChangeVideo = (e) => {
        const oldVideoLink = e.target.defaultValue;
        const videoLink = e.target.value;
        const regexVideo = /^https?:\/\/[a-zA-Z0-9]{3,}.[a-z]{2,}.?\/?([?=a-zA-Z0-9]{2,})?/
        
        if (oldVideoLink !== videoLink) {
            console.log("test")
            if (!videoLink.match(regexVideo)) {
                if (!isModifPost) {
                    setPostValues(previousState => { return {...previousState, video: null}});
                } else {
                    setModifyPostValues(previousState => { return {...previousState, video: null}});
                }
            } else {
                if (!isModifPost) {
                    setPostValues(previousState => { return {...previousState, video: videoLink}});
                } else {
                    setModifyPostValues(previousState => { return {...previousState, video: videoLink}});
                }
            }
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
        if (form.style["display"] === "") {
            form.style["display"] = "flex";
        }
        setIsModifPost(true);
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
        setImageFile(null);
        setPostValues({ content: "", video: null });
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
                className="post-content--video"
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
            if (imageFile) {
                const formData = new FormData();
                formData.append("post", JSON.stringify(postValues));
                formData.append("image", imageFile);
                //formData.append('fileName', imageFile.name);

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
                    body: JSON.stringify({ post: postValues })
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
                console.error(responseJson.error);
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
                }
            });
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                setNewMessage(`Post ${postId} deleted`);
                console.log(responseJson.message);
            } else {
                console.error(responseJson.error);
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
                        <div className="post-form__options-upload">
                            <label htmlFor="image-file" className="uploadFile">
                                <span className="uploadFile-image" title="Insérer une image">
                                    <i className="far fa-file-image"></i>
                                </span>
                            </label>
                            <input id="image-file" type="file" accept="image/*" onChange={onChangeImage} />
                            <label htmlFor="video-link" className="uploadFile" onClick={displayInputVideo}>
                                <span className="uploadFile-video"  title="Insérer un lien vers une vidéo">
                                    <i className="far fa-file-video"></i>
                                </span>
                            </label>
                            <input id="video-link" type="url" placeholder="http(s)://" onChange={onChangeVideo} />
                        </div>
                        <div className="displayFileName">
                            <span id="isFile" className="isFile">
                                {imageFile ? (imageFile.name): null}
                            </span>
                        </div>
                    </div>
                    { 
                        postValues.content || postValues.video || imageFile ? 
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
                <div className="post" key={post.id}>
                    {/* Modify post form */}
                    <ModifyPost 
                        post={post}
                        setIsModifPost={setIsModifPost}
                        modifyImageFile={modifyImageFile}
                        setModifyImageFile={setModifyImageFile}
                        modifyPostValues={modifyPostValues}
                        setModifyPostValues={setModifyPostValues}
                        onChangeContent={onChangeContent}
                        onChangeImage={onChangeImage}
                        onChangeVideo={onChangeVideo}
                        setNewMessage={setNewMessage}
                    />
                    {/* Post author informations */}
                    <div className="post-infos-user">
                        <span
                            className='post-infos-user__avatar'
                            title={lastConnection(post.User.last_connection, post.User.last_disconnection)}
                        >
                            <img src={post.User.avatar} alt ={`Avatar ${post.User.firstname}`} />
                        </span>
                        <span
                            className="post-infos-user__author"
                            title={lastConnection(post.User.last_connection, post.User.last_disconnection)}
                        >
                            {post.User.firstname}
                        </span>
                        {
                            post.user_id !== parseInt(localStorage.session_id) ?
                            (
                                <span 
                                    className="post-infos-user__send-message"
                                    title={`Envoyer un message à ${post.User.firstname}`}
                                    onClick={() => sendMessage(post.user_id)}
                                >
                                    <i className="far fa-envelope"></i>
                                </span>
                            ) : null
                        }                        
                    </div>
                    {/* Content of the publication */}
                    <div className="post-content">
                        {
                            post.image ? 
                            (<span className="post-content--image">
                                <img src={post.image} alt="Illustration du post" />
                            </span>) : null
                        }
                        {
                            post.video ? videoPlayer(post) : null
                        }
                        {
                            post.content ? (<div className="post-content--text">{post.content}</div>) : null
                        }
                        <span className="post-content--date">{formatDate(post)}</span>
                    </div>
                    <hr className="post-split"></hr>
                    {/* Post options */}
                    <div className="post-various">
                        {
                            post.user_id === parseInt(localStorage.session_id) ? 
                            (
                                <div className="post-various--options">
                                    <span className="post-various--options__edit" title="Modifier le post">
                                        <i className="fas fa-edit" onClick={(e) => onModifyPost(e, post.id)}></i>
                                    </span>
                                    <span className="post-various--options__delete" title="Supprimer le post">
                                        <i className="fas fa-trash-alt" onClick={(e) => onDeletePost(e, post.id)}></i>
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

                    {/* // TODO implement infinite scroll */}
                    {window.addEventListener("scroll", () => {
                        // TODO 1) know if we are at the bottom of the page
                        // TODO 2) if bottom reached, call API with the correct offset to get 10 more posts
                        // TODO 3) re set component posts with current posts + newly fetched posts
                    })}
                </div>
            ))}
        </div>
    )
};

export default AllPosts