const joi = require('joi');

const nameSchema = joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
        'string.min': 'Name must be at least 3 characters',
        'string.max': 'Name cannot exceed 100 characters',
        'string.pattern.base': 'Name can only contain letters and spaces',
        'any.required': 'Name is required',
    });

const emailSchema = joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
        'string.email': 'Please enter a valid email address',
        'any.required': 'Email is required',
    });

const passwordSchema = joi.string()
    .min(8)
    .max(100)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/)
    .required()
    .messages({
        'string.min': 'Password must be at least 8 characters',
        'string.pattern.base': 'Password must include uppercase, lowercase, and a number',
        'any.required': 'Password is required',
    });

const SignUpValidation = async (req, res, next) => {
    const schema = joi.object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false,
            error,
        });
    }
    next();
};

const SendSignupOTPValidation = (req, res, next) => {
    const schema = joi.object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: joi.string()
            .valid(joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Passwords do not match',
                'any.required': 'Please confirm your password',
            }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false,
            error,
        });
    }
    next();
};

const VerifySignupOTPValidation = (req, res, next) => {
    const schema = joi.object({
        email: emailSchema,
        otp: joi.string().length(6).pattern(/^\d+$/).required().messages({
            'string.length': 'OTP must be 6 digits',
            'string.pattern.base': 'OTP must contain only numbers',
            'any.required': 'OTP is required',
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details[0].message,
            success: false,
            error,
        });
    }
    next();
};

const LoginValidation = (req, res, next) => {
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(4).max(100).required()
    })
    const {error} = schema.validate(req.body);
    if(error){
        return res.status(400).json({message: "Bad Request", error});
    }
    next();
}

module.exports = {
    LoginValidation,
    SignUpValidation,
    SendSignupOTPValidation,
    VerifySignupOTPValidation,
}
