import { useState, useEffect, lazy } from "react";
import { useNavigate } from 'react-router-dom';
import ModifyPost from '../components/ModifyPost';
import { ContentInput, ImageInput, VideoInput } from '../components/PostForm';
const Emojis = lazy(() => import('../components/Emojis'));
const Comments = lazy(() => import('../components/Comments'));

const AllPosts = () => {
    document.title = 'Groupomania';
    const navigate = useNavigate();

    const [order, setOrder] = useState('dateDesc');
    const [offset, setOffset] = useState(0);
    const [allPosts, setAllPosts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [postValues, setPostValues] = useState({
        content: '',
        video: null
    });
    const [isModifyPost, setIsModifyPost] = useState(false);
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
                    // Reactions counters
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

    /**
     * @description this function allows to display if a user is online or not. 
     *              If yes, it transforms the date to HH:MM format
     */
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
    
    /**
     * @description this function switches between the publication and update date
     *               and transforms it into DD-MM-YYYY format
     */
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

    /**
     * @description this function is used to change the offset of infinite scroll
     */
    // const changeOffset = () => {
    //     setOffset(offset + 10);
    // };

    /**
     * @description this function is used to change the display order of posts by date
     */
    // Order of posts
    const changeOrder = () => {
        if (order === "dateDesc") {
            setOrder("dateAsc");
        }
        if (order === "dateAsc") {
            setOrder("dateDesc");
        }
    };

    /**
     * @description this function is used to navigate to the mailbox
     */
    // Send message to user
    const sendMessage = (userId) => {
        navigate(`/messages?userId=${userId}`);
    };

    /**
     * @description this function is used to display the video address bar
     */
    const displayInputVideo = (e) => {
        e.preventDefault();
        const videoLink = document.getElementById('video-link');

        if (videoLink.style["display"] === "" ) {
            videoLink.style["display"] = "block";
        } else {
            videoLink.style["display"] = "";
        }
    };

    /**
     * @description this function is used to display the modification form of a publication
     */
    const onModifyPost = (e, post) => {
        e.preventDefault();
        const form = document.getElementById(`modify-form-${post.id}`);
        if (form.style["display"] === "") {
            form.style["display"] = "flex";
        }
        setIsModifyPost(true);
    };

    /**
     * @description this function is used to display a confirmation dialog before deletion of a post
     */
    const onDeletePost = (e, postId) => {
        e.preventDefault();
        const text = "Confirmez-vous la suppression du post ?";
        if (window.confirm(text)) {
            fetchDeletePost(postId);
        }
    };

    /**
     * @description this function is used to submit the publication
     */
    const onSubmitPost = (e) => {
        e.preventDefault();
        fetchPostData();
    };
    
    /**
     * @description this is used to reset the publication form after sending
     */
    const resetForm = () => {
        setImageFile(null);
        setPostValues({ content: "", video: null });
        document.getElementById('postText').value = '';
        document.getElementById('image-file').value = '';
        document.getElementById('isFile').innerText = '';
        document.getElementById('video-link').value = '';
    };

    /**
     * @description this function is used to replace the video address if it's youtube
     *              and return an iframe tag
     */
    const videoPlayer = (post) => {
        let videoUrl;
        if (post.video.match(/www.youtube.com\/watch\?v=/)) {
            videoUrl = post.video.replace("watch?v=", "embed/");
        } else {
            videoUrl = post.video;
        }
        return (
            <iframe
                className="post-content--video"
                src={videoUrl}
                loading="lazy"
                autohide="1" 
                frameBorder="0" 
                scrolling="no"
                title={`video-${post.id}`}
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
                resetForm();
                setNewMessage(`Post added ${responseJson.postId}`);
                console.log(responseJson.message);
            } else {
                console.log(responseJson.error);
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
                console.log(responseJson.error);
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
                    <ContentInput 
                        isModifyPost={isModifyPost}
                        setPostValues={setPostValues}
                        setModifyPostValues={null}
                        post={null}
                    />
                    <div className="post-form__options">
                        <div className="post-form__options-upload">
                            <label htmlFor="image-file" className="uploadFile">
                                <span className="uploadFile-image" title="Insérer une image">
                                    <i className="far fa-file-image"></i>
                                </span>
                            </label>
                            <ImageInput 
                                isModifyPost={isModifyPost}
                                setImageFile={setImageFile}
                                setModifyImageFile={null}
                                post={null}
                            />
                            <label htmlFor="video-link" className="uploadFile" onClick={displayInputVideo}>
                                <span className="uploadFile-video"  title="Insérer un lien vers une vidéo">
                                    <i className="far fa-file-video"></i>
                                </span>
                            </label>
                            <VideoInput 
                                isModifyPost={isModifyPost}
                                setPostValues={setPostValues}
                                setModifyPostValues={null}
                                post={null}
                            />
                        </div>
                        <div className="displayFileName">
                            <span id="isFile" className="isFile">
                                {imageFile ? (imageFile.name): null}
                            </span>
                        </div>
                    </div>
                    { 
                        !isModifyPost && (postValues.content || postValues.video || imageFile) ? 
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
                        isModifyPost={isModifyPost}
                        setIsModifyPost={setIsModifyPost}
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
                                        <i className="fas fa-edit" onClick={(e) => onModifyPost(e, post)}></i>
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