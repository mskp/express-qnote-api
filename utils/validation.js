import Joi from 'joi';

export const validateSignup = data => {
    const schema = Joi.object({
        name: Joi.string().min(6).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(1024).required()
    });

    return schema.validate(data);
}

export const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email(),
        password: Joi.string().min(6).max(1024).required()
    }).xor('username', 'email').options({ abortEarly: false });

    return schema.validate(data);
}

export const validateNote = data => {
    const schema = Joi.object({
        title: Joi.string().min(1).max(70).required(),
        description: Joi.string().min(1).max(1000).required()
    })

    return schema.validate(data);
}