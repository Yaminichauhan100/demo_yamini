import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";



@ApiModel({
    description: "User Add",
    name: "ReqAddUser"
})

export class ReqAddUserModel {

    @ApiModelProperty({
        description: "Comapny Type",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'company/individual' as any
    })
    companyType: string;

    @ApiModelProperty({
        description: "Name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Touheed' as any
    })
    name: string;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    password: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "subscribeEmail",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'true' as any
    })
    subscribeEmail: boolean;
}

@ApiModel({
    description: "reset password",
    name: "ReqUserResendOtp"
})
export class ReqUserResendOtpModel {
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;

}

@ApiModel({
    description: "update device token",
    name: "ReqUpdateDeviceToken"
})
export class ReqUpdateUserDeviceToken {
    @ApiModelProperty({
        description: "deviceToken",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'device token' as any
    })
    deviceToken: string;

}

@ApiModel({
    description: "User Add",
    name: "ReqVerifyOtp"
})

export class ReqVerifyOtpModel {
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "otp",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1234' as any
    })
    otp: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: { platform: "ios", token: "devicetoken" } as any
    })
    device: object;

}

@ApiModel({
    description: "verify otp",
    name: "verifyOtp"
})

export class verifyOtpModel {
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "otp",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1234' as any
    })
    otp: string;

}

@ApiModel({
    description: "User Add",
    name: "UserLogin"
})

export class UserLoginModel {
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'ank@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    password: string;
    @ApiModelProperty({
        description: "device",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: { type: 0, token: "devicetoken" } as any
    })
    device: object;

}


@ApiModel({
    description: "User Add",
    name: "ForgetPasswordEmail"
})
export class ForgetPasswordEmailModel {
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'ank@yopmail.com' as any
    })
    email: string;

}

@ApiModel({
    description: "Forget Password ",
    name: "ForgetPasswordPhone"
})
export class ForgetPasswordPhoneModel {
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;

}


@ApiModel({
    description: "reset password",
    name: "ReqUserResetPassword"
})
export class ReqUserResetPassword {
    @ApiModelProperty({
        description: "resetToken",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOiI1ZThhYzQ2ODA4ZjIzNTJmOTc4ODkwY2QiLCJ0aW1lc3RhbXAiOjE1ODYxNTI1NTMwMzcsImlhdCI6MTU4NjE1MjU1M30.EBHnzc7mierT6esTiyODCCppn4H5v6HORIQ4UXJw2yI' as any
    })
    resetPasswordToken: string;
    @ApiModelProperty({
        description: "new password",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    password: string;

}

@ApiModel({
    description: "Change user password",
    name: "ChangePassword"
})
export class ChangePasswordModel {
    @ApiModelProperty({
        description: "oldPassword",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    oldPassword: string;
    @ApiModelProperty({
        description: "newPassword",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    newPassword: string;
}


@ApiModel({
    description: "social LOgin",
    name: "ReqUserSocialLogin"
})
export class ReqUserSocialLoginModel {
    @ApiModelProperty({
        description: "socialType",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'facebook/linkedin' as any
    })
    socialType: string;
    @ApiModelProperty({
        description: "socialid",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "scvhdsvchdscs" as any
    })
    socialId: string;
    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "Touheed" as any
    })
    name: string;
    @ApiModelProperty({
        description: "email",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "asdasdasd@yopmail.com" as any
    })
    email: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "+1" as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phoneNumber",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "345645645" as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "device",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: { type: "ios", token: "devicetoken" } as any
    })
    device: object;
}


@ApiModel({
    description: "User Comapny Detail",
    name: "ReqAddUserCompanyDetail"
})

export class ReqAddUserCompanyDetailModel {

    @ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv' as any
    })
    name: string;
    @ApiModelProperty({
        description: "Email of Company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "house no of company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9c' as any
    })
    houseNo: string;
    @ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    street: string;
    @ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters' as any
    })
    landmark: string;
    @ApiModelProperty({
        description: "country of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'India' as any
    })
    country: string;
    @ApiModelProperty({
        description: "state of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'UP' as any
    })
    state: string;
    @ApiModelProperty({
        description: "city of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Noida' as any
    })
    city: string;
    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;
    @ApiModelProperty({
        description: "registration number of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    regNo: string;
    @ApiModelProperty({
        description: "profile picture of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg" as any

    })
    profilePicture: string;
    @ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    documents: Array<String>;
    @ApiModelProperty({
        description: "state id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 35 as any
    })
    stateId: number;
    @ApiModelProperty({
        description: "country Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 101 as any
    })
    countryId: number;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a" as any
    })
    cityId: string;

    @ApiModelProperty({
        description: "subCompanyType",
        required: false,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    subCompanyType: number;
}


@ApiModel({
    description: "User Comapny Detail",
    name: "ReqUpdateUserCompanyDetail"
})

export class ReqUpdateUserCompanyDetailModel {
    @ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv' as any
    })
    name: string;
    @ApiModelProperty({
        description: "Email of Company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "house no of company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '9c' as any
    })
    houseNo: string;
    @ApiModelProperty({
        description: "street of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sec 58' as any
    })
    street: string;
    @ApiModelProperty({
        description: "landmark of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'near thosom reuters' as any
    })
    landmark: string;
    @ApiModelProperty({
        description: "zipcode of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    zipCode: string;
    @ApiModelProperty({
        description: "address of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '201301' as any
    })
    address: string;
    @ApiModelProperty({
        description: "registration number of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    regNo: string;
    @ApiModelProperty({
        description: "profile picture of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg" as any

    })
    profilePicture: string;
    @ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg'
        ] as any
    })
    documents: Array<String>;
    @ApiModelProperty({
        description: "state id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 35 as any
    })
    stateId: number;
    @ApiModelProperty({
        description: "country Id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 101 as any
    })
    countryId: number;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "5e95596572304740458cde7a" as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "city id",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: "0" as any
    })
    subCompanyType: number;
}

@ApiModel({
    description: "Change Phone No",
    name: "ChangePhoneNo"
})
export class ChangePhoneNoModel {
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
}


export class ReqMarkPropertyFavouriteModel {

    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'PropertyId' as any
    })
    propertyId: string;
    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    action: number;
}
@ApiModel({
    description: "User update profile",
    name: "ReqUpdateUserProfileAndCompnay"
})

export class ReqUpdateUserProfileAndCompnayModel {

    @ApiModelProperty({
        description: "Name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Touheed' as any
    })
    name: string;
    @ApiModelProperty({
        description: "address",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'sector 58, noida' as any
    })
    address: string;
    @ApiModelProperty({
        description: "dob",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '1990/10/1' as any
    })
    dob: string;

    @ApiModelProperty({
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    bio: string;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "image",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;
    @ApiModelProperty({
        description: "password",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            "name": "Appinventiv",
            "email": "abc@yopmail.com",
            "address": "sector 58 noida",
            "countryCode": "+1",
            "phoneNo": "12345678",
            "houseNo": "9c",
            "street": "sec 58",
            "landmark": "near thosom reuters",
            "zipCode": "201301",
            "taxNo": "12345678",
            "regNo": "12345678",
            "profilePicture": "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg",
            "documents": [
                "https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg"
            ],
            "stateId": 35,
            "countryId": 101,
            "cityId": "5e95596572304740458cde7a"
        } as any
    })
    company: object;
}


export class ReqCoworkerInviteModel {
    @ApiModelProperty({
        description: "documents of comapny",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            'ank@gmail.com'
        ] as any
    })
    email: Array<String>;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'booking id' as any
    })
    bookingId: string;
}
export class ReqSpaceBookingModel {
    @ApiModelProperty({
        description: "cart Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cartId' as any
    })
    cartId: string;

    @ApiModelProperty({
        description: "occupancy",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    occupancy: number;

    @ApiModelProperty({
        description: "extended",
        required: false,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    extended: boolean;

    @ApiModelProperty({
        description: "prolongBookingId",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    prolongBookingId: string;

}

export class ReqUpdateOfflineBookingModel {
    @ApiModelProperty({
        description: "cart Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cartId' as any
    })
    cartId: string;

    @ApiModelProperty({
        description: "occupancy",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    occupancy: number;

    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'cartId' as any
    })
    bookingId: string;
}

export class ReqCancelSpaceBookingModel {
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;

    @ApiModelProperty({
        description: "description",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    description: string

    @ApiModelProperty({
        description: "reason",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    reason: string
}

export class ReqUpdatepbTokenModel {
    @ApiModelProperty({
        description: "passBaseToken",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'asdkalsidqowasdhaluwe' as any
    })
    passbaseToken: string;
}

export class ReqUpdatePaymentPlanModel {
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;

    @ApiModelProperty({
        description: "paymentPlan",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: '1' as any
    })
    paymentPlan: number;

}

export class ReqUpdateNotificationToggle {
    @ApiModelProperty({
        description: "1/0 for enabling/disabling notification",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    notificationEnabled: number;
}
export class ReqUpdateNotificationEmailToggle {
    @ApiModelProperty({
        description: "1/0 for enabling/disabling emailnotification",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: 1 as any
    })
    mailNotificationEnabled: number;
}
export class ReqProceedPaymentModel {
    @ApiModelProperty({
        description: "booking Id",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;

}
export class ReqSpaceCartModel {
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'PropertyId' as any
    })
    propertyId: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    spaceId: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    quantity: string;

    @ApiModelProperty({
        description: "action",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    userId: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    fromDate: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    toDate: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    isEmployee: boolean;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    bookingType: string;

    @ApiModelProperty({
        description: "action",
        required: false,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    totalHours: number;

    @ApiModelProperty({
        description: "action",
        required: false,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    totalMonths: number;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    PartnerId: string;
}

export class ReqProlongSpaceCartModel {
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'PropertyId' as any
    })
    propertyId: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    spaceId: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    quantity: string;

    @ApiModelProperty({
        description: "action",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    userId: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    fromDate: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    toDate: string;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    isEmployee: boolean;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    bookingType: string;

    @ApiModelProperty({
        description: "action",
        required: false,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    totalMonths: number;

    @ApiModelProperty({
        description: "action",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    PartnerId: string;
}
export class ReqRatingModel {
    @ApiModelProperty({
        description: "propertyId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'PropertyId' as any
    })
    propertyId: string;

    @ApiModelProperty({
        description: "bookingId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;

    @ApiModelProperty({
        description: "hostId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    hostId: string;

    @ApiModelProperty({
        description: "rating",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    rating: number;

    @ApiModelProperty({
        description: "review",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    review: string;

}


export class ReqContactModel {

    @ApiModelProperty({
        description: "bookingId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;


    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    name: string;

    @ApiModelProperty({
        description: "email",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    email: string;

    @ApiModelProperty({
        description: "companyName",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    companyName: string;


    @ApiModelProperty({
        description: "phoneNo",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    phoneNo: string;

    @ApiModelProperty({
        description: "message",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    message: string;
    @ApiModelProperty({
        description: "countryCode",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    countryCode: string;
    @ApiModelProperty({
        description: "subject",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    subject: string;
}

export class ReqContactDirectModel {

    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    name: string;

    @ApiModelProperty({
        description: "email",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    email: string;

    @ApiModelProperty({
        description: "companyName",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    companyName: string;


    @ApiModelProperty({
        description: "phoneNo",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    phoneNo: string;

    @ApiModelProperty({
        description: "message",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    message: string;
    @ApiModelProperty({
        description: "countryCode",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    countryCode: string;
    @ApiModelProperty({
        description: "subject",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    subject: string;

    @ApiModelProperty({
        description: "directType",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    directType: boolean;
}
export class ReqNotificationModel {

    @ApiModelProperty({
        description: "notificationId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'notificationId' as any
    })
    notificationId: string;



}

export class ReqGuestUserContactModel {




    @ApiModelProperty({
        description: "name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    name: string;

    @ApiModelProperty({
        description: "email",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    email: string;

    @ApiModelProperty({
        description: "companyName",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    companyName: string;


    @ApiModelProperty({
        description: "phoneNo",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    phoneNo: string;

    @ApiModelProperty({
        description: "message",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    message: string;
    @ApiModelProperty({
        description: "countryCode",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    countryCode: string;
    @ApiModelProperty({
        description: "subject",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
    })
    subject: string;
}

export class ReqUpdateUserCompleteProfileModel {

    @ApiModelProperty({
        description: "Name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Touheed' as any
    })
    name: string;

    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'abc@yopmail.com' as any
    })
    email: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '+1' as any
    })
    countryCode: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    phoneNo: string;
    @ApiModelProperty({
        description: "image",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;

    @ApiModelProperty({
        description: "companyType",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'companyType' as any
    })
    companyType: string;
}

export class ReqCalendarSyncModel {
    @ApiModelProperty({
        description: "Name",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    calendarType: Number;
}

export class ReqUpdateProfileCalendarModel {
    @ApiModelProperty({
        description: "Name",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
        example: 1 as any
    })
    type: Number;
    @ApiModelProperty({
        description: "Name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    code: String;
    @ApiModelProperty({
        description: "userId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    userId: String;
    @ApiModelProperty({
        description: "Name",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 1 as any
    })
    bookingId: String;
}