import {Sequelize, DataTypes, Model} from 'sequelize';
import * as mysql2 from 'mysql2';

const config = useRuntimeConfig();

export const legacySequelize = new Sequelize(
    config.legacyDatabase.name,
    config.legacyDatabase.user,
    config.legacyDatabase.pass,
    {
      dialect: 'mysql',
      dialectModule: mysql2,
      host: config.legacyDatabase.host,
      port: Number(config.legacyDatabase.port),
      logging: config.legacyDatabase.logging,
    },
);

export class FlarumUser extends Model {
  declare id: number;
  declare username: string;
  declare avatarUrl: string | null;
}

FlarumUser.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: DataTypes.STRING,
      avatarUrl: {type: DataTypes.STRING, field: 'avatar_url'},
    },
    {
      sequelize: legacySequelize,
      tableName: 'users',
      modelName: 'flarum_user',
      timestamps: false,
    },
);

export class FlarumDiscussion extends Model {
  declare id: number;
  declare title: string;
  declare commentCount: number;
  declare participantCount: number;
  declare postNumberIndex: number;
  declare createdAt: Date;
  declare userId: number | null;
  declare firstPostId: number | null;
  declare lastPostedAt: Date | null;
  declare lastPostedUserId: number | null;
  declare lastPostId: number | null;
  declare lastPostNumber: number | null;
  declare hiddenAt: Date | null;
  declare slug: string;
  declare isPrivate: boolean;
  declare isApproved: boolean;
  declare isLocked: boolean;
  declare isSticky: boolean;
  declare user?: FlarumUser;
  declare posts?: FlarumPost[];
  declare tags?: FlarumTag[];
}

FlarumDiscussion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      commentCount: {type: DataTypes.INTEGER, field: 'comment_count'},
      participantCount: {
        type: DataTypes.INTEGER,
        field: 'participant_count',
      },
      postNumberIndex: {
        type: DataTypes.INTEGER,
        field: 'post_number_index',
      },
      createdAt: {type: DataTypes.DATE, field: 'created_at'},
      userId: {type: DataTypes.INTEGER, field: 'user_id'},
      firstPostId: {
        type: DataTypes.INTEGER,
        field: 'first_post_id',
      },
      lastPostedAt: {type: DataTypes.DATE, field: 'last_posted_at'},
      lastPostedUserId: {
        type: DataTypes.INTEGER,
        field: 'last_posted_user_id',
      },
      lastPostId: {type: DataTypes.INTEGER, field: 'last_post_id'},
      lastPostNumber: {
        type: DataTypes.INTEGER,
        field: 'last_post_number',
      },
      hiddenAt: {type: DataTypes.DATE, field: 'hidden_at'},
      slug: DataTypes.STRING,
      isPrivate: {type: DataTypes.BOOLEAN, field: 'is_private'},
      isApproved: {type: DataTypes.BOOLEAN, field: 'is_approved'},
      isLocked: {type: DataTypes.BOOLEAN, field: 'is_locked'},
      isSticky: {type: DataTypes.BOOLEAN, field: 'is_sticky'},
    },
    {
      sequelize: legacySequelize,
      tableName: 'discussions',
      modelName: 'flarum_discussion',
      timestamps: false,
    },
);

export class FlarumPost extends Model {
  declare id: number;
  declare discussionId: number;
  declare number: number | null;
  declare createdAt: Date;
  declare userId: number | null;
  declare type: string | null;
  declare content: string | null;
  declare editedAt: Date | null;
  declare hiddenAt: Date | null;
  declare isPrivate: boolean;
  declare isApproved: boolean;
  declare user?: FlarumUser;
}

FlarumPost.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      discussionId: {
        type: DataTypes.INTEGER,
        field: 'discussion_id',
      },
      number: DataTypes.INTEGER,
      createdAt: {type: DataTypes.DATE, field: 'created_at'},
      userId: {type: DataTypes.INTEGER, field: 'user_id'},
      type: DataTypes.STRING,
      content: DataTypes.TEXT,
      editedAt: {type: DataTypes.DATE, field: 'edited_at'},
      hiddenAt: {type: DataTypes.DATE, field: 'hidden_at'},
      isPrivate: {type: DataTypes.BOOLEAN, field: 'is_private'},
      isApproved: {type: DataTypes.BOOLEAN, field: 'is_approved'},
    },
    {
      sequelize: legacySequelize,
      tableName: 'posts',
      modelName: 'flarum_post',
      timestamps: false,
    },
);

export class FlarumTag extends Model {
  declare id: number;
  declare name: string;
  declare slug: string;
  declare description: string | null;
  declare color: string | null;
  declare icon: string | null;
}

FlarumTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      description: DataTypes.TEXT,
      color: DataTypes.STRING,
      icon: DataTypes.STRING,
    },
    {
      sequelize: legacySequelize,
      tableName: 'tags',
      modelName: 'flarum_tag',
      timestamps: false,
    },
);

// Define associations
FlarumDiscussion.belongsTo(FlarumUser, {foreignKey: 'userId', as: 'user'});
FlarumDiscussion.hasMany(FlarumPost, {
  foreignKey: 'discussionId',
  as: 'posts',
});
FlarumPost.belongsTo(FlarumUser, {foreignKey: 'userId', as: 'user'});
FlarumPost.belongsTo(FlarumDiscussion, {
  foreignKey: 'discussionId',
  as: 'discussion',
});
FlarumDiscussion.belongsToMany(FlarumTag, {
  through: 'discussion_tag',
  foreignKey: 'discussion_id',
  otherKey: 'tag_id',
  timestamps: false,
  as: 'tags',
});

// Initialize connection
legacySequelize.authenticate().catch(
    (e) => console.error('Legacy DB Connection config error:', e),
);
