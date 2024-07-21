import { Request, Response } from 'express';
import { IState, State } from "../models/stateModel";


export const addState = async (req: any, res: Response) => {
    try {
        // read the data from req body
        const { name, description, status }: { name: string, description: string, status: string } = req.body;

        // validation check
        if (![name, description, status].every(field => field && field.trim().length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
        }

        // id of authenticated user
        const { _id } = req.user!; // ! to tell typeScript it is not undefined

        // save state in db
        const state = await State.create({
            name,
            description,
            status,
            createdBy: _id
        })

        // send the response
        return res.status(200).json({
            success: true,
            message: "State has been added successfully!",
            state
        })
    }
    catch (e: any) {
        return res.status(500).json({ success: false, message: e.message })
    }
}

export const getAllStates = async (req: Request, res: Response) => {
    try {
        const states: IState[] = await State.find();
        res.status(200).json(states);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getState = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        // find state in db
        const state = await State.findById(id);
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        return res.status(200).json(state);
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateState = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        // read the data from req body
        const { name, description, status }: { name: string, description: string, status: string } = req.body;

        // validation check
        if (![name, description, status].every(field => field && field.trim().length > 0)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all the details before submitting!"
            })
        }

        // find state in db
        const state = await State.findById(id);
        if (!state) {
            return res.status(404).json({ error: 'State not found' });
        }

        // save latest details
        state.name = name;
        state.description = description;
        state.status = status;
        await state.save();

        return res.status(200).json({
            success: true,
            message: "State has been updated successfully!"
        });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const deleteState = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // validation check
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const result = await State.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ error: 'State not found' });
        }

        return res.status(204).json({ success: true, message: 'State deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

