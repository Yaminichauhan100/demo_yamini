import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";


@ApiModel({
    description: "FAQ ADD",
    name: "ReqAddPriceModel"
})

export class ReqAddPriceModel {

    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cityId' as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cityId' as any
    })
    countryId: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cityId' as any
    })
    stateId: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cityId' as any
    })
    categoryId: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cityId' as any
    })
    subCategoryId: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            1: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            2: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            3: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
        } as any
    })
    slotType: object;


    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 50 as any
    })
    listingPlacement: number;
}

@ApiModel({
    description: "FAQ ADD",
    name: "ReqUpdatePriceModel"
})

export class ReqUpdatePriceModel {

    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'id' as any
    })
    id: string;
    @ApiModelProperty({
        description: "cityId",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            1: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            2: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
            3: {
                daily: 100,
                weekly: 100,
                monthly: 100
            },
        } as any
    })
    slotType: object;
}