import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "swagger-express-ts";
import { String } from "aws-sdk/clients/acm";



@ApiModel({
    description: "Host Add",
    name: "ReqAddHost"
})

export class ReqAddHostModel {

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
    description: "resnd otp",
    name: "ReqHostResendOtp"
})
export class ReqHostResendOtpModel {
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
    description: "resnd otp",
    name: "ReqHostDeleteClientModel"
})
export class ReqHostDeleteClientModel {
    @ApiModelProperty({
        description: "userId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongo id' as any
    })
    userId: string;

}
@ApiModel({
    description: "User Add",
    name: "ReqHostVerifyOtp"
})

export class ReqHostVerifyOtpModel {
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
    description: "update device token",
    name: "ReqUpdateDeviceToken"
})
export class ReqUpdateDeviceToken {
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
    name: "HostLogin"
})

export class HostLoginModel {
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
    description: "reset password",
    name: "ReqHostResetPassword"
})
export class ReqHostResetPassword {
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
    description: "social LOgin",
    name: "ReqHostSocialLogin"
})
export class ReqHostSocialLoginModel {
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
        example: { platform: "ios", token: "devicetoken" } as any
    })
    device: object;
}


@ApiModel({
    description: "Host Comapny Detail",
    name: "ReqAddHostCompanyDetail"
})

export class ReqAddHostCompanyDetailModel {

    @ApiModelProperty({
        description: "Name of Company",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv' as any
    })
    name: string;
    @ApiModelProperty({
        description: "address",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Appinventiv' as any
    })
    address: string;
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
        required: false,
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
        description: "tax number of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    taxNo: string;
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
        description: "tnc ",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: true as any
    })
    tncAgreed: Boolean;
}

@ApiModel({
    description: "Host update profile",
    name: "ReqUpdateHostProfile"
})

export class ReqUpdateHostProfileModel {

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
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    fbUrl: string;
    @ApiModelProperty({
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    twitterUrl: string;
    @ApiModelProperty({
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    linkedinUrl: string;
    @ApiModelProperty({
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    youtubeUrl: string;
    @ApiModelProperty({
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    instaUrl: string;

    @ApiModelProperty({
        description: "bio",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Bio goes here' as any
    })
    slackUrl: string;

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
            "cityId": "5e95596572304740458cde7a",
            "tncAgreed": true
        } as any
    })
    company: object;
}

@ApiModel({
    description: "User update profile",
    name: "ReqUpdateUserProfile"
})

export class ReqUpdateUserProfileModel {

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
        description: "image",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'https://www.extremetech.com/wp-content/uploads/2019/12/SONATA-hero-option1-764A5360-edit-640x354.jpg' as any
    })
    image: string;
}

@ApiModel({
    description: "Host Comapny Detail",
    name: "ReqUpdateHostCompanyDetailModel"
})

export class ReqUpdateHostCompanyDetailModel {
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
        required: false,
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
        description: "tax number of comapny",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '12345678' as any
    })
    taxNo: string;
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
}

@ApiModel({
    description: "User Add",
    name: "ReqHostVerifyNewPhoneOtpModel"
})

export class ReqHostVerifyNewPhoneOtpModel {
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

export class ReqHostRatingModel {
    @ApiModelProperty({
        description: "reviewId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    reviewId: string;
    @ApiModelProperty({
        description: "review",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    review: string;
}

export class ReqOfflineBooking {
    @ApiModelProperty({
        description: "Name as string",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'John Doe' as any
    })
    name: string;

    @ApiModelProperty({
        description: "Email as string",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'johndoe@yopmail.com' as any
    })
    email: string;

    @ApiModelProperty({
        description: "Full mobile number",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '+91-123456789' as any
    })
    fullMobileNumber: string;

    @ApiModelProperty({
        description: "Company Name",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: "Doe Industries" as any
    })
    companyName: string;

    @ApiModelProperty({
        description: "Company Email",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'johnny@doe.com' as any
    })
    companyEmail: string;

    @ApiModelProperty({
        description: "Company Office Number",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '+91-123456789' as any
    })
    companyOfficeNumber: string;

    @ApiModelProperty({
        description: "Company House Number",
        required: false,
        type: SwaggerDefinitionConstant.NUMBER,
        example: '1234' as any
    })
    houseNumber: number;

    @ApiModelProperty({
        description: "Street",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '1st cross street' as any
    })
    street: string;

    @ApiModelProperty({
        description: "landmark",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'near john circle' as any
    })
    landmark: string;

    @ApiModelProperty({
        description: "Country",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'pass country id' as any
    })
    country: string;

    @ApiModelProperty({
        description: "Zip code",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '021230' as any
    })
    zipCode: string;

    @ApiModelProperty({
        description: "State",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '' as any
    })
    state: string;

    @ApiModelProperty({
        description: "City",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'City id' as any
    })
    city: string;

    @ApiModelProperty({
        description: "Company Reg no",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '123456789' as any
    })
    registrationNumber: string;
}

export class ReqOfflineUser {

    @ApiModelProperty({
        description: "User Id as string",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'userId' as any
    })
    userId: string;

    @ApiModelProperty({
        description: "Name as string",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'John Doe' as any
    })
    name: string;

    @ApiModelProperty({
        description: "Email as string",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'johndoe@yopmail.com' as any
    })
    email: string;

    @ApiModelProperty({
        description: "Full mobile number",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '+91-123456789' as any
    })
    fullMobileNumber: string;

    @ApiModelProperty({
        description: "Company Name",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: "Doe Industries" as any
    })
    companyName: string;

    @ApiModelProperty({
        description: "Company Email",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'johnny@doe.com' as any
    })
    companyEmail: string;

    @ApiModelProperty({
        description: "Company Office Number",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '+91-123456789' as any
    })
    companyOfficeNumber: string;

    @ApiModelProperty({
        description: "Company House Number",
        required: false,
        type: SwaggerDefinitionConstant.NUMBER,
        example: '1234' as any
    })
    houseNumber: number;

    @ApiModelProperty({
        description: "Street",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '1st cross street' as any
    })
    street: string;

    @ApiModelProperty({
        description: "landmark",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'near john circle' as any
    })
    landmark: string;

    @ApiModelProperty({
        description: "Country",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'pass country id' as any
    })
    country: string;

    @ApiModelProperty({
        description: "Zip code",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '021230' as any
    })
    zipCode: string;

    @ApiModelProperty({
        description: "State",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '' as any
    })
    state: string;

    @ApiModelProperty({
        description: "City",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'City id' as any
    })
    city: string;

    @ApiModelProperty({
        description: "Company Reg no",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: '123456789' as any
    })
    registrationNumber: string;
}


@ApiModel({
    description: "Host Add",
    name: "ReqAddCoHostModel"
})

export class ReqAddCoHostModel {
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
        description: "access rights",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            0
        ] as any
    })
    permissions: Array<Number>
    @ApiModelProperty({
        description: "territory",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {
            "propertyId": ["mongoid"],
            "stateId": [35],
            "countryId": [101],
            "cityId": ["mongoid"]
        } as any
    })
    territory: object;

}

@ApiModel({
    description: "Host Add",
    name: "ReqAddCoHostTerritoyModel"
})

export class ReqAddCoHostTerritoyModel {
    @ApiModelProperty({
        description: "mongoid",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongiid' as any
    })
    cohostId: string;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: [35] as any
    })
    stateId: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: ["mongoid"] as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: [101] as any
    })
    countryId: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: ["mongoid"] as any
    })
    propertyId: string;
    //propertyId

}

