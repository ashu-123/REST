import express from "express";
import { addOrderItems, getOrders, upsertOrder, deleteOrderItem, deleteOrder } from "./orders.service";
import { validate } from "../../middleware/validation.middleware";
import { idItemIdUUIDRequestSchema, idUUIDRequestSchema, orderItemsDTORequestSchema, orderPOSTRequestSchema } from "../types";
import { create } from "xmlbuilder2";

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

    ordersRouter.post("/:id/items", validate(orderItemsDTORequestSchema), async (req, res) => {
        const data = orderItemsDTORequestSchema.parse(req);
        const order = await addOrderItems(data.params.id, data.body);

        if(order!=null) res.status(201).json(order);
        else res.status(500).json({message: "Creation failed"});
    });

    ordersRouter.delete("/:id", validate(idUUIDRequestSchema), async (req, res) => {
        const data = idUUIDRequestSchema.parse(req);
        const order = await deleteOrder(data.params.id);
        if (order != null) {
          res.json(order);
        } else {
          res.status(404).json({ message: "Order Not Found" });
        }
      });

    ordersRouter.delete(
        "/:id/items/:itemId",
        validate(idItemIdUUIDRequestSchema),
        async (req, res) => {
          const data = idItemIdUUIDRequestSchema.parse(req);
          const order = await deleteOrderItem(data.params.id, data.params.itemId);
          if (order != null) {
            if (req.headers["accept"] == "application/xml") {
              res.status(201).send(create().ele("order", order).end());
            } else {
              res.status(201).json(order);
            }
          } else {
            if (req.headers["accept"] == "application/xml") {
              res
                .status(404)
                .send(
                  create().ele("error", { message: "Order or item not found" }).end()
                );
            } else {
              res.status(404).json({ message: "Order or item not found" });
            }
          }
        }
      );