const { DataTypes, TINYINT, SMALLINT } = require("sequelize");
const sequelize = require('./config');

"use strict";

const User = sequelize.define('User', {              // User model
    // Model attributes are defined here
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    firstname: {
        type: DataTypes.STRING(75),
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING(75),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(75),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'https://localhost/images/avatars/avatar.svg'
    },
    rank: {
        type: DataTypes.TINYINT(4),
        defaultValue: 1
    },
    code: {
        type: DataTypes.STRING(6),
        allowNull: false
    },
    isVerified: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0
    }, 
    last_connection: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    last_disconnection: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    // Other model options go here
    tableName: 'Users',
    timestamps: false
});

const Post = sequelize.define('Post', {             // post model
    // Model attributes are defined here
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    video: {
        type: DataTypes.STRING
    }
}, {
    // Other model options go here
    tableName: 'Posts'
});

const Comment = sequelize.define('Comment', {       // Comment model
    // Model attributes are defined here
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    post_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    user_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    // Other model options go here
    tableName: 'Comments'
});

const Like = sequelize.define('Like', {             // Like model
    // Model attributes are defined here
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    comment_id: {
        type: DataTypes.SMALLINT
    },
    post_id: {
        type: DataTypes.SMALLINT
    },
    user_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    value: {
        type: TINYINT(1),
        allowNull: false
    },
    type: {
        type: SMALLINT(10)
    }
},{
    // Other model options go here
    tableName: 'Likes',
    timestamps: false
});

const Message = sequelize.define('Message', {       // Message model
// Model attributes are defined here
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    sender_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    receiver_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: Date
    }
}, {
    // Other model options go here
    tableName: 'Messages',
    timestamps: false
});

User.hasOne(Post, {                                 // Associations
    foreignKey: 'user_id'
});
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasOne(Comment, { 
    foreignKey: 'user_id'
});
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasOne(Like, {
    foreignKey: 'user_id'
});
Like.belongsTo(User, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'cascade'
});
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

Post.hasMany(Like, {
    foreignKey: 'post_id',
    onDelete: 'cascade'
});
Like.belongsTo(Post, {
    foreignKey: 'post_id'
});

Comment.hasMany(Like, {
    foreignKey: 'comment_id',
    onDelete: 'cascade'
});
Like.belongsTo(Comment, {
    foreignKey: 'comment_id'
})

module.exports = { Comment, Like, Post, User, Message };