import { Router } from 'express';
import {checkUserRole} from "../../common/middlename/auth.middleware.js";
import {getAllUsers} from "./users.controller.js";
const router = Router();

router.get('/', checkUserRole("admin", "super_admin"), getAllUsers);

export const userRouter = router;