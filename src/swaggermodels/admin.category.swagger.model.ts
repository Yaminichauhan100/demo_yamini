import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "Category Add",
    name: "ReqAddCategory"
})

export class ReqAddCategoryModel {

    @ApiModelProperty({
        description: "parentId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '' as any
    })
    parentId: string;

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Category 1' as any
    })
    name: string;
    @ApiModelProperty({
        description: "description",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Description of the category' as any
    })
    description: string;
    
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg' as any
    })
    iconImage: string;
   
    @ApiModelProperty({
        description: "[]",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: ['a','b'] as any
    })
    options: string[];
}


@ApiModel({
    description: "Amenities Update",
    name: "ReqUpdateCategory"
})

export class ReqUpdateCategoryModel {

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
        example: 'Category 1' as any
    })
    name: string;
    @ApiModelProperty({
        description: "description",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Description of the category' as any
    })
    description: string;
    
    @ApiModelProperty({
        description: "image url",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://image.flaticon.com/icons/svg/748/748151.svg' as any
    })
    iconImage: string;
   
}

@ApiModel({
    description: "Update commission percentage",
    name: "ReqUpdateCommission"
})

export class ReqUpdateCommission {

    @ApiModelProperty({
        description: "hostId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongo id' as any
    })
    hostId: string;

    @ApiModelProperty({
        description: "commissionAmount",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 10 as any
    })
    commissionAmount: number;
}
