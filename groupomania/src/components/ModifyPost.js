const ModifyPost = ({ post, setIsModifPost, modifyImageFile, setModifyImageFile, modifyPostValues, setModifyPostValues, 
    onChangeContent, onChangeImage, onChangeVideo, setNewMessage }) => {

    const displayModifyVideo = (e, post) => {
        e.preventDefault();
        const videoLink = document.getElementById(`modify__video-${post.id}`);

        if (videoLink.style["display"] === "" ) {
            videoLink.style["display"] = "block";
        } else {
            videoLink.style["display"] = "";
        }
    };

    const onSubmitModifyPost = (e, postId) => {
        e.preventDefault();
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
        setModifyImageFile(null);
        setIsModifPost(false);
        setModifyPostValues({ content: "", video: null });
        setNewMessage('Cancelled modification');
    };

    /**
     * @description this function communicates with the API when a post is modified
     */
     const fetchModifyPost = async (e, postId) => {
        try {
            let response;
            if (modifyImageFile) {
                const formData = new FormData();
                formData.append("post", JSON.stringify(modifyPostValues));
                formData.append("image", modifyImageFile);
                formData.append('fileName', modifyImageFile.name);

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
                    body: JSON.stringify({ post: modifyPostValues })
                });
            }
            const responseJson = await response.json((err) => {
                if (err) throw err;
            });
            if (response.ok) {
                resetModify(e, postId);
                setNewMessage(`Post ${postId} modified`);
            } else {
                alert(responseJson.error);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modify-form" id={`modify-form-${post.id}`}>
            <form className="post-form--modify" name={`modify-post-${post.id}`}>
                <textarea 
                    id={`modify__content-${post.id}`}
                    rows="5" 
                    onChange={onChangeContent} 
                    defaultValue={post.content}
                >
                </textarea>
                <div className="post-form--modify__options">
                    <div className="post-form__options-upload">
                        <label 
                            htmlFor={`modify__image-${post.id}`}
                            className="uploadFile"
                        >
                            <span className="uploadFile-image" title="Insérer une image">
                                <i className="far fa-file-image"></i>
                            </span>
                        </label>
                        <input 
                            id={`modify__image-${post.id}`} 
                            className="modify__image" 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => onChangeImage(e, post.id)}
                        />
                        <label 
                            htmlFor={`modify__video-${post.id}`} 
                            className="uploadFile" 
                            onClick={(e) => displayModifyVideo(e, post)}
                        >
                            <span className="uploadFile-video"  title="Insérer un lien vers une vidéo">
                                <i className="far fa-file-video"></i>
                            </span>
                        </label>
                        <input 
                            id={`modify__video-${post.id}`}
                            className="modify__video-link"
                            type="url" 
                            defaultValue={post.video}
                            placeholder="http(s)://" 
                            onChange={onChangeVideo}
                        />
                    </div>
                    <div className="displayFileName">
                        <span 
                            id={`modify__isFile-${post.id}`} 
                            className="modify__isFile"
                        >
                            {modifyImageFile ? (modifyImageFile.name): null}
                        </span>
                    </div>
                </div>
                <div className="confirm-modify">
                    { 
                        modifyPostValues.content || modifyPostValues.video || modifyImageFile ? 
                        (
                            <button 
                                className="btn btn-submit" 
                                onClick={(e) => onSubmitModifyPost(e, post.id)}
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
                        onClick={(e) => resetModify(e, post.id)}
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