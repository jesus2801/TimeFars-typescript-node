import express from 'express';
import {mainView} from '../../controllers/router/home.controller';
import {verifyToken} from '../../helpers/helperFunctions';
const router = express.Router();

router.get('/home', verifyToken, mainView);

module.exports = router;
