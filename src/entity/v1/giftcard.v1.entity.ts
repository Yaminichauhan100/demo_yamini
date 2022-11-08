/**
 * @file admin.v1.entity
 * @description defines v1 admin entity methods
 * @author Desk Now Dev Team
*/

import { Model } from "mongoose";

import BaseEntity from "../base.entity";
import giftcardModel from "@models/giftcard.model";
import { ENUM } from "@common";
import { Types } from "mongoose";
import { BookingV1, PayV1 } from "@entity";
import { roundOffNumbers, Slack } from "@services";

class GiftCardEntity extends BaseEntity {
    constructor(model: Model<any>) {
        super(model);
    }

    async insertGiftCard(payload: any) {
        try {
            let result = new giftcardModel(payload).save();
            return result;
        } catch (error) {
            console.error(">>>>>>>>>>>>2222", error);
            return Promise.reject(error)
        }
    }
    async validateUserAuth(userId: string, giftCardDetails: any): Promise<any> {
        try {
            if (giftCardDetails?.userId.equals(userId)) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(`error while validation giftCard`, error);
        }
    }

    async giftCardListing(params: any) {
        try {
            let pipeline = [];
            let matchCriteria: any = { $match: { $and: [] } };
            matchCriteria.$match.$and.push({
                buyerId: Types.ObjectId(params.buyerId),
                paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS
            });
            if (params.startDate) matchCriteria.$match.$and.push({ 'createdAt': { $gte: new Date(params.startDate) } })
            if (params.endDate) matchCriteria.$match.$and.push({ 'createdAt': { $lte: new Date(params.endDate) } })
            pipeline.push(matchCriteria);
            pipeline.push({ $sort: { createdAt: -1 } });
            pipeline.push({
                $project: {
                    _id: 1,
                    paymentStatus: 1,
                    amount: "$originalAmount",
                    to: 1,
                    from: 1,
                    message: 1,
                    quantity: 1,
                    giftCardNo: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    redemptionStatus: 1,
                    transactionDetails: { $ifNull: ["$transactionDetails.transactionId", ""] },
                    redemptionDate: { $cond: { if: { $eq: [{ $size: "$redemptionDate" }, 0] }, then: 0, else: 1 } }
                }
            });
            params.getCount = true;
            let details: any = await GiftV1.paginateAggregate(pipeline, params);
            return details;
        } catch (error) {
            console.error(`error while giftCardListing`, error);
            return Promise.reject(error);
        }
    }

    async userGiftCardListing(params: any) {
        try {
            let pipeline = [];
            let matchCriteria: any = { $match: { $and: [] } };
            matchCriteria.$match.$and.push({
                userId: Types.ObjectId(params.userId),
                paymentStatus: ENUM.PAYMENT.STATUS.SUCCESS
            });
            if (params.startDate) matchCriteria.$match.$and.push({ 'createdAt': { $gte: new Date(params.startDate) } })
            if (params.endDate) matchCriteria.$match.$and.push({ 'createdAt': { $lte: new Date(params.endDate) } })
            pipeline.push(matchCriteria);
            pipeline.push({
                '$lookup': {
                    from: 'users',
                    "let": { "userId": "$buyerId" },

                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$_id', "$$userId"] } },
                                ]
                            }
                        },
                        {
                            '$project': {
                                name: 1,
                                email: 1,
                            }
                        }
                    ],
                    as: 'userData'
                }
            })
            pipeline.push({ $sort: { createdAt: -1 } });
            pipeline.push({
                $project: {
                    _id: 1,
                    paymentStatus: 1,
                    remainingAmount: "$amount",
                    to: 1,
                    from: 1,
                    message: 1,
                    quantity: 1,
                    giftCardNo: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    redemptionStatus: 1,
                    transactionDetails: { $ifNull: ["$transactionDetails.transactionId", ""] },
                    redemptionDate: { $cond: { if: { $eq: [{ $size: "$redemptionDate" }, 0] }, then: 0, else: 1 } },
                    buyerDetail: { $arrayElemAt: ["$userData", 0] },
                    amount: "$originalAmount",
                    validity: 1
                }
            });
            params.getCount = true;
            let details: any = await GiftV1.paginateAggregate(pipeline, params);
            return details;
        } catch (error) {
            console.error(`we have an error in myGift card listing entity ==> ${error}`);
            throw error;
        }
    }

    async redeemGiftCard(payload: any, userId: any, giftCardDetails: any, bookingDetails: any): Promise<any> {
        try {
            switch (giftCardDetails.redemptionStatus) {
                case ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        }
                        let bookingData = await BookingV1.updateDocument({
                            _id: Types.ObjectId(bookingDetails._id)
                        }, bookingPayload, { new: true });
                        return bookingData;
                    }
                    else {
                        let bookingPayload = {
                            giftCardAmount: bookingDetails.totalPayable,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        }
                        let bookingData = await BookingV1.updateDocument({ _id: Types.ObjectId(bookingDetails._id) }, bookingPayload, { new: true });
                        return bookingData;
                    }
                }
                case ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        }
                        let bookingData = await BookingV1.updateDocument({
                            _id: Types.ObjectId(bookingDetails._id)
                        }, bookingPayload, { new: true });
                        return bookingData;
                    }
                    else {
                        let bookingPayload = {
                            giftCardAmount: bookingDetails.totalPayable,
                            giftCardId: giftCardDetails._id,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.QUEUED,
                            giftCardNo: giftCardDetails.giftCardNo
                        }
                        let bookingData = await BookingV1.updateDocument({ _id: Types.ObjectId(bookingDetails._id) }, bookingPayload, { new: true });
                        return bookingData;
                    }
                }
            }
        } catch (error) {
            console.error(`we have an error while redeeming giftCard ==> ${error}`);
            throw error;
        }
    }

    async updateGiftCardRedemption(payload: any, bookingDetails: any): Promise<any> {
        try {
            let giftCardDetails: any = await GiftV1.findOne({ _id: Types.ObjectId(bookingDetails.giftCardId) })
            switch (giftCardDetails.redemptionStatus) {
                case ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let totalPayable = bookingDetails.totalPayable - giftCardDetails.amount;
                        if (totalPayable * 1 <= 0.5) {
                            return totalPayable;
                        }
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        }
                        await Promise.all([
                            GiftV1.updateOne(
                                {
                                    _id: Types.ObjectId(giftCardDetails._id)
                                },
                                {
                                    $set: {
                                        amount: 0,
                                        redemptionStatus: ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED,
                                        userId: bookingDetails?.userData?.userId
                                    },
                                    $push: {
                                        bookingId: bookingDetails._id,
                                        redemptionDate: new Date()
                                    }

                                }),
                            BookingV1.updateDocument(
                                {
                                    _id: Types.ObjectId(bookingDetails._id)
                                }, bookingPayload)
                        ])
                        return await roundOffNumbers(totalPayable);
                    }
                    else {
                        let totalPayable = bookingDetails.totalPayable - giftCardDetails.amount < 0 ? 0 : bookingDetails.totalPayable - giftCardDetails.amount;
                        if (totalPayable * 1 <= 0.5) {
                            return totalPayable;
                        }
                        let bookingPayload = {
                            giftCardAmount: bookingDetails.totalPayable,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        }
                        await Promise.all([
                            GiftV1.updateOne(
                                {
                                    _id: Types.ObjectId(giftCardDetails._id)
                                },
                                {
                                    $set: {
                                        amount: giftCardDetails.amount - bookingDetails.totalPayable,
                                        redemptionStatus: ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED,
                                        userId: bookingDetails?.userData?.userId
                                    },
                                    $push: {
                                        bookingId: bookingDetails._id,
                                        redemptionDate: new Date()
                                    }
                                }),
                            BookingV1.updateDocument({
                                _id: Types.ObjectId(bookingDetails._id)
                            }, bookingPayload)
                        ])
                        return totalPayable;
                    }
                }
                case ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED: {
                    if (bookingDetails.totalPayable > giftCardDetails.amount) {
                        let totalPayable = bookingDetails.totalPayable - giftCardDetails.amount;
                        if (totalPayable * 1 <= 0.5) {
                            return totalPayable;
                        }
                        let bookingPayload = {
                            giftCardAmount: giftCardDetails.amount,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        }
                        await Promise.all([
                            GiftV1.updateOne(
                                {
                                    _id: Types.ObjectId(giftCardDetails._id)
                                },
                                {
                                    $set: {
                                        amount: 0,
                                        redemptionStatus: ENUM.GIFT_CARD.REDEMPTION_STATUS.FULLY_REDEEMED,
                                        userId: bookingDetails?.userData?.userId
                                    },
                                    $push: {
                                        bookingId: bookingDetails._id,
                                        redemptionDate: new Date()
                                    }
                                }),
                            BookingV1.updateDocument({
                                _id: Types.ObjectId(bookingDetails._id)
                            }, bookingPayload)
                        ])
                        return totalPayable;
                    }
                }
            }
        } catch (error) {
            console.error(`we have an error while redeeming giftCard ==> ${error}`);
            throw error;
        }
    }

    async giftCardCheckout(bookingDetail: any, giftCardDetail: any): Promise<any> {
        try {

            if (bookingDetail?.prolongedStatus === ENUM.BOOKING.PROLONGED_STATUS.PENDING
                && bookingDetail?.prolongBookingId) {
                await BookingV1.updateOne(
                    { _id: Types.ObjectId(bookingDetail?.prolongBookingId) },
                    {
                        $set: {
                            prolongedStatus: ENUM.BOOKING.PROLONGED_STATUS.SUCCESS,
                            prolongBookingId: Types.ObjectId(bookingDetail?.prolongBookingId)
                        }
                    }, {});
            }

            switch (giftCardDetail.redemptionStatus) {
                case ENUM.GIFT_CARD.REDEMPTION_STATUS.NOT_REDEEMED: {
                    if (bookingDetail.totalPayable <= giftCardDetail.amount) {
                        let bookingPayload = {
                            giftCardAmount: bookingDetail.totalPayable,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        }
                        // let [giftCardPromise, bookingPromise, checkoutPromise, slackPromise] =
                        await Promise.all([
                            GiftV1.updateOne(
                                {
                                    _id: Types.ObjectId(giftCardDetail._id)
                                },
                                {
                                    $set: {
                                        amount: giftCardDetail.amount - bookingDetail.totalPayable,
                                        redemptionStatus: ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED,
                                        userId: bookingDetail?.userData?.userId
                                    },
                                    $push: {
                                        bookingId: bookingDetail._id,
                                        redemptionDate: new Date()
                                    }
                                }),
                            BookingV1.updateDocument(
                                {
                                    _id: Types.ObjectId(bookingDetail._id)
                                }, bookingPayload),
                            PayV1.giftCardCheckout(bookingDetail, giftCardDetail),
                            Slack.postMessageToSlackUser(bookingDetail.propertyData.hostEmail, bookingDetail),
                        ])
                        return await roundOffNumbers(bookingDetail.totalPayable);
                    }
                    else return;
                }
                case ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED: {
                    if (bookingDetail.totalPayable <= giftCardDetail.amount) {
                        let bookingPayload = {
                            giftCardAmount: bookingDetail.totalPayable,
                            giftCardStatus: ENUM.BOOKING.GIFT_CARD_STATUS.APPLIED
                        }
                        await Promise.all([
                            GiftV1.updateOne(
                                {
                                    _id: Types.ObjectId(giftCardDetail._id)
                                },
                                {
                                    $set: {
                                        amount: giftCardDetail.amount - bookingDetail.totalPayable,
                                        redemptionStatus: ENUM.GIFT_CARD.REDEMPTION_STATUS.PARTIALLY_REDEEMED,
                                        userId: bookingDetail?.userData?.userId
                                    },
                                    $push: {
                                        bookingId: bookingDetail._id,
                                        redemptionDate: new Date()
                                    }
                                }),
                            BookingV1.updateDocument({
                                _id: Types.ObjectId(bookingDetail._id)
                            }, bookingPayload)
                        ])
                        return bookingDetail.totalPayable;
                    }
                }
            }
        } catch (error) {
            console.error(`we have an error while redeeming giftCard ==> ${error}`);
            throw error;
        }
    }

    async adminGiftCardListing(params: any): Promise<any> {
        try {
            let pipeline: any = []
            let filterConditions: any = { $match: { $and: [] } };
            filterConditions.$match.$and.push({ buyerId: { $exists: true } })
            if (params && params.fromDate) filterConditions.$match.$and.push({ createdAt: { $gte: new Date(params.fromDate) } })
            if (params && params.toDate) filterConditions.$match.$and.push({ createdAt: { $lte: new Date(params.toDate) } })
            if (params && params.search) filterConditions.$match.$and.push({ $or: [{ 'from': { $regex: params.search, $options: "si" } }, { 'to': { $regex: params.search, $options: "si" } }] })
            pipeline.push(filterConditions);
            pipeline.push({ $sort: { createdAt: -1 } }),
                pipeline.push({
                    '$lookup': {
                        from: 'users',
                        "let": { "userId": "$buyerId" },

                        pipeline: [
                            {
                                '$match': {
                                    $and: [
                                        { $expr: { $eq: ['$_id', "$$userId"] } },

                                    ]
                                }
                            },

                            {
                                '$project': {
                                    name: 1,
                                    email: 1,
                                }
                            }
                        ],
                        as: 'userData'
                    }
                })

            pipeline.push({
                '$lookup': {
                    from: 'booking',
                    "let": { "booking": "$bookingId" },

                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $in: ['$_id', "$$booking"] } },
                                ]
                            }
                        },

                        {
                            '$project': {
                                bookingId: 1,
                                fromDate: 1,
                                toDate: 1,
                                createdAt: 1,
                                giftCardAmount: 1,
                                totalPayable: 1,
                                basePrice: 1

                            }
                        }
                    ],
                    as: 'bookingData'
                }
            })
            pipeline.push({
                $unwind:
                {
                    path: "$userData",
                    preserveNullAndEmptyArrays: false
                }
            });
            return await GiftV1.paginateAggregate(pipeline, { getCount: true, limit: params && params.limit ? params.limit = parseInt(params.limit) : params.limit = 10, page: params.page });
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }


    async adminGiftCardDetails(params: any): Promise<any> {
        try {
            let pipeline: any = []
            let filterConditions: any = { $match: { $and: [] } };
            filterConditions.$match.$and.push({ buyerId: { $exists: true } })
            filterConditions.$match.$and.push({ '_id': Types.ObjectId(params.id) })
            pipeline.push(filterConditions);

            pipeline.push({
                '$lookup': {
                    from: 'users',
                    "let": { "userId": "$buyerId" },

                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $eq: ['$_id', "$$userId"] } },

                                ]
                            }
                        },

                        {
                            '$project': {
                                name: 1,
                                email: 1,
                            }
                        }
                    ],
                    as: 'userData'
                }
            })
            pipeline.push({
                '$lookup': {
                    from: 'booking',
                    "let": { "booking": "$bookingId" },

                    pipeline: [
                        {
                            '$match': {
                                $and: [
                                    { $expr: { $in: ['$_id', "$$booking"] } },
                                ]
                            }
                        },

                        {
                            '$project': {
                                bookingId: 1,
                                fromDate: 1,
                                toDate: 1,
                                createdAt: 1,
                                giftCardAmount: 1,
                                totalPayable: 1,
                                basePrice: 1,
                                userData: 1
                            }
                        }
                    ],
                    as: 'bookingData'
                }
            })
            pipeline.push({
                $unwind:
                {
                    path: "$userData",
                    preserveNullAndEmptyArrays: false
                }
            })
            return await GiftV1.basicAggregate(pipeline);
        } catch (error) {
            console.error(`we have an error ==> ${error}`);
            return Promise.reject(error)
        }
    }
}

export const GiftV1 = new GiftCardEntity(giftcardModel);