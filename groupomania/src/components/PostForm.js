/**
 * @description React component that returns the content input field
 */
export const ContentInput = ({ isModifyPost, setPostValues, setModifyPostValues, post }) => {
    let postId;
    let postContent;
    let postImage;
    let postVideo;

    if (isModifyPost && post !== null) {
        postId = post.id;
        postContent = post.content;
        postImage = post.image;
        postVideo = post.video;
    }

    const onChangeContent = (e) => {
        const oldContent = e.target.defaultValue;
        const content = e.target.value;

        if(!isModifyPost) {
            if(content.length < 3 || content.trim() === "") {
                setPostValues(previousState => { return {...previousState, content: ''} });
            } else {
                setPostValues(previousState => { return {...previousState, content: content}});
            }
        } else {
            if ((content.length < 3 || content.trim() === "") && !postImage && !postVideo) {
                setModifyPostValues(previousState => { return {...previousState, content: ''} });
            } else {
                if (content.trim() === "") {
                    setModifyPostValues(previousState => { return {...previousState, content: true} });
                }
                else if (oldContent !== content) {
                    setModifyPostValues(previousState => { return {...previousState, content: content} });
                } else {
                    setModifyPostValues(previousState => { return {...previousState, content: oldContent} });
                }
            }
        }
    
        // if(content.length < 3 || content.trim() === "") {
        //     if (!isModifyPost) {
        //         setPostValues(previousState => { return {...previousState, content: ''} });
        //     } else {
        //         setModifyPostValues(previousState => { return {...previousState, content: ''} });
        //     }
        // } else {
        //     if (!isModifyPost) {
        //         setPostValues(previousState => { return {...previousState, content: content}});
        //     } else {
        //         if (oldContent !== content) {
        //             setModifyPostValues(previousState => { return {...previousState, content: content} });
        //         } else {
        //             setModifyPostValues(previousState => { return {...previousState, content: oldContent} });
        //         }
        //     }
        // }
    };
    
    return (        
        !isModifyPost ?
        (
            <textarea 
                id="postText"
                name="postText"
                placeholder="Écrivez quelque chose..."
                onChange={onChangeContent}
                rows="5"
            >
            </textarea>
        ) :
        (
            <textarea 
                id={`modify__content-${postId}`}
                defaultValue={postContent}
                onChange={onChangeContent}
                rows="5"
            >
            </textarea>
        )
    )
};

/**
 * @description React component that returns the image input field
 */
export const ImageInput = ({ isModifyPost, setImageFile, setModifyImageFile, post }) => {
    let postId;
    if (isModifyPost && post !== null) {
        postId = post.id;
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
        !isModifyPost ?
        (
            <input 
                id="image-file" 
                type="file" 
                accept="image/*" 
                onChange={onChangeImage} 
            />
        ) : (
            <input 
                id={`modify__image-${postId}`}
                className="modify__image" 
                type="file" 
                accept="image/*"
                onChange={onChangeImage}
            />
        )
    )
};

/**
 * @description React component that returns the video input field
 */
export const VideoInput = ({ isModifyPost, setPostValues, setModifyPostValues, post }) => {
    let postId;
    let postVideo;
    if (isModifyPost && post !== null) {
        postId = post.id;
        postVideo = post.video;
    }

    const onChangeVideo = (e) => {
        const videoLink = e.target.value;
        const regexVideo = /^https?:\/\/[a-zA-Z0-9]{3,}.[a-z]{2,}.?\/?([?=a-zA-Z0-9]{2,})?/
        
        console.log("test")
        if (!videoLink.match(regexVideo)) {
            if (!isModifyPost) {
                setPostValues(previousState => { return {...previousState, video: null}});
            } else {
                setModifyPostValues(previousState => { return {...previousState, video: null}});
            }
        } else {
            if (!isModifyPost) {
                setPostValues(previousState => { return {...previousState, video: videoLink}});
            } else {
                setModifyPostValues(previousState => { return {...previousState, video: videoLink}});
            }
        }
    };
    
    return (
        !isModifyPost ?
        (
            <input 
                id="video-link"
                type="url"
                placeholder="http(s)://"
                onChange={onChangeVideo}
            />
        ) : (
            <input 
                id={`modify__video-${postId}`}
                className="modify__video-link"
                type="url"
                placeholder="http(s)://"
                defaultValue={postVideo}
                onChange={onChangeVideo}
            />
        )
    )
};
