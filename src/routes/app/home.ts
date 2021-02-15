import express from 'express';
import {mainView} from '../../controllers/router/home.controller';
const router = express.Router();

router.get('/home', mainView);

module.exports = router;
