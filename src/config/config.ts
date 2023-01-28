import 'dotenv/config';

export const config = {
  databaseUrl: process.env.DATABASE_UR!,
  jwtSecret: process.env.JWT_SECRET!,
  redisHost: process.env.REDIS_HOST!,
  redisPort: process.env.REDIS_PORT!,
  joiOptions: {
    errors: {
      wrap: { label: '' },
    },
    abortEarly: true,
  },
};

export const expressSessionOptions = {
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
};