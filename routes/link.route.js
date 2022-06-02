import { Router } from 'express';

import { createLink, getLink, getLinks, removeLink } from 
                                          '../controllers/link.controller.js';
import { requireToken } from '../middlewares/requireToken.js';
import { bodyLinkValidator } from '../middlewares/validatorManager.js';

const router = Router();

router.get('/', requireToken, getLinks);
router.get('/:id', requireToken, getLink);
router.post('/', requireToken, bodyLinkValidator, createLink);
router.delete('/:id', requireToken, removeLink);

export default router;