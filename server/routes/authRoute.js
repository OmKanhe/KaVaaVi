import express from 'express';
import cors from 'cors';
import { loginCandidate, registerCandidate } from '../controllers/authController.js';

const route = express.Router();

route.use(cors());

route.post("/register", registerCandidate);
route.post("/login", loginCandidate);


export {route};