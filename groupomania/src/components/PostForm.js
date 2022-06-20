/**
 * @description React component that returns the content input field
 */
export const ContentInput = ({ isModifyPost, setPostContent, setModifyPostContent, post }) => {
    let postId;
    let postContent;
    let postImage;
    let inputId = "postText";
    let placeholder = "Écrivez quelque chose...";
    let defaultValue = null;

    if (post !== null) {
        postId = post.id;
        postContent = post.content;
        postImage = post.image;
        inputId = `modify__content-${postId}`;
        placeholder = null;
        defaultValue = postContent;
    }

    const onChangeContent = (e) => {
        const content = e.target.value;

        // If it's not a post modification
        if (!isModifyPost) {
            if(content.length < 3 || content.trim() === "") {
                setPostContent('');
            } else {
                setPostContent(content);
            }
        } else {
            if (!postImage && (content.length < 3 || content.trim() === "")) {
                setModifyPostContent('');
            } else if (postImage && content.trim() === "") {
                setModifyPostContent(null);
            } else {
                setModifyPostContent(content);
            }
        }
    };
    
    return (
        <textarea 
                id={inputId}
                name="postText"
                placeholder={placeholder}
                onChange={onChangeContent}
                defaultValue={defaultValue}
                rows="5"
            >
        </textarea>
    )
};

/**
 * @description React component that returns the image input field
 */
export const ImageInput = ({ isModifyPost, setImageFile, setModifyImageFile, post }) => {
    let postId;
    let inputId = "image-file";
    let inputClass = null;

    if (post !== null) {
        postId = post.id;
        inputId = `modify__image-${postId}`;
        inputClass = 'modify__image'
    }

    const onChangeImage = (e) => {
        const file = e.target.files[0];

        if(file.size > (1024 * 1024 * 5)) {
            if (!isModifyPost) {
                setImageFile(null);
            } else {
                setModifyImageFile(null);
            }
        } else {
            if (!isModifyPost) {
                setImageFile(file);
            } else {
                setModifyImageFile(file);
            }
        }
    };

    return (
        <input
            id={inputId}
            className={inputClass}
            type="file"
            accept="image/*"
            onChange={onChangeImage}
        />
    )
};