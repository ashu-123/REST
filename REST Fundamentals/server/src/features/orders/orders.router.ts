import express from "express";
import { getOrders } from "./orders.service";

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