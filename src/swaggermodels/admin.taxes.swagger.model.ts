import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";


@ApiModel({
    description: "Admin Taxes",
    name: "ReqAdminAddTaxesModel"
})

export class ReqAdminAddTaxesModel {
    @ApiModelProperty({
        description: "countryid",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 101 as any
    })
    countryId: number;
    @ApiModelProperty({
        description: "number",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 10 as any
    })
    tax: number;
    @ApiModelProperty({
        description: "level",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    level: number;
    @ApiModelProperty({
        description: "state",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: ['mongoid'] as any
    })
    state: Array<String>;

}


