import { useState, useEffect, lazy } from "react";
import { useNavigate } from 'react-router-dom';
import { ContentInput, ImageInput } from '../components/PostForm';
import { errorConnexion } from '../datas/functions';
import ModifyPost from '../components/ModifyPost';
const Emojis = lazy(() => import('../components/Emojis'));
const Comments = lazy(() => import('../components/Comments'));

const AllPosts = () => {
    document.title = 'Groupomania';
    const navigate = useNavigate();

    const [order, setOrder] = useState('dateDesc');                 // used to sort publications by activity date
    const [allPosts, setAllPosts] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [postContent, setPostContent] = useState('');
    const [isModifyPost, setIsModifyPost] = useState(false);        // used to switch between publication and modification form in PostForm component
    const [newMessage, setNewMessage] = useState('');               // used to update the web page following the activity

    useEffect(() => {
        /**
         * @description this function communicates with the API to display all posts
         */
        const getPosts = async () => {
            try{
                const response = await fetch(`https://localhost/api/posts/?order=${order}`, {
                    headers: { 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.session_token}`
                    }
                });
                const responseJson = await response.json();

                if (responseJson.error && (responseJson.error === 'Invalid token!'
                || responseJson.error === 'You are not logged in!')) {
                    errorConnexion(navigate);
                }
                if (response.ok) {
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
                } else {
                    setAllPosts([]);
                }
            } catch (err) {
                //console.log(err);
            }
        };    
        getPosts();
    }, [order, newMessage]);

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
                `Mis ?? jour le ${formatUpdatedAt}`
            )
        } else {
            return (
                `Publi?? le ${formatCreatedAt}`
            )
        }
    };

    /**
     * @description this function is used to change the display order of posts by activity date
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
        setPostContent('');
        document.getElementById('postText').value = '';
        document.getElementById('image-file').value = '';
        document.getElementById('isFile').innerText = '';
    };

    /**
     * @description this is used to view user's profile for admin
     */
    const profilView = (userId) => {
        navigate(`/account?userId=${userId}`);
    };

    /**
     * @description this function communicates with the API when adding a publication
     */
    const fetchPostData = async () => {
        try {
            let response;
            const url = 'https://localhost/api/posts/';
            const authorization = `Bearer ${localStorage.session_token}`;

            if (imageFile) {
                const formData = new FormData();
                formData.append("post", JSON.stringify({ content: postContent }));
                formData.append("image", imageFile);

                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': authorization
                    },
                    body: formData
                });
            } else {
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': authorization
                    },
                    body: JSON.stringify({ post: {content: postContent} })
                });
            }
            const responseJson = await response.json();

            if (response.ok) {
                resetForm();
                setNewMessage(`Post ${responseJson.postId} added`);
            }
        } catch (err) {
            //console.log(err);
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
            const responseJson = await response.json();
            
            if (response.ok) {
                setNewMessage(`Post ${postId} deleted`);
            }
            else if (responseJson.error && responseJson.error === 'Unauthorized request!') {
                alert("Vous n'avez pas les droits requis pour cette action !");
            }
        } catch (err) {
            //console.log(err);
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
                        setPostContent={setPostContent}
                        setModifyPostContent={null}
                        post={null}
                    />
                    <div className="post-form__options">
                        <div className="post-form__options-upload">
                            <label htmlFor="image-file" className="uploadFile">
                                <span className="uploadFile-image" title="Ins??rer une image">
                                    <i className="far fa-file-image"></i>
                                </span>
                            </label>
                            <ImageInput 
                                isModifyPost={isModifyPost}
                                setImageFile={setImageFile}
                                setModifyImageFile={null}
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
                        !isModifyPost && (postContent || imageFile) ? 
                        (<button className="btn btn-submit-post" onClick={onSubmitPost}>Publier</button>):
                        (<button className="btn btn-submit-post" disabled>Publier</button>)
                    }
                </form>
            </div>
            {
                allPosts.length < 1 ? (<p>Aucune publication actuellement, c'est le moment d'en cr??er une ????</p>) : null
            }
            {/* Button to change the order of the publications */}
            {
                allPosts.length > 1 ? 
                (<button className="btn btn-order" onClick={changeOrder}>Trier par date</button>) : null
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
                        {
                            // Display view user's profile if admin
                            Number(localStorage.session_rank) === 3 && post.User.id !== Number(localStorage.session_id) ?
                            (
                                <span 
                                    className="post-infos-user__author"
                                    title='Voir le profil'
                                    onClick={() => profilView(post.User.id)}
                                >
                                    {post.User.firstname}
                                </span>
                            ) : (
                                <span 
                                    className="post-infos-user__author"
                                    title={lastConnection(post.User.last_connection, post.User.last_disconnection)}
                                >
                                    {post.User.firstname}
                                </span>
                            )
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
                            post.content ? (<div className="post-content--text">{post.content}</div>) : null
                        }
                        <span className="post-content--date">
                            {formatDate(post)}
                        </span>
                        {
                            // If the publication has been moderated
                            post.moderator ?
                            (
                                <span className="post-content--moderation">
                                    (Post modifi?? par {post.moderator})
                                </span>
                            ) : null
                        }
                    </div>
                    <hr className="post-split"></hr>
                    {/* Post options */}
                    <div className="post-various">
                        {
                            post.user_id === Number(localStorage.session_id) || Number(localStorage.session_rank) > 1 ? 
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
                </div>
            ))}
        </div>
    )
};

export default AllPosts