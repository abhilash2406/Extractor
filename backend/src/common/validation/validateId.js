import Joi from 'joi';

const validateId = async (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().guid().required(),
    }).options({ stripUnknown: true });

    req.params = await schema.validateAsync(req.params);
    next();
};

export default validateId;
