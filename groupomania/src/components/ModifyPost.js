import { ContentInput, ImageInput, VideoInput } from '../components/PostForm';
import { useState } from 'react';

const ModifyPost = ({ post, isModifyPost, modifyPostValues, setModifyPostValues, setNewMessage }) => {

    const [modifyImageFile, setModifyImageFile] = useState(null);

    const displayModifyVideo = (e, post) => {
        e.preventDefault();
        const videoLink = document.getElementById(`modify__video-${post.id}`);

        if (videoLink.style["display"] === "" ) {
            videoLink.style["display"] = "block";
        } else {
            videoLink.style["display"] = "";
        }
    };

    const onSubmitModifyPost = (e, post) => {
        e.preventDefault();
        fetchModifyPost(e, post);
    };

    const resetModify = (e, post) => {
        e.preventDefault();
        const form = document.getElementById(`modify-form-${post.id}`);
        const content = document.getElementById(`modify__content-${post.id}`);
        const image = document.getElementById(`modify__image-${post.id}`);
        const video = document.getElementById(`modify__video-${post.id}`);

        form.style["display"] = "";
        content.value = post.content;
        video.value = post.video;
        image.file = null;
        setModifyImageFile(null);
        setModifyPostValues({ content: "", video: null });
        setNewMessage('Cancelled modification'+content);
        console.log(video.value)
    };

    /**
     * @description this function communicates with the API when a post is modified
     */
     const fetchModifyPost = async (e, post) => {
        try {
            let response;
            if (modifyImageFile) {
                const formData = new FormData();
                formData.append("post", JSON.stringify(modifyPostValues));
                formData.append("image", modifyImageFile);
                formData.append('fileName', modifyImageFile.name);

                response = await fetch(`https://localhost/api/posts/${post.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.session_token}`
                    },
                    body: formData
                });
            } else {
                response = await fetch(`https://localhost/api/posts/${post.id}`, {
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
                resetModify(e, post);
                setNewMessage(`Post ${post.id} modified`);
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
                <ContentInput
                    isModifyPost={isModifyPost}
                    setPostValues={null}
                    setModifyPostValues={setModifyPostValues}
                    post={post}
                />
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
                        <ImageInput 
                            isModifyPost={isModifyPost}
                            setImageFile={null}
                            setModifyImageFile={setModifyImageFile}
                            post={post}
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
                        <VideoInput 
                            isModifyPost={isModifyPost}
                            setPostValues={null}
                            setModifyPostValues={setModifyPostValues}
                            post={post}
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
                                onClick={(e) => onSubmitModifyPost(e, post)}
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
                        onClick={(e) => resetModify(e, post)}
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