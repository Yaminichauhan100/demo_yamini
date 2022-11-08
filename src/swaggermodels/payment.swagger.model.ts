import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "Card Add",
    name: "ReqAddCardModel"
})

export class ReqAddCardModel {

    @ApiModelProperty({
        description: "token",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "" as any
    })
    token: string

}


@ApiModel({
    description: "Card Add",
    name: "ReqAddPaymentModel"
})

export class ReqAddPaymentModel {

    @ApiModelProperty({
        description: "card Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "" as any
    })
    cardId: string

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "" as any
    })
    bookingId: string

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: "" as any
    })
    savedCard: boolean

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    paymentPlan: number

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    cardDigit: string
}

@ApiModel({
    description: "Card Add",
    name: "ReqAddGiftPaymentModel"
})

export class ReqAddGiftPaymentModel {

    @ApiModelProperty({
        description: "card Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "" as any
    })
    cardId: string

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "" as any
    })
    giftCardNo: number

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: "" as any
    })
    savedCard: boolean

}



@ApiModel({
    description: "Card Add",
    name: "ReqAdd3DPaymentModel"
})

export class ReqAdd3DPaymentModel {

    @ApiModelProperty({
        description: "data",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: "" as any
    })
    data: Object

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "" as any
    })
    bookingId: string
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: "" as any
    })
    savedCard: boolean
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    paymentPlan: number
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    cardDigit: string
}




