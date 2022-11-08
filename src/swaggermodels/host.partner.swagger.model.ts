import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
@ApiModel({
    description: "Add Partner",
    name: "ReqAddPartnerDetail"
})

export class ReqAddPartnerDetail {

    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    name: string;
    @ApiModelProperty({
        description: "floor number completely assigned to partner",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [1, 2] as any
    })
    partnerFloors: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "lane of partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9ce' as any
    })
    lane1: string;
    @ApiModelProperty({
        description: "lane2 of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    lane2: string;
    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;
    @ApiModelProperty({
        description: "Image",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'xxx@yopmail.com' as any
    })
    email: string;
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
        example: "5e9585a4ba58cf276f66ddfa" as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa" as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: [{
            spaceId: "mongoid"
        }] as any
    })
    floorDetails: object
}


@ApiModel({
    description: "Update Partner",
    name: "ReqUpdatePartnerDetail"
})

export class ReqUpdatePartnerDetail {

    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    name: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "lane of partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9ce' as any
    })
    lane1: string;
    @ApiModelProperty({
        description: "lane2 of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    lane2: string;
    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;
    @ApiModelProperty({
        description: "Image",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'partner mongo id' as any
    })
    partnerId: string;
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
        example: "5e9585a4ba58cf276f66ddfa" as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e9585a4ba58cf276f66ddfa" as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "floorDetails",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: [{
            spaceId: "mongoid",
            employeeUnits: 2
        }] as any
    })
    floorDetails: object
    @ApiModelProperty({
        description: "floor number completely assigned to partner",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [1, 2] as any
    })
    partnerFloors: string;
}


@ApiModel({
    description: "Update Partner",
    name: "ReqAddEmployeeDetail"
})

export class ReqAddEmployeeDetail {

    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    name: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "Name of Partner",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'SuperTech' as any
    })
    email: string;
    @ApiModelProperty({
        description: "Image",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'partner mongo id' as any
    })
    partnerId: string;

}


@ApiModel({
    description: "Add Property",
    name: "ReqPartnerStatus"
})

export class ReqPartnerStatus {

    @ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'property space Id' as any
    })
    partnerId: string;
    @ApiModelProperty({
        description: "type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'active/inactive' as any
    })
    type: string;
}


@ApiModel({
    description: "Add Property",
    name: "ReqEmployeeStatus"
})

export class ReqEmployeeStatus {

    @ApiModelProperty({
        description: "Property space Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'property space Id' as any
    })
    employeeId: string;
    @ApiModelProperty({
        description: "type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'active/inactive' as any
    })
    type: string;
}