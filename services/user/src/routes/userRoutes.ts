import express from 'express';
import {createUser, getUserById, getUsers} from '../controllers/userController';
import {Database} from "../database";

const router = express.Router();

const userRoutes = (db: Database) => {
    router.post('/users', createUser(db));
    router.get('/users/:id', getUserById(db));
    router.get('/users', getUsers(db));

    return router;
}

export default userRoutes;