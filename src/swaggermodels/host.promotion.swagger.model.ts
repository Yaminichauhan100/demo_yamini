import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
    description: " Add",
    name: "ReqAddPromotionModel"
})

export class ReqAddPromotionModel {
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "mongo id" as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "CategoryId",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: "mongo id" as any
    })
    categoryId: string;
    @ApiModelProperty({
        description: "subCategoryId",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: "mongo id" as any
    })
    subCategoryId: string;
    @ApiModelProperty({
        description: "countryId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "mongo id" as any
    })
    countryId: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "mongo id" as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "Number",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 10 as any
    })
    duration: number;
    @ApiModelProperty({
        description: "slotType",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    slotType: number;
    @ApiModelProperty({
        description: "price",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 2000 as any
    })
    price: number;
    @ApiModelProperty({
        description: "taxPercentage",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 16 as any
    })
    taxPercentage: number;
    @ApiModelProperty({
        description: "dailyPrice",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 16 as any
    })
    dailyPrice: 100;
    @ApiModelProperty({
        description: "tax",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 160 as any
    })
    tax: number;
    @ApiModelProperty({
        description: "totalPrice",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 2500 as any
    })
    totalPrice: number;
    @ApiModelProperty({
        description: "listingType",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    listingType: number;
    @ApiModelProperty({
        description: "promoId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongoid' as any
    })
    promoId: string;
}