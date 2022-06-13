import React from "react";

// Publications
export const ContentInput = ({ isModifyPost, setPostValues, setModifyPostValues, post }) => {
    const onChangeContent = (e) => {
        const oldContent = e.target.defaultValue;
        const content = e.target.value;
    
        if(content.length < 3 || content.trim() === "") {
            if (!isModifyPost) {
                setPostValues(previousState => { return {...previousState, content: ''} });
            } else {
                setModifyPostValues(previousState => { return {...previousState, content: oldContent} });
            }
        } else {
            if (!isModifyPost) {
                setPostValues(previousState => { return {...previousState, content: content}});
            } else {
                if (oldContent !== content) {
                    setModifyPostValues(previousState => { return {...previousState, content: content} });
                } else {
                    setModifyPostValues(previousState => { return {...previousState, content: oldContent} });
                }
            }
        }
    }
    
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
        ) : null
        // (
        //     <textarea 
        //         id={`modify__content-${post.id}`}
        //         defaultValue={post.content}
        //         onChange={onChangeContent}
        //         rows="5"
        //     >
        //     </textarea>
        // )
    )
};

export const ImageInput = ({ isModifyPost, setImageFile, setModifyImageFile, post }) => {

    const onChangeImage = (e, postId) => {
        const file = e.target.files[0];

        if(file.size > (1024 * 1024 * 5)) {
            if (!isModifyPost) {
                setImageFile(null);
                document.getElementById('isFile').style["display"] = "none";
            } else {
                setModifyImageFile(null);
                //document.getElementById(`modify__isFile-${postId}`).style["display"] = "none";
            }
        } else {
            if (!isModifyPost) {
                setImageFile(file);
                document.getElementById('isFile').style["display"] = "block";
            } else {
                setModifyImageFile(file);
                //document.getElementById(`modify__isFile-${postId}`).style["display"] = "block";
            }
        }
    }

    return (
        !isModifyPost ?
        (
            <input 
                id="image-file" 
                type="file" 
                accept="image/*" 
                onChange={onChangeImage} 
            />
        ) : null
        // (
        //     <input 
        //         id={`modify__image-${post.id}`} 
        //         className="modify__image" 
        //         type="file" 
        //         accept="image/*" 
        //         onChange={onChangeImage(post.id)}
        //     />
        // )
    )
};

export const VideoInput = ({ isModifyPost, setPostValues, setModifyPostValues, post }) => {

    const onChangeVideo = (e) => {
        const oldVideoLink = e.target.defaultValue;
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
    }
    
    return (
        !isModifyPost ?
        (
            <input 
                id="video-link"
                type="url"
                placeholder="http(s)://"
                onChange={onChangeVideo}
            />
        ) : null
        // (
        //     <input 
        //         id={`modify__video-${post.id}`}
        //         className="modify__video-link"
        //         type="url"
        //         placeholder="http(s)://"
        //         defaultValue={post.video}
        //         onChange={onChangeVideo}
        //     />
        // )
    )
};
