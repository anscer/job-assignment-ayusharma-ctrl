import mongoose, { Schema, Document } from 'mongoose';

const stateSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

export interface IState extends Document {
    name: string;
    description: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: mongoose.Types.ObjectId;
}

export const State = mongoose.model<IState>("State", stateSchema);