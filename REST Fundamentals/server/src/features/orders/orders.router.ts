import express from "express";
import { getOrders, upsertOrder } from "./orders.service";
import { validate } from "../../middleware/validation.middleware";
import { orderPOSTRequestSchema } from "../types";

export const ordersRouter = express.Router();

ordersRouter.get("/", async (req, res) => {
    const query = req.query;
    const take = query.take;
    const skip = query.skip;

    if(take &&
        typeof take === "string" &&
        parseInt(take) > 0 &&
        skip &&
        typeof skip === "string" &&
        parseInt(skip) > -1) { 
            const orders = await getOrders(parseInt(skip), parseInt(take));
                res.json(orders);
            }
            else {
                res.status(404).json({message: 'Not happening!'})
            }
        }
    );

    ordersRouter.post('/', validate(orderPOSTRequestSchema), async (req, res) => {
        const data = orderPOSTRequestSchema.parse(req);
        const order = await upsertOrder(data.body);

        if(order!==null) {
            res.status(201).json(order);
        }
        else {
            res.status(500).json({message: 'Creation failed'});
        }
    });