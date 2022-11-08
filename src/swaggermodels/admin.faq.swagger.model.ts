import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "FAQ ADD",
    name: "ReqAddFaqModel"
})

export class ReqAddFaqModel {

    @ApiModelProperty({
        description: "questiion",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'How do u like the app?' as any
    })
    question: string;
    @ApiModelProperty({
        description: "answer",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Business Industries' as any
    })
    answer: string;
    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'EN' as any
    })
    lang: string;
    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'EN' as any
    })
    userType: string;
}

@ApiModel({
    description: "ADD CANCELLATION POLICY",
    name: "ReqAddCancellationModel"
})

export class ReqAddCancellationModel {

    @ApiModelProperty({
        description: "questiion",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'How do u like the app?' as any
    })
    reason: string;

    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'EN' as any
    })
    lang: string;

    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1' as any
    })
    userType: string;
}

@ApiModel({
    description: "FAQ ADD",
    name: "ReqAddTAndCModel"
})

export class ReqAddTAndCModel {

    @ApiModelProperty({
        description: "type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1,2,3' as any
    })
    type: number;
    @ApiModelProperty({
        description: "answer",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: 'HTML CONTENT OBJECT' as any
    })
    content: object;
    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'EN' as any
    })
    lang: string;
    @ApiModelProperty({
        description: "lang",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'EN' as any
    })
    userType: string;
}

@ApiModel({
    description: "ADD NOTIFICATION FOR BULK PUSH",
    name: "ReqAddNotificationModel"
})

export class ReqAddNotificationModel {

    @ApiModelProperty({
        description: "title",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Title for notification' as any
    })
    title: string;

    @ApiModelProperty({
        description: "Description",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'description for notification' as any
    })
    description: string;

    @ApiModelProperty({
        description: "image",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Image if any?' as any
    })
    image: string;

    @ApiModelProperty({
        description: "recipientType such as for app 1",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1 for app' as any
    })
    recipientType: string;

    @ApiModelProperty({
        description: "otherRecipientIds only required when recipientType is others",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1 for app' as any
    })
    otherRecipientIds: string;
}

export class ReqUpdateNotificationModel {

    @ApiModelProperty({
        description: "NotificationId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Notification Id' as any
    })
    notificationId: string;

    @ApiModelProperty({
        description: "Description",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'description for notification' as any
    })
    description: string;


    @ApiModelProperty({
        description: "title",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Title for notification' as any
    })
    title: string;

    @ApiModelProperty({
        description: "image",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Image if any?' as any
    })
    image: string;

    @ApiModelProperty({
        description: "recipientType such as for app 1",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '1 for app' as any
    })
    recipientType: string;

    @ApiModelProperty({
        description: "otherRecipientIds only required when recipientType is others",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '1 for app' as any
    })
    otherRecipientIds: string;
}


