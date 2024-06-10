import express from "express";
import { getCustomerDetail, getCustomers, searchCustomers, upsertCustomer } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { validate } from "../../middleware/validation.middleware";
import { customerPOSTRequestSchema, customerPUTRequestSchema } from "../types";

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
});

customersRouter.get('/:id/orders', async (req, res) => {
    const id = req.params.id;
    const orders = await getOrdersForCustomer(id);
    res.json(orders);
});

customersRouter.get("/search/:query", async (req, res) => {
    const query = req.params.query;
    const customers = await searchCustomers(query);
    res.json(customers);
});

customersRouter.put("/:id", validate(customerPUTRequestSchema), async (req, res) => {
    const data = customerPUTRequestSchema.parse(req);
    const customer = await upsertCustomer(data.body, data.params.id);
  
    if(customer!==null) {
      res.status(204);
    }
    else {
      res.status(404).json({message: "Customer not found"});
    }
  });

customersRouter.post('/', validate(customerPOSTRequestSchema), async (req, res) => {
    const data = customerPOSTRequestSchema.parse(req);
    const customer = await upsertCustomer(data.body);

    if(customer!==null) {
        res.status(201).json(customer);
    }
    else {
        res.status(500).json({message: 'Creation failed'});
    }
});