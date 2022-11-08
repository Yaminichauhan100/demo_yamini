import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "City Add",
    name: "ReqAddCity"
})

export class ReqAddCityModel {

    @ApiModelProperty({
        description: "countryId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 101 as any
    })
    countryId: number

    @ApiModelProperty({
        description: "stateId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 38 as any
    })
    stateId: number

    @ApiModelProperty({
        description: "cityName",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Noida' as any
    })
    cityName: string;

    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg' as any
    })
    iconImage: string;

    @ApiModelProperty({
        description: "isFeatured",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "true/false" as any
    })
    isFeatured: boolean;

    @ApiModelProperty({
        description: "zipCodes",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            '201301'
        ] as any
    })
    zipCodes: Array<String>;
   
}

@ApiModel({
    description: "City Add",
    name: "ReqUpdateCity"
})

export class ReqUpdateCityModel {

    @ApiModelProperty({
        description: "id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '' as any
    })
    id: string

    @ApiModelProperty({
        description: "countryId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 101 as any
    })
    countryId: number

    @ApiModelProperty({
        description: "stateId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 38 as any
    })
    stateId: number

    @ApiModelProperty({
        description: "cityName",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Noida' as any
    })
    cityName: string;

    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg' as any
    })
    iconImage: string;

    @ApiModelProperty({
        description: "isFeatured",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "true/false" as any
    })
    isFeatured: boolean;

    @ApiModelProperty({
        description: "zipCodes",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            '201301'
        ] as any
    })
    zipCodes: Array<String>;
   
}

