import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
    description: "User Add",
    name: "ReqAdminAddUser"
})

export class ReqAdminAddUserModel {

    @ApiModelProperty({
        description: "name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Anil' as any
    })
    name: string;
    @ApiModelProperty({
        description: "email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '123456' as any
    })
    password: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+91' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "city",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'new yourk' as any
    })
    city: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9990456786' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'savhjcvdsc' as any
    })
    image: string;
    @ApiModelProperty({
        description: "elite/basic",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'basic' as any
    })
    userType: string;
}

@ApiModel({
    description: "User Add",
    name: "ReqAdminUpdateUser"
})

export class ReqAdminUpdateUserModel {

    @ApiModelProperty({
        description: "name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Anil' as any
    })
    name: string;
    @ApiModelProperty({
        description: "email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+91' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "city",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'new york' as any
    })
    city: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9990456786' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'savhjcvdsc' as any
    })
    image: string;
    @ApiModelProperty({
        description: "elite/basic",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'basic' as any
    })
    userType: string;
}

export class ReqAdminFeatureProperty {
    @ApiModelProperty({
        description: "isFeatured",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: 'true/false' as any
    })
    isFeaturedProperty: boolean;

    @ApiModelProperty({
        description: "property Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongo id' as any
    })
    propertyId: string;
}