import express from "express";
import { getCustomers } from "./customers.service";

export const customersRouter = express.Router();

customersRouter.get('/', async (req, res) => {
    const customers = await getCustomers();
    res.json(customers);
});