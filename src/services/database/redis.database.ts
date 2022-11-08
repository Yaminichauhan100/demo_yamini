import redis from 'redis';
import { CONFIG, DATABASE, SYS_ERR } from '@common';
import { promisify } from "util";
import { getBucket, logger } from '@services';

class Redis {
    public client: redis.RedisClient;
    constructor() {

    }
    async connectRedisDB() {
        try {
            let options: redis.ClientOpts = {};
            if (CONFIG.NODE_ENV !== "prod") {
                options['db'] = CONFIG.REDIS_INDEX;
                options['host'] = CONFIG.REDIS_HOST;
                options['port'] = CONFIG.REDIS_PORT;
                this.client = redis.createClient(options);
                this.client.select(CONFIG.REDIS_INDEX);
                this.client.config('set', 'notify-keyspace-events', 'AKE');
            }
            options['host'] = CONFIG.REDIS_HOST;
            options['port'] = CONFIG.REDIS_PORT;
            this.client = redis.createClient(options);
            console.table(options);
        } catch (error) {
            console.error(`Error in connecting to redis ==> ${error}`);
            process.exit(SYS_ERR.REDIS_CONN_FAILED);
        }
    }
    /**
     * sets the key into redis
     * @param key
     * @param value
     */
    async setKey(key: string, value: string) {
        return new Promise((res, rej) => {
            this.client.set(key, value, (err, reply) => {
                if (err) rej(err);
                else res(reply);
            });
        });
    }
    /**
     * @description method to insert key value in redis
     * @param key {string}
     * @param value {number} 
     */
    async insertKeyInRedis(key: string, value: string | number) {
        try {
            let set = promisify(this.client.set).bind(this.client);
            await set(key, value);
            logger(`data inserted ==> ${key}`);
            return {};
        } catch (error) {
            console.error(`we have an error while inserting key and value ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
        * @description method to get key value in redis
        * @param key {string}
        * @param value {number} 
        */
    async getKeyFromRedis(key: string) {
        try {
            let get = promisify(this.client.get).bind(this.client);
            let data = await get(key);
            logger(`data found ==> ${data}`);
            return data;
        } catch (error) {
            console.error(`we have an error while getting key and value ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
     * @description method to decrement key value in redis
     * @param key {string}
     */
    async decrementKeyInRedis(key: string) {
        try {
            let decrement = promisify(this.client.decr).bind(this.client);
            let value = await decrement(key);
            logger(`keys value decremented ==> ${key}`);
            return value;
        } catch (error) {
            console.error(`we have an error while decrementing a key ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
    * @description method to expire a key from redis after a set time in seconds
    * @param key 
    * @param expireTime in seconds
    */
    async expireKey(key: string, expireTime: number) {
        try {
            let expire = promisify(this.client.expire).bind(this.client);
            let data = await expire(key, expireTime);
            logger(data, "expiration status");
            return {};
        }
        catch (error) {
            console.error(`we have an error in expire key method ==> ${error}`);
            return Promise.reject(error)
        }
    }
    /**
         * @description method to insert key value in redis
         * @param key {string}
         * @param value {number} 
         */
    async getTTL(key: string) {
        try {
            let TTL = promisify(this.client.ttl).bind(this.client);
            console.log("key name", key)
            let ttl = await TTL(key);
            return ttl;
        } catch (error) {
            console.error(`we have an error while incrementing a key ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
    * @description To save an object in redis hashmap
    * @param key name of redis hash
    * @param field  name of key in redis hash 
    * @param value value to be saved against a field
    */
    async insertKeyInRedisHash(key: string, field: string, value: any) {
        try {
            let hmset = promisify(this.client.hmset).bind(this.client);
            await hmset(key, field, value);
            return {};
        }
        catch (error) {
            console.error(`we have an error while saving object in redis ==> ${error}`)
            return Promise.reject(error);
        }
    }

    /**
 * @description To get  a particular value corresponding to a key in redis hash 
 * @param key   name of redis hash
 * @param field  name of key stored in a redis hash   
 */

    async getKeyFromRedisHash(key: string, field: string) {
        try {
            let hget = promisify(this.client.hget).bind(this.client)
            return await hget(key, field)
        }
        catch (error) {

            return Promise.reject(error)
        }
    }

    /**
     * @description To update userData object in redis hash
     * @param userData 
     */
    async updateUserDataInRedis(userData: any) {
        try {
            let dataToSaveInRedis = {
                'userId': userData._id,
                'sessionId': userData.sessionId,
                'deviceId': userData.deviceDetails && userData.deviceDetails.deviceId ? userData.deviceDetails.deviceId : "",
                'fullName': userData.fullName,
                'fullPhoneNo': userData.phoneNo ? `${userData.countryCode}${userData.phoneNo}` : "",
                'phoneNo': userData.phoneNo ? userData.phoneNo : "",
                'email': userData.email ? userData.email : "",
                'profilePicture': userData.profilePicture ? userData.profilePicture : "",
                'deviceToken': userData.deviceDetails && userData.deviceDetails.deviceToken ? userData.deviceDetails.deviceToken : '0'
            }
            let hashBucket = getBucket(userData._id.toString());
            logger(`${hashBucket}, bucketData, ${DATABASE.REDIS.KEY_NAMES.DEVICE_TOKEN_HASH}:${hashBucket}`);
            return await this.insertKeyInRedisHash(`${DATABASE.REDIS.KEY_NAMES.DEVICE_TOKEN_HASH}:${hashBucket}`, userData.sessionId.toString(), JSON.stringify(dataToSaveInRedis));
        }
        catch (error) {
            console.error(`we have an error while updating user data in redis ==> ${error}`);
            return Promise.reject(error);
        }
    }
    /**
     * gets the value of key from redis
     * @param key
     */
    async getFromKey(key: string): Promise<any> {
        return new Promise((res, rej) => {
            this.client.get(key, (err, reply) => {
                if (err) rej(err);
                else res(reply);
            });
        });
    }

    /**
     * deletes the key from redis
     * @param key
     */
    async deleteKey(key: string): Promise<any> {
        return new Promise((res, rej) => {
            this.client.del(key, (err, reply) => {
                if (err) rej(err);
                else res(reply);
            });
        });
    }

    /**
     * 
     */
    async getIndentity(key: string) {
        try {
            let updatedIndentity = (parseInt(await this.getFromKey(key)) + 1).toString()
            this.setKey(key, updatedIndentity);
            return updatedIndentity;
        } catch (error) {
            return Promise.reject(error);
        }
    }


    async lPushInRedis(key: string, element: string, prefix: string) {
        try {
            this
            let promise1 = promisify(this.client.lpush).bind(this.client)
            await promise1(key.toString() + prefix, element);
            return {}
        } catch (error) {
            return Promise.reject(error)
        }
    }

    async deleteListInRedis(key: string) {
        try {
            let promise1 = promisify(this.client.del).bind(this.client)
            await promise1(key.toString());
            return {}
        } catch (error) {
            return Promise.reject(error)
        }
    }



    /**
     * user socket id set and get operations
     * @param op - type of operation `SET` | `GET`
     * @param userId - id of the user
     * @param socketId - id of the socket connection
    */
    async userSocketOp(op: 'SET' | 'GET' | 'DEL', userId: string, socketId?: string) {
        switch (op) {
            case 'SET': {
                if (socketId) this.setKey(`SOC_${userId}`, socketId);
                else throw Error('REDIS_ERR: No socketId specified in userSocketId - set operation');
                break;
            }
            case 'GET': return this.getFromKey(`SOC_${userId}`);
            case 'DEL': return this.deleteKey(`SOC_${userId}`);
        }
    }
}

export const redisDOA = new Redis();