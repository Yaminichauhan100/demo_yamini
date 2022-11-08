import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";

@ApiModel({
    description: " Add",
    name: "ReqSendUserdGiftCardModel"
})

export class ReqSendUserdGiftCardModel {
    @ApiModelProperty({
        description: "Amount",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 5550 as any
    })
    email: Number;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'email id' as any
    })
    to: string;
    @ApiModelProperty({
        description: "user name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'name' as any
    })
    from: string;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'email id' as any
    })
    message: string;
}