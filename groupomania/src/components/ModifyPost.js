import { ContentInput, ImageInput, VideoInput } from '../components/PostForm';
import { useState } from 'react';

const ModifyPost = ({ post, isModifyPost, setIsModifyPost, setNewMessage }) => {

    const [modifyPostValues, setModifyPostValues] = useState({
        content: '',
        video: null
    });
    const [modifyImageFile, setModifyImageFile] = useState(null);
    const [deleteImage, setDeleteImage] = useState(false);

    /**
     * @description this function is used to display the video address bar
     */
    const displayModifyVideo = (e, post) => {
        e.preventDefault();
        const videoLink = document.getElementById(`modify__video-${post.id}`);

        if (videoLink.style["display"] === "" ) {
            videoLink.style["display"] = "block";
        } else {
            videoLink.style["display"] = "";
        }
    };

    /**
     * @description this function is used to display the name of the image
     */
    const DisplayFileName = ({ post }) => {
        if (modifyImageFile && !deleteImage) {
            return `Image: ${modifyImageFile.name}`;
        } else if (post.image && !deleteImage) {
            return `Image: ${post.image.split('images/')[1]}`;
        }
    };

    /**
     * @description this function is used to remove the image from a post
     */
    const onDeleteImage = (e) => {
        e.preventDefault();
        setDeleteImage(true);
        e.target.style["display"] = 'none';
    };

    /**
     * @description this function is used to reset modification form
     */
    const resetModify = (e, post) => {
        e.preventDefault();
        const form = document.getElementById(`modify-form-${post.id}`);
        const imageField = document.getElementById(`modify__image-${post.id}`);
        const contentField = document.getElementById(`modify__content-${post.id}`);
        const videoField = document.getElementById(`modify__video-${post.id}`);
        const deleteFile = document.getElementById(`deleteFile-${post.id}`);
        // On enlève les affichages créés lors de la modification
        form.style["display"] = "";
        videoField.style['display'] = "";
        if (post.image && !modifyImageFile && post.content) {
            deleteFile.firstChild.style["display"] = "unset";
        }
        // On remet tous les états à leurs valeurs par défaut
        setModifyImageFile(null);
        setModifyPostValues({content: '', video: null});
        setDeleteImage(false);
        setIsModifyPost(false);
        setNewMessage(`Reset modification ${contentField.value + imageField.value + videoField.value}`);
        // On remet les valuers par défaut dans les champs du formulaire
        contentField.value = post.content;
        videoField.value = post.video;
        imageField.value = '';
    };

    /**
     * @description this function is used to validate the modification
     */
     const onSubmitModifyPost = (e, post) => {
        e.preventDefault();
        // Définition des valeurs à envoyer selon modification ou non
        let contentValue;
        let imageValue;
        let videoValue;

        if (modifyPostValues.content) {
            contentValue = modifyPostValues.content;
        } else {
            contentValue = post.content;
        }
        if (modifyPostValues.video) {
            videoValue = modifyPostValues.video;
        } else {
            videoValue = post.video;
        }
        if (modifyImageFile) {
            imageValue = modifyImageFile;
        } else {
            if (deleteImage) {
                imageValue = null;
            } else {
                imageValue = post.image;
            }
        }
        fetchModifyPost(e, post, contentValue, imageValue, videoValue);
    };

    /**
     * @description this function communicates with the API when a post is modified
     */
    const fetchModifyPost = async (e, post, contentValue, imageValue, videoValue) => {
        try {
            const formData = new FormData();

            if(modifyImageFile) {
                formData.append("post", JSON.stringify({ 
                    content: contentValue, 
                    video: videoValue
                }));
                formData.append("image", imageValue);
            } else {
                formData.append("post", JSON.stringify({
                    content: contentValue, 
                    video: videoValue, 
                    imageUrl: imageValue,
                }));
            }

            const response = await fetch(`https://localhost/api/posts/${post.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.session_token}`
                },
                body: formData
            });
            if (response.ok) {
                setNewMessage(`Reset modification ${contentValue + imageValue + videoValue}`);
                resetModify(e, post);
            }
        } catch (err) {
            console.log(err);
        }

            // else {
            //     response = await fetch(`https://localhost/api/posts/${post.id}`, {
            //         method: 'PUT',
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-type': 'application/json',
            //             'Authorization': `Bearer ${localStorage.session_token}`
            //         },
            //         body: JSON.stringify({ post: modifyPostValues })
            //     });
            // }
            
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
                        <span id={`modify__isFile-${post.id}`} className="modify__isFile">
                            <DisplayFileName post={post} />
                        </span>
                        { 
                            post.image && !modifyImageFile && post.content? 
                            (
                                <span id={`deleteFile-${post.id}`} className="deleteFile" onClick={onDeleteImage}>
                                    <i className="far fa-trash-alt" title="Supprimer l'image"></i>
                                </span>
                            ) : null
                        }
                    </div>
                </div>
                <div className="confirm-modify">
                    { 
                        modifyPostValues.content || modifyPostValues.video || modifyImageFile || deleteImage ? 
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