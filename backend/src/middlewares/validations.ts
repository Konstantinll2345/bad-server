import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'

// eslint-disable-next-line no-useless-escape
export const phoneRegExp = /^\+?[0-9\s()-]{7,20}$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array()
            .items(
                Joi.string().custom((value, helpers) => {
                    if (Types.ObjectId.isValid(value)) {
                        return value
                    }
                    return helpers.message({ custom: 'Невалидный id' })
                })
            )
            .min(1)
            .max(50)
            .required()
            .messages({
                'array.empty': 'Не указаны товары',
                'array.min': 'Не указаны товары',
                'array.max': 'Максимум 50 товаров в заказе',
            }),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required()
            .messages({
                'string.valid':
                    'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
                'string.empty': 'Не указан способ оплаты',
            }),
        email: Joi.string().email().max(100).required().messages({
            'string.empty': 'Не указан email',
            'string.max': 'Максимальная длина email — 100 символов',
        }),
        phone: Joi.string()
            .required()
            .pattern(phoneRegExp)
            .max(20)
            .messages({
                'string.empty': 'Не указан телефон',
                'string.max': 'Максимальная длина телефона — 20 символов',
            }),
        address: Joi.string().max(500).required().messages({
            'string.empty': 'Не указан адрес',
            'string.max': 'Максимальная длина адреса — 500 символов',
        }),
        total: Joi.number().required().min(0).max(1000000).messages({
            'string.empty': 'Не указана сумма заказа',
            'number.max': 'Сумма заказа слишком велика',
        }),
        comment: Joi.string().max(1000).optional().allow('').messages({
            'string.max': 'Максимальная длина комментария — 1000 символов',
        }),
    }),
})

export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().required().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
            'string.empty': 'Поле "title" должно быть заполнено',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required().max(255),
            originalName: Joi.string().required().max(255),
        }),
        category: Joi.string().required().max(50).messages({
            'string.empty': 'Поле "category" должно быть заполнено',
            'string.max': 'Максимальная длина категории — 50 символов',
        }),
        description: Joi.string().required().max(5000).messages({
            'string.empty': 'Поле "description" должно быть заполнено',
            'string.max': 'Максимальная длина описания — 5000 символов',
        }),
        price: Joi.number().allow(null).max(1000000),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        image: Joi.object().keys({
            fileName: Joi.string().required().max(255),
            originalName: Joi.string().required().max(255),
        }),
        category: Joi.string().max(50),
        description: Joi.string().max(5000),
        price: Joi.number().allow(null).max(1000000),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: Joi.string()
            .required()
            .custom((value, helpers) => {
                if (Types.ObjectId.isValid(value)) {
                    return value
                }
                return helpers.message({ any: 'Невалидный id' })
            }),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().min(2).max(30).messages({
            'string.min': 'Минимальная длина поля "name" - 2',
            'string.max': 'Максимальная длина поля "name" - 30',
        }),
        password: Joi.string().min(6).max(128).required().messages({
            'string.empty': 'Поле "password" должно быть заполнено',
            'string.max': 'Максимальная длина пароля — 128 символов',
        }),
        email: Joi.string()
            .required()
            .email()
            .max(100)
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.empty': 'Поле "email" должно быть заполнено',
                'string.max': 'Максимальная длина email — 100 символов',
            }),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string()
            .required()
            .email()
            .max(100)
            .message('Поле "email" должно быть валидным email-адресом')
            .messages({
                'string.required': 'Поле "email" должно быть заполнено',
                'string.max': 'Максимальная длина email — 100 символов',
            }),
        password: Joi.string().required().max(128).messages({
            'string.empty': 'Поле "password" должно быть заполнено',
            'string.max': 'Максимальная длина пароля — 128 символов',
        }),
    }),
})

