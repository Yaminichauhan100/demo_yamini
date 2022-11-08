import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "Amenities Add",
    name: "ReqAddAmenities"
})

export class ReqAddAmenitiesModel {

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Free Wifi' as any
    })
    name: string;
    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Business Industries' as any
    })
    type: string;
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg' as any
    })
    iconImage: string;
   
}


@ApiModel({
    description: "Amenities Update",
    name: "ReqUpdateAmenities"
})

export class ReqUpdateAmenitiesModel {

    @ApiModelProperty({
        description: "id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongoid' as any
    })
    id: string;

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Free Wifi' as any
    })
    name: string;
    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Business Industries' as any
    })
    type: string;
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg' as any
    })
    iconImage: string;


   
}

export class ReqUpdateAmenitiesFeatureModel {

    @ApiModelProperty({
        description: "id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongoid' as any
    })
    id: string;


    @ApiModelProperty({
        description: "featured status",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    isFeatured: number;
   
}