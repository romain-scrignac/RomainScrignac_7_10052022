const { DataTypes } = require("sequelize");
const sequelize = require('./config');

const User = sequelize.define('User', {              // User model
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
        type: DataTypes.TINYINT(1),
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
    tableName: 'Users',
    timestamps: false
});

const Post = sequelize.define('Post', {             // post model
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
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING
    },
    video: {
        type: DataTypes.STRING
    },
    moderator: {
        type: DataTypes.STRING(10)      // admin ou modérateur, sinon null
    }
}, {
    tableName: 'Posts'
});

const Comment = sequelize.define('Comment', {       // Comment model
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
        type: DataTypes.TEXT,
        allowNull: false
    },
    moderator: {
        type: DataTypes.STRING(10)      // admin ou modérateur, sinon null
    }
}, {
    tableName: 'Comments'
});

const Like = sequelize.define('Like', {             // Like model
    id: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    // comment_id: {
    //     type: DataTypes.SMALLINT
    // },
    post_id: {
        type: DataTypes.SMALLINT
    },
    user_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING(10)
    },
    value: {
        type: DataTypes.TINYINT(1),
        allowNull: false
    }
},{
    tableName: 'Likes',
    timestamps: false
});

const Message = sequelize.define('Message', {       // Message model
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
    tableName: 'Messages',
    timestamps: false
});

User.hasMany(Post, {                                // Associations
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Comment, { 
    foreignKey: 'user_id',
    onDelete: 'cascade'
});
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

User.hasMany(Message, {
    foreignKey: 'sender_id',
    onDelete: 'cascade'
});
Message.belongsTo(User, {
    foreignKey: 'sender_id'
});

User.hasMany(Message, {
    foreignKey: 'receiver_id',
    onDelete: 'cascade'
});
Message.belongsTo(User, {
    foreignKey: 'receiver_id'
});

User.hasMany(Like, {
    foreignKey: 'user_id',
    onDelete: 'cascade'
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

// Comment.hasMany(Like, {
//     foreignKey: 'comment_id',
//     onDelete: 'cascade'
// });
// Like.belongsTo(Comment);

module.exports = { User, Post, Comment, Like, Message };