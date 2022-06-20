import { ContentInput, ImageInput } from '../components/PostForm';
import { useState } from 'react';

const ModifyPost = ({ post, isModifyPost, setIsModifyPost, setNewMessage }) => {

    const [modifyPostContent, setModifyPostContent] = useState('');
    const [modifyImageFile, setModifyImageFile] = useState(null);
    const [deleteImage, setDeleteImage] = useState(false);

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
        const deleteFile = document.getElementById(`deleteFile-${post.id}`);

        // On enlève les affichages créés lors de la modification
        form.style["display"] = "";
        if (post.image && !modifyImageFile && post.content) {
            deleteFile.firstChild.style["display"] = "unset";
        }

        // On remet tous les états à leurs valeurs par défaut
        setModifyImageFile(null);
        setModifyPostContent('');
        setDeleteImage(false);
        setIsModifyPost(false);
        setNewMessage(`Reset modification ${Date()}`);

        // On remet les valeurs par défaut dans les champs du formulaire
        contentField.value = post.content;
        imageField.value = '';
    };

    /**
     * @description this function is used to validate the modification
     */
     const onSubmitModifyPost = (e, post) => {
        e.preventDefault();
        let contentValue;
        let imageValue;
      
        if (modifyPostContent || modifyPostContent === null) {
            contentValue = modifyPostContent;
        } else {
            contentValue = post.content;
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
        fetchModifyPost(e, post, contentValue, imageValue);
    };

    /**
     * @description this function communicates with the API when a post is modified
     */
    const fetchModifyPost = async (e, post, contentValue, imageValue) => {
        try {
            let response;
            const url = `https://localhost/api/posts/${post.id}`;
            const authorization = `Bearer ${localStorage.session_token}`;

            if(modifyImageFile) {
                const formData = new FormData();
                formData.append("post", JSON.stringify({ content: contentValue }));
                formData.append("image", imageValue);

                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': authorization
                    },
                    body: formData
                });
            } else {
                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-type': 'application/json',
                        'Authorization': authorization
                    },
                    body: JSON.stringify({ post: {content: contentValue, imageUrl: imageValue} })
                });
            }
            if (response.ok) {
                resetModify(e, post);
            }
        } catch (err) {
            // console.log(err);
        }
    };

    return (
        <div className="modify-form" id={`modify-form-${post.id}`}>
            <form className="post-form--modify" name={`modify-post-${post.id}`}>
                <ContentInput
                    isModifyPost={isModifyPost}
                    setPostValues={null}
                    setModifyPostContent={setModifyPostContent}
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
                    </div>
                    <div className="displayFileName">
                        <span id={`modify__isFile-${post.id}`} className="modify__isFile">
                            <DisplayFileName post={post} />
                        </span>
                        { 
                            post.image && !modifyImageFile && post.content ? 
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
                        modifyPostContent || (modifyPostContent === null && !deleteImage) || modifyImageFile 
                        || (deleteImage && modifyPostContent !== null) ? 
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