@ApiModel({
    description: "Host Add",
    name: "ReqEditCoHostTerritoyModel"
})

export class ReqEditCoHostTerritoyModel {
    @ApiModelProperty({
        description: "mongoid",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'mongiid' as any
    })
    id: string;
    @ApiModelProperty({
        description: "Email of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: [35] as any
    })
    stateId: string;
    @ApiModelProperty({
        description: "countryCode",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: ["mongoid"] as any
    })
    cityId: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: [101] as any
    })
    countryId: string;
    @ApiModelProperty({
        description: "phone no of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: ["mongoid"] as any
    })
    propertyId: string;
    //propertyId

}

@ApiModel({
    description: "Host Add",
    name: "ReqUpdateCoHostModel"
})

export class ReqUpdateCoHostModel {
    @ApiModelProperty({
        description: "Name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Touheed' as any
    })
    id: string;
    @ApiModelProperty({
        description: "Name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Touheed' as any
    })
    name: string;
    @ApiModelProperty({
        description: "access rights",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        example: [
            0
        ] as any
    })
    permissions: Array<Number>

}


@ApiModel({
    description: "Host Add",
    name: "ReqUpdateCoHostAceessModel"
})

export class ReqUpdateCoHostAceessModel {
    @ApiModelProperty({
        description: "Name of user",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'Touheed' as any
    })
    id: string;


}


export class ReqCheckInModel {
    @ApiModelProperty({
        description: "bookingId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'bookingId' as any
    })
    bookingId: string;
    @ApiModelProperty({
        description: "coworkerId",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: 'coworkerId' as any
    })
    coworkerId: string;
    @ApiModelProperty({
        description: "date",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '2020-07-15T21:24:30.195+05:30' as any
    })
    date: string;
    @ApiModelProperty({
        description: "time",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '2020-07-15T21:24:30.195+05:30' as any
    })
    time: string
    @ApiModelProperty({
        description: "status 0 in 1 out",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
        example: '0' as any
    })
    status: string

    @ApiModelProperty({
        description: "remark",
        required: false,
        type: SwaggerDefinitionConstant.STRING,
        example: 'remark' as any
    })
    remark: string

}

