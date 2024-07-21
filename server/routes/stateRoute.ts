import express from 'express';
import { isUserAuthenticated } from '../middlewares/auth';
import { addState, deleteState, getAllStates, getState, updateState } from '../controllers/stateController';

const router = express.Router();

//api to add a new state
router.post("/", isUserAuthenticated, addState);

//api to fetch all the states
router.get("/", isUserAuthenticated, getAllStates);

//api to fetch state data by id
router.get("/:id", isUserAuthenticated, getState);

//api to update state data by id
router.put("/:id", isUserAuthenticated, updateState);

//api to delete state by id
router.delete("/:id", isUserAuthenticated, deleteState);

export default router;