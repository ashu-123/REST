import express from "express";
import { getItemDetail, getItems, upsertItem } from "./items.service";
import { validate } from "../../middleware/validation.middleware";
import { itemPOSTRequestSchema, itemPUTRequestSchema } from "../types";
import { create } from "xmlbuilder2";

export const itemsRouter = express.Router();

itemsRouter.get('/', async (req, res) => {
  const items = await getItems();
  items.forEach(item => {
    item.imageUrl = buildImageUrl(req, item.id);
  });
  if (req.headers['accept'] == 'application/xml') {
    const root = create().ele("items");
    items.forEach(item => {
      root.ele("item", item);
    });
    res.status(200).send(root.end({ prettyPrint: true }));
  }
  else {
    res.json(items);
  }
});

itemsRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const item = await getItemDetail(id);
  if (item !== null) {
    item.imageUrl = buildImageUrl(req, item.id);
    if(req.headers['accept']==="application/xml") {
      const root = create().ele("item", item);
      res.status(200).send(root.end({ prettyPrint: true}));
    }
    else res.json(item);
  }
  else {
    if(req.headers["accept"]==="application/xml") {
      res.status(404).send(create().ele("error", { message: "Item not found"}).end());
    }
    else 
    res.status(404).json({ message: "Item not found" });
  }
})

itemsRouter.post('/', validate(itemPOSTRequestSchema), async (req, res) => {
  const data = itemPOSTRequestSchema.parse(req);
  const item = await upsertItem(data.body);

  if (item !== null) {
    res.status(201).json(item);
  }
  else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

itemsRouter.put("/:id", validate(itemPUTRequestSchema), async (req, res) => {
  const data = itemPUTRequestSchema.parse(req);
  const item = await upsertItem(data.body, data.params.id);

  if (item !== null) {
    res.status(204);
  }
  else {
    res.status(404).json({ message: "item not found" });
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
