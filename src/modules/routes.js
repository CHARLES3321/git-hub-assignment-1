import { Router } from 'express';
import {authRouter} from "./auth/auth.routes.js";
import {checkToken} from "../common/middlename/auth.middleware.js";
import {userRouter} from "./users/user.routes.js";
const router = new Router();

router.use('/auth', authRouter);
router.use('/users', checkToken, userRouter);

export const appRouter = router;