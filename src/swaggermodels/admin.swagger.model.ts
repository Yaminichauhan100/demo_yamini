import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";


@ApiModel({
    description: "Admin Login",
    name: "ReqAdminLogin"
})

export class ReqAdminLoginModel {
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'desknowadmin@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Admin@123' as any
    })
    password: string;


}

@ApiModel({
    description: "Admin Login",
    name: "ReqAdminForgotPassword"
})

export class ReqAdminForgotPasswordModel {
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'desknowadmin@yopmail.com' as any
    })
    email: string;

}

@ApiModel({
    description: "Admin Reset Password",
    name: "ReqAdminResetPassword"
})

export class ReqAdminResetPasswordModel {
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '123456' as any
    })
    password: string;

}

@ApiModel({
    description: "Admin Reset Password",
    name: "ReqAdminAmountConfigModel"
})

export class ReqAdminAmountConfigModel {
    @ApiModelProperty({
        description: "Amount array",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: '123456' as any
    })
    amount: Array<Number>;

}

@ApiModel({
    description: "Admin Change Password",
    name: "ReqAdminChangePassword"
})

export class ReqAdminChangePasswordModel {
    @ApiModelProperty({
        description: "oldpassword",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '123456' as any
    })
    oldPassword: string;
    @ApiModelProperty({
        description: "oldpassword",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    newPassword: string;

}

@ApiModel({
    description: "Admin Update Profile",
    name: "ReqAdminUpdateProfile"
})

export class ReqAdminUpdateProfileModel {
    @ApiModelProperty({
        description: "profile photo",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    profilePhoto: string;
    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'rahul' as any
    })
    name: string;

}

export class ReqAdminSubjectModel {

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'return policy' as any
    })
    name: string;

}


export class ReqAdminConfigModel {

    
    @ApiModelProperty({
        description: "title",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'title' as any
    })
    title: string;

    @ApiModelProperty({
        description: "image",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'image' as any
    })
    image: string;

}


export class ReqAdminConfigUpdateModel {

    @ApiModelProperty({
        description: "id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'id' as any
    })
    id: string;

    
    @ApiModelProperty({
        description: "title",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'title' as any
    })
    title: string;

    @ApiModelProperty({
        description: "image",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'image' as any
    })
    image: string;

}

