const { DataTypes, TINYINT, UUIDV4 } = require("sequelize");
const sequelize = require('./config');

"use strict";

const User = sequelize.define('User', {              // User model
    // Model attributes are defined here
    user_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    user_firstname: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_lastname: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    user_password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_rank: {
        type: DataTypes.TINYINT(4),
        defaultValue: 1
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
    }, 
    user_last_connection: {
        type: DataTypes.DATE,
        defaultValue: Date
    },
    user_last_disconnection: {
        type: DataTypes.DATE,
        defaultValue: Date
    }
}, {
    // Other model options go here
    tableName: 'Users',
    timestamps: false
});

const Post = sequelize.define('Post', {             // post model
    // Model attributes are defined here
    post_id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    post_user_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false
    },
    post_content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    post_image: {
        type: DataTypes.STRING,
    },
    post_video: {
        type: DataTypes.STRING
    },
    post_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    // Other model options go here
    tableName: 'Posts',
    timestamps: false
});

const Comment = sequelize.define('Comment', {       // Comment model
    // Model attributes are defined here
    comment_id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    comment_post_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    comment_user_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false
    },
    comment_content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comment_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    // Other model options go here
    tableName: 'Comments',
    timestamps: false
});

const Like = sequelize.define('Like', {             // Like model
    // Model attributes are defined here
    like_id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    like_comment_id: {
        type: DataTypes.SMALLINT
    },
    like_post_id: {
        type: DataTypes.SMALLINT
    },
    like_user_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false
    },
    like_value: {
        type: TINYINT(1),
        allowNull: false
    }
},{
    // Other model options go here
    tableName: 'Likes',
    timestamps: false
});

const Message = sequelize.define('Message', {       // Message model
// Model attributes are defined here
    message_id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    message_sender_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false
    },
    message_receiver_id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        allowNull: false
    },
    message_content: {
        type: DataTypes.TEXT
    },
    message_date: {
        type: DataTypes.DATE,
        defaultValue: Date
    }
}, {
    // Other model options go here
    tableName: 'Messages',
    timestamps: false
});

User.hasOne(Post, {                                 // Associations
    foreignKey: 'post_user_id',
    constraints: false
});
Post.belongsTo(User, {
    foreignKey: 'post_user_id',
    constraints: false
});

User.hasOne(Comment, { 
    foreignKey: 'comment_user_id',
    constraints: false
});
Comment.belongsTo(User, {
    foreignKey: 'comment_user_id',
    constraints: false
});

User.hasOne(Like, {
    foreignKey: 'like_user_id',
    constraints: false
});
Like.belongsTo(User, {
    foreignKey: 'like_user_id',
    constraints: false
});

Post.hasMany(Comment, {
    foreignKey: 'comment_post_id'
});
Comment.belongsTo(Post, {
    foreignKey: 'comment_post_id'
});

Post.hasMany(Like, {
    foreignKey: 'like_post_id'
});
Like.belongsTo(Post, {
    foreignKey: 'like_post_id'
});

Comment.hasMany(Like, {
    foreignKey: 'like_comment_id'
});
Like.belongsTo(Comment, {
    foreignKey: 'like_comment_id'
})

module.exports = { Comment, Like, Post, User, Message };