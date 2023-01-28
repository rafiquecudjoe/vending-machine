import { createClient, RedisClientType } from 'redis';
import { config } from '../config/config';
import logger from '../utils/logger';

const redis: RedisClientType = createClient({
  url: `redis://${config.redisHost}:${config.redisPort}`,
});

(async () => {
  redis.on('error', async (err) => {
    logger.error(`Redis Client Error: ${err}`);
  });

  await redis.connect();

  logger.info(`Redis cluster CONNECTED`);
})();

export default redis;
