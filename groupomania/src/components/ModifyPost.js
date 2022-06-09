const ModifyPost = ({ post, postValue, setPostValue, onChangeContent, onChangeImage, onChangeVideo, setNewMessage }) => {

    const displayModifyVideo = (e, post) => {
        e.preventDefault();
        const videoLink = document.getElementById(`modify__video-${post.post_id}`);

        if (videoLink.style["display"] === "" ) {
            videoLink.style["display"] = "block";
        } else {
            videoLink.style["display"] = "";
        }
    };

    const onSubmitModifyPost = (e, postId) => {
        e.preventDefault();
        console.log(postValue);
        fetchModifyPost(e, postId);
    };

    const resetModify = (e, postId) => {
        e.preventDefault();
        const form = document.getElementById(`modify-form-${postId}`);
        const content = document.getElementById(`modify__content-${postId}`);
        const image = document.getElementById(`modify__image-${postId}`);
        const video = document.getElementById(`modify__video-${postId}`);

        form.style["display"] = "";
        content.value = content.defaultValue;
        image.file = null;
        video.value = video.defaultValue;
        setPostValue({ content: "", image: null, video: null });
        setNewMessage('Cancelled modification');
    };

    /**
     * @description this function communicates with the API when a post is modified
     */
     const fetchModifyPost = async (e, postId) => {
        try {
            let response;
            if (postValue.image) {
                const formData = new FormData();
                formData.append("postId", postId);
                formData.append("content", postValue.content);
                formData.append("video", postValue.video);
                formData.append("file", postValue.image);
                formData.append('fileName', postValue.image.name);

                response = await fetch(`https://localhost/api/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.session_token}`
                    },
                    body: formData
                });
            } else {
                response = await fetch(`https://localhost/api/posts/${postId}`, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${localStorage.session_token}`
                    },
                    body: JSON.stringify({ postId: postId, content: postValue.content, video: postValue.video })
                });
            }
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                resetModify(e, postId);
                setNewMessage(`Post ${postId} modified`);
            } else {
                alert(responseJson.err);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modify-form" id={`modify-form-${post.post_id}`}>
            <form className="post-form--modify" name={`modify-post-${post.post_id}`}>
                <textarea 
                    id={`modify__content-${post.post_id}`}
                    rows="5" 
                    onChange={onChangeContent} 
                    defaultValue={post.post_content}
                >
                </textarea>
                <div className="post-form--modify__options">
                    <label 
                        htmlFor={`modify__image-${post.post_id}`}
                        className="uploadFile"
                    >
                        <span className="uploadFile-image" title="Insérer une image">
                            <i className="far fa-file-image"></i>
                        </span>
                    </label>
                    <input 
                        id={`modify__image-${post.post_id}`} 
                        className="modify__image" 
                        type="file" 
                        accept="image/*" 
                        onChange={onChangeImage}
                    />
                    <span className="modify__isFile">{postValue.image ? (postValue.image.name): null}</span>
                    <label 
                        htmlFor={`modify__video-${post.post_id}`} 
                        className="uploadFile" 
                        onClick={(e) => displayModifyVideo(e, post)}
                    >
                        <span className="uploadFile-video"  title="Insérer un lien vers une vidéo">
                            <i className="far fa-file-video"></i>
                        </span>
                    </label>
                    <input 
                        id={`modify__video-${post.post_id}`}
                        className="modify__video-link"
                        type="url" 
                        defaultValue={post.post_video}
                        placeholder="http(s)://" 
                        onChange={onChangeVideo}
                    />
                </div>
                <div className="confirm-modify">
                    { 
                        postValue.content || postValue.image ? 
                        (
                            <button 
                                className="btn btn-submit" 
                                onClick={(e) => onSubmitModifyPost(e, post.post_id)}
                                title="Valider la modification"
                            >
                                Modifier
                            </button>
                        ) : (
                            <button className="btn btn-submit" disabled>Modifier</button>
                        )
                    }
                    <button 
                        className="btn btn-submit" 
                        onClick={(e) => resetModify(e, post.post_id)}
                        title="Annuler la modification"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    )
};

export default ModifyPost