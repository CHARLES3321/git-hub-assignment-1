import {Router} from 'express';
const router = Router();
import {getAuthUser, signIn, signUp} from "./auth.controller.js";
import {checkToken} from "../../common/middlename/auth.middleware.js";

router.post('/sign-in', signIn)
router.post('/sign-up', signUp);
router.get('/user', checkToken, getAuthUser);

export const authRouter = router;