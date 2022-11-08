import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
import { String } from "aws-sdk/clients/acm";




@ApiModel({
    description: "Host Property space",
    name: "ReqAddPropertySpace"
})

export class ReqAddPropertySpaceModel {

    @ApiModelProperty({
        description: "0 or 1",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    isOfferPrice: number;

    @ApiModelProperty({
        description: "capacity",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    capacity: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    units: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    dailyPrice: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    monthlyPrice: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    yearlyPrice: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    hourlyPrice: number;
    @ApiModelProperty({
        description: "array of subCategoryIds",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    subCategoryId: string;
    @ApiModelProperty({
        description: "array of categoryIds",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    categoryId: string;
    @ApiModelProperty({
        description: "spaceId",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "1234" as any
    })
    spaceId: string;
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "documents of company",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    images: Array<String>;
    @ApiModelProperty({
        description: "documents of company",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'add coffee machine'
        ] as any
    })
    include: Array<String>;

    @ApiModelProperty({
        description: "offer pricing",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [{
            seasonName: 'Season 1',
            startDate: '2020-04-22T01:20:52.073+05:30',
            endDate: '2020-04-22T01:20:52.073+05:30',
            priceDetails: [
                {
                    discountLabelType: 'ENUM PROVIDED FOR THIS',
                    days: 0,
                    months: 1,
                    discountPercentage: 20,
                    minUnits: 0,
                    maxUnits: 0
                }
            ]
        }] as any
    })
    offerPrice: Array<Object>;
}


@ApiModel({
    description: "Host Property space",
    name: "ReqUpdatePropertySpace"
})

export class ReqUpdatePropertySpaceModel {
    @ApiModelProperty({
        description: "id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    id: string;
    @ApiModelProperty({
        description: "0 or 1",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    isOfferPrice: number;

    @ApiModelProperty({
        description: "capacity",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    capacity: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    units: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    dailyPrice: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    monthlyPrice: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    yearlyPrice: number;
    @ApiModelProperty({
        description: "units",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    hourlyPrice: number;
    @ApiModelProperty({
        description: "array of subCategoryIds",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    subCategoryId: string;
    @ApiModelProperty({
        description: "array of categoryIds",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    categoryId: string;
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e8b27c54e91350fe6ae69da" as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    images: Array<String>;
    @ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'add coffee machine'
        ] as any
    })
    include: Array<String>;

    @ApiModelProperty({
        description: "offer pricing",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [{
            seasonName: 'Season 1',
            startDate: '2020-04-22T01:20:52.073+05:30',
            endDate: '2020-04-22T01:20:52.073+05:30',
            priceDetails: [{
                discountLabelType: 'Discounts for booking duration',
                maxLabel: 'Min day',
                min: 0,
                minLabel: 'Min day',
                max: 0,
                discountLabel: 'Discount',
                discount: 0
            }]
        }] as any
    })
    offerPrice: Array<Object>;
}


@ApiModel({
    description: "Add Property",
    name: "ReqAddHostPropertyDetail"
})

export class ReqAddHostPropertyDetailModel {

    @ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    name: string;

    @ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    termsAndCond: string;

    @ApiModelProperty({
        description: "addressPrimary of Property i.e address line 1",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9c' as any
    })
    addressPrimary: string;

    @ApiModelProperty({
        description: "addressSecondary of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    addressSecondary: string;

    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;

    @ApiModelProperty({
        description: "images of property",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    images: Array<String>;

    @ApiModelProperty({
        description: "add tags",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'abcd'
        ] as any
    })
    tags: Array<String>;

    @ApiModelProperty({
        description: "heading",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '2bhk' as any
    })
    heading: string;

    @ApiModelProperty({
        description: "description og the property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'It is a well furnishek 2bhk property' as any
    })
    description: string;

    @ApiModelProperty({
        description: "floor",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 2 as any
    })
    floor: number;

    @ApiModelProperty({
        description: "built up area",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 150 as any
    })
    builtUpArea: number;

    @ApiModelProperty({
        description: "upcoming booking",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "true/false" as any
    })
    autoAcceptUpcomingBooking: boolean;

    @ApiModelProperty({
        description: "images of property",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: ["5e8d93806a853d3506f7cf09"] as any
    })
    amenities: Array<String>;

    @ApiModelProperty({
        description: "address",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Noida' as any
    })
    address: number;

    @ApiModelProperty({
        description: "state id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 35 as any
    })
    stateId: number;

    @ApiModelProperty({
        description: "country Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 101 as any
    })
    countryId: number;

    @ApiModelProperty({
        description: "starting price",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 15000 as any
    })
    startingPrice: number;

    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa" as any
    })
    cityId: string;

    @ApiModelProperty({
        description: "location",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: { coordinates: [28.5355, 77.3910] } as any
    })
    location: object
}

@ApiModel({
    description: "Add Property",
    name: "ReqUpdateHostPropertyDetail"
})

export class ReqUpdateHostPropertyDetailModel {

    @ApiModelProperty({
        description: "Property Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'propertyId' as any
    })
    id: string;
    @ApiModelProperty({
        description: "Property Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'propertyId' as any
    })
    termsAndCond: string;
    @ApiModelProperty({
        description: "add tags",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'abcd'
        ] as any
    })
    tags: Array<String>;
    @ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    name: string;
    @ApiModelProperty({
        description: "house no of Property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9c' as any
    })
    houseNo: string;
    @ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    street: string;
    @ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters' as any
    })
    landmark: string;
    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;
    @ApiModelProperty({
        description: "images of property",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    images: Array<String>;
    @ApiModelProperty({
        description: "heading",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '2bhk' as any
    })
    heading: string;
    @ApiModelProperty({
        description: "description og the property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'It is a well furnishek 2bhk property' as any
    })
    description: string;
    @ApiModelProperty({
        description: "floor",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 2 as any
    })
    floor: number;
    @ApiModelProperty({
        description: "built up area",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 150 as any
    })
    builtUpArea: number;
    @ApiModelProperty({
        description: "upcoming booking",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "true/false" as any
    })
    autoAcceptUpcomingBooking: boolean;
    @ApiModelProperty({
        description: "images of property",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: ["5e8d93806a853d3506f7cf09"] as any
    })
    amenities: Array<String>;
    @ApiModelProperty({
        description: "address",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Noida' as any
    })
    address: String;
    @ApiModelProperty({
        description: "state id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 35 as any
    })
    stateId: number;
    @ApiModelProperty({
        description: "country Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 101 as any
    })
    countryId: number;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a" as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "location",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: { coordinates: [28.5355, 77.3910] } as any
    })
    location: object
}
@ApiModel({
    description: "Host Property space",
    name: "ReqAddRecentCity"
})

export class ReqAddRecentCity {
    @ApiModelProperty({
        description: "user id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    userId: string;
    @ApiModelProperty({
        description: "city name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    cityName: string;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    cityId: string
}


@ApiModel({
    description: "Add Property",
    name: "ReqPropertyStatus"
})

export class ReqPropertyStatus {

    @ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'property space Id' as any
    })
    id: string;
    @ApiModelProperty({
        description: "type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'active/inactive/archive' as any
    })
    type: string;
}


export class ReqCancelSpaceBookingHostModel {
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;

    @ApiModelProperty({
        description: "description",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    description: string

    @ApiModelProperty({
        description: "reason",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    reason: string
}
export class ReqBookingStatus {

    @ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'property space Id' as any
    })
    id: string;
    @ApiModelProperty({
        description: "type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '0/1' as any
    })
    type: string;
}

@ApiModel({
    description: "Change user password",
    name: "ChangeStatusModel"
})
export class ChangeStatusModel {
    @ApiModelProperty({
        description: "oldPassword",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "newPassword",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    autoAcceptUpcomingBooking: boolean;
}

export class AddHolidayModel {
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'propertyId' as any
    })
    propertyId: string;

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'name' as any
    })
    name: string;
    @ApiModelProperty({
        description: "toDate",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'toDate' as any
    })
    toDate: string;

    @ApiModelProperty({
        description: "fromDate",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'fromDate' as any
    })
    fromDate: string;
}

export class UpdateHolidayModel {
    @ApiModelProperty({
        description: "id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'id' as any
    })
    id: string;

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'name' as any
    })
    name: string;
    @ApiModelProperty({
        description: "toDate",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'toDate' as any
    })
    toDate: string;

    @ApiModelProperty({
        description: "fromDate",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'fromDate' as any
    })
    fromDate: string;
}

export class UpdateAutoAcceptPropertyModel {
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'id' as any
    })
    propertyId: string;

    @ApiModelProperty({
        description: "true/false",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'name' as any
    })
    autoAcceptUpcomingBooking: boolean;
}

@ApiModel({
    description: "FAQ ADD",
    name: "ReqAddHostTAndCModel"
})

export class ReqAddHostTAndCModel {

    @ApiModelProperty({
        description: "type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1,2,3' as any
    })
    type: number;
    @ApiModelProperty({
        description: "answer",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: 'HTML CONTENT OBJECT' as any
    })
    content: object;
    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'EN' as any
    })
    propertyId: string;
}

@ApiModel({
    description: "Add Property",
    name: "ReqValidateEmplyoeeModel"
})

export class ReqValidateEmplyoeeModel {

    @ApiModelProperty({
        description: "floorDetail",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            spaceId: "mongoId"
        } as any
    })
    spaceId: string
}

@ApiModel({
    description: "Add Property",
    name: "ReqValidateFloorModel"
})

export class ReqValidateFloorModel {

    @ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: [{
            units: {
                hourly: "Number",
                monthly: "Number",
                custom: "Number",
                employee: "Number",
            },
            floorId: "mongoId"
        }] as any
    })
    floorDetails: object
}

@ApiModel({
    description: "Add Property",
    name: "ReqAddPropertyDetailModel"
})

export class ReqAddPropertyDetailModel {

    @ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    name: string;

    @ApiModelProperty({
        description: "Name of Property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    termsAndCond: string;

    @ApiModelProperty({
        description: "addressPrimary of Property i.e address line 1",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9c' as any
    })
    addressPrimary: string;

    @ApiModelProperty({
        description: "addressSecondary of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    addressSecondary: string;

    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;

    @ApiModelProperty({
        description: "images of property",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    images: Array<String>;

    @ApiModelProperty({
        description: "heading",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '2bhk' as any
    })
    heading: string;

    @ApiModelProperty({
        description: "description og the property",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'It is a well furnishek 2bhk property' as any
    })
    description: string;


    @ApiModelProperty({
        description: "upcoming booking",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "true/false" as any
    })
    autoAcceptUpcomingBooking: boolean;

    @ApiModelProperty({
        description: "amentites",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            name: "string",
            iconImage: "string",
            amenityId: "_id",
            status: "string",
            type: "string",
            isFeatured: "number",
        } as any
    })
    amenities: object;

    @ApiModelProperty({
        description: "address",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Noida' as any
    })
    address: number;

    @ApiModelProperty({
        description: "address",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 'number' as any
    })
    propertyType: number;

    @ApiModelProperty({
        description: "state ",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            name: "string",
            _id: "_id",
            id: "number",
        } as any
    })
    state: object;

    @ApiModelProperty({
        description: "country Id",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            name: "string",
            sortname: "string",
            tax: "number",
            _id: "_id",
            id: "number",
        } as any
    })
    country: object;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            cityName: "string",
            iconImage: "string",
            isFeatured: "boolean",
            _id: "_id"
        } as any
    })
    city: object;

    @ApiModelProperty({
        description: "location",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: { coordinates: [28.5355, 77.3910] } as any
    })
    location: object

    @ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: [{
            subCategoryId: "_id",
            categoryId: "_id",
            floorNumber: "Number",
            capacity: "Number",
            units: {
                hourly: "Number",
                monthly: "Number",
                custom: "Number",
                employee: "Number",
            },
            dailyPrice: "Number",
            monthlyPrice: "Number",
            hourlyPrice: "Number",
            offerPrice: [{
                selectedMaxValue: "Number",
                selectedMinValue: "Number",
                seasonName: "string",
                startDate: "Date",
                endDate: "Date",
                priceDetails: [{
                    discountLabelType: "Number",
                    months: "Number",
                    days: "Number",
                    discountPercentage: "Number",
                    minUnits: "Number",
                    maxUnits: "Number",
                }],
                priceRange: {
                    dailyPrice: {
                        min: "Number",
                        max: "Number",
                    },
                    monthlyPrice: {
                        min: "Number",
                        max: "Number",
                    },
                    yearlyPrice: {
                        min: "Number",
                        max: "Number",
                    }
                }
            }],
            isOfferPrice: "Number"
        }] as any
    })
    floorDetails: object
}