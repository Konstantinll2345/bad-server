import { unlink } from 'fs'
import mongoose, { Document } from 'mongoose'
import { join } from 'path'

export interface IFile {
    fileName: string
    originalName: string
}

export interface IProduct extends Document {
    title: string
    image: IFile
    category: string
    description: string
    price: number
}

const cardsSchema = new mongoose.Schema<IProduct>(
    {
        title: {
            type: String,
            unique: true,
            required: [true, 'Поле "title" должно быть заполнено'],
            minlength: [2, 'Минимальная длина поля "title" - 2'],
            maxlength: [30, 'Максимальная длина поля "title" - 30'],
        },
        image: {
            fileName: {
                type: String,
                required: [true, 'Поле "image.fileName" должно быть заполнено'],
                maxlength: [255, 'Максимальная длина fileName — 255 символов'],
            },
            originalName: {
                type: String,
                maxlength: [
                    255,
                    'Максимальная длина originalName — 255 символов',
                ],
            },
        },
        category: {
            type: String,
            required: [true, 'Поле "category" должно быть заполнено'],
            maxlength: [50, 'Максимальная длина категории — 50 символов'],
        },
        description: {
            type: String,
            maxlength: [5000, 'Максимальная длина описания — 5000 символов'],
        },
        price: {
            type: Number,
            default: null,
            min: 0,
            max: 1000000,
        },
    },
    { versionKey: false }
)

cardsSchema.index({ title: 'text' })

cardsSchema.pre('findOneAndUpdate', async function deleteOldImage() {
    // @ts-ignore
    const updateImage = this.getUpdate().$set?.image
    const docToUpdate = await this.model.findOne(this.getQuery())
    if (updateImage && docToUpdate) {
        unlink(
            join(__dirname, `../public/${docToUpdate.image.fileName}`),
            (err) => console.log(err)
        )
    }
})

cardsSchema.post('findOneAndDelete', async (doc: IProduct) => {
    unlink(join(__dirname, `../public/${doc.image.fileName}`), (err) =>
        console.log(err)
    )
})

export default mongoose.model<IProduct>('product', cardsSchema)