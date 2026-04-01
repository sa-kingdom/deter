import {Sequelize, DataTypes, Model} from 'sequelize';

const config = useRuntimeConfig();

export const sequelize = new Sequelize(
    config.database.name,
    config.database.user,
    config.database.pass,
    {
      dialect: 'mysql',
      host: config.database.host,
      port: Number(config.database.port),
      logging: config.database.logging,
    },
);

export class User extends Model {
  declare id: string;
  declare username: string;
  declare displayName: string;
  declare avatarHash: string | null;
}

User.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      username: DataTypes.STRING,
      displayName: DataTypes.STRING,
      avatarHash: DataTypes.STRING,
    },
    {sequelize, modelName: 'user'},
);

export class Discussion extends Model {
  declare id: string;
  declare name: string;
  declare userId: string;
  declare lastMessageId: string | null;
  declare messageCount: number;
  declare memberCount: number;
  declare posts?: Post[];
}

Discussion.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      name: DataTypes.STRING,
      lastMessageId: DataTypes.STRING,
      messageCount: DataTypes.INTEGER,
      memberCount: DataTypes.INTEGER,
    },
    {sequelize, modelName: 'discussion', paranoid: true},
);

export class Post extends Model {
  declare id: string;
  declare content: string;
  declare userId: string;
  declare discussionId: string;
}

Post.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      content: DataTypes.TEXT,
    },
    {sequelize, modelName: 'post', paranoid: true},
);

export class Media extends Model {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare contentType: string | null;
  declare size: number;
  declare url: string | null;
  declare proxyUrl: string | null;
  declare height: number | null;
  declare width: number | null;
  declare ephemeral: boolean | null;
  declare duration: number | null;
  declare waveform: string | null;
}

Media.init(
    {
      id: {type: DataTypes.STRING, primaryKey: true},
      name: DataTypes.TEXT,
      description: DataTypes.TEXT,
      contentType: DataTypes.STRING,
      size: DataTypes.INTEGER,
      url: DataTypes.TEXT,
      proxyUrl: DataTypes.TEXT,
      height: DataTypes.INTEGER,
      width: DataTypes.INTEGER,
      ephemeral: DataTypes.BOOLEAN,
      duration: DataTypes.FLOAT,
      waveform: DataTypes.TEXT,
    },
    {sequelize, modelName: 'media'},
);

// Define associations
Discussion.belongsTo(User);
Discussion.hasMany(Post);

Post.belongsTo(User);
Post.belongsTo(Discussion);
Post.belongsToMany(Media, {through: 'PostMedia'});
Media.belongsToMany(Post, {through: 'PostMedia'});

// Initialize connection
sequelize.authenticate().catch(
    (e) => console.error('DB Connection config error:', e),
);
