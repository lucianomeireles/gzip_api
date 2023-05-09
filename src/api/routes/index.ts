import { Router } from "express";

import books from "./book.route";

const router = Router();

router.use("/books", books);

export default router;
