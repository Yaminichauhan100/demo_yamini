import redis from 'redis';
import { CONFIG, ENUM } from '@common';
import { BookingV1, PromotionV1, UserV1 } from '@entity';
import { Types } from 'mongoose';
import { PaymentController } from '@controllers';

const options: any = {}
options['db'] = CONFIG.REDIS_INDEX;
options['host'] = CONFIG.REDIS_HOST;
options['port'] = CONFIG.REDIS_PORT;

const sub = redis.createClient(options);

/**
 * @description function to subscribe to a channel
 * @param channel name of channel to be subscribed
 */

export const subscribe = async (channel: string) => {
    try {
        sub.subscribe(channel);
        console.log(`subscribed to channel ===> ${channel}`);
        return {};
    }
    catch (error) {
        console.log("Error while subscribing to a channel", error);
        return {}
    }
}

/**
 * @description event to get subscribed message
 */
sub.on('message', async (channel: string, message: any): Promise<void> => {
    try {
        const subscriptionKey = message.split("_")[0];
        const redisKeyId = message.split("_")[1];
        switch (subscriptionKey) {
            case ENUM.REDIS.PENDING_BOOKING:
                await Promise.all(
                    [
                        BookingV1.updateOne(
                            {
                                _id: Types.ObjectId(redisKeyId),
                                bookingStatus: ENUM.BOOKING.STATUS.PENDING
                            },
                            { $set: { bookingStatus: ENUM.BOOKING.STATUS.REJECTED } }),
                        PaymentController.refund(redisKeyId, {}),
                        UserV1.sendAutoRejectPush(redisKeyId)
                    ]
                )
                break;
            case (ENUM.PROPERTY.PROMOTION_FLAG.START).toString():
                PromotionV1.startPromotion(redisKeyId);
                break;
            case (ENUM.PROPERTY.PROMOTION_FLAG.END).toString():
                PromotionV1.endPromotion(redisKeyId);
                break;
        }
    }
    catch (error) {
        console.error("error while listening to channel", error);
    }
})