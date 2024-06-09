import express from "express";
import { getCustomerDetail, getCustomers } from "./customers.service";

export const customersRouter = express.Router();

customersRouter.get('/', async (req, res) => {
    const customers = await getCustomers();
    res.json(customers);
});

customersRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    const customer = await getCustomerDetail(id);
    if(customer !== null) {
        res.json(customer);
    }
    else {
        res.status(404).json({message: 'Customer Unknown'});
    }
})