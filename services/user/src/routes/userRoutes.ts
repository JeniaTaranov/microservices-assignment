import express from 'express';
import {createUser, getUserById} from '../controllers/userController';
import {Database} from "../database";

const router = express.Router();

const userRoutes = (db: Database) => {
    router.post('/users', createUser(db));
    router.get('/users/:id', getUserById(db));

    return router;
}

export default userRoutes;