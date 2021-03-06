import express from 'express';
import SoldBy from "../models/soldByModel";
import Item from "../models/itemModel";
import { isAuth, isSeller } from '../util';
import sanitize from 'mongo-sanitize';

const router = express.Router();

//Get list of items sold by seller id
router.get("/", isAuth, isSeller, async(req, res) => {
    const sellList = await SoldBy.find({seller: sanitize(req.user.uid)}).populate('item');
    res.send(sellList);
})

//Get list of sellers that sell an item by item id
router.get("/:id", async(req, res) => {
    const soldItemId = sanitize(req.params.id);
    //added additional fields to populate
    const sellerList = await SoldBy.find({item: soldItemId}).populate('seller');
    res.send(sellerList);
})

//Get specific sold by item by seller id and item id
router.post("/cart", isAuth, isSeller, async(req, res) => {
    const seller = sanitize(req.body.seller);
    const item = sanitize(req.body.item);
    const sellList = await SoldBy.findOne({seller: seller, item: item}).populate('item').populate('seller');
    res.send(sellList);
})

//Allow seller to add item to seller list for the first time
router.post("/:id", isAuth, isSeller, async(req, res) => {
    const soldItemId = sanitize(req.params.id);
    const soldItem = await Item.findById(soldItemId);
    if (soldItem) {
        if (req.body.price < soldItem.lowestPrice) {
            soldItem.lowestPrice = req.body.price;
            await soldItem.save();
        }
        const soldBy = new SoldBy({
            item: soldItemId,
            seller: req.user.uid,
            quantity: req.body.quantity,
            price: req.body.price,
        })
        const newSoldBy = await soldBy.save();
        if (newSoldBy) return res.status(201).send({message: 'Item added to selling list', data: newSoldBy});
    }
    return res.status(500).send({message: 'Error in adding item'});
})

//Allow seller to amend item stock and price
router.put("/:id", isAuth, isSeller, async(req, res) => {
    const soldItemId = sanitize(req.params.id);
    const soldItem = await Item.findById(soldItemId);;
    const soldBy = await SoldBy.findOne({item: soldItemId, seller: sanitize(req.user.uid)});
    //console.log(req.body);
    //console.log(soldItemId);
    //console.log(soldItem);
    if (soldItem && soldBy) {
        if (req.body.price < soldItem.lowestPrice) {
            soldItem.lowestPrice = req.body.price;
            await soldItem.save();
        }
        soldBy.quantity = req.body.quantity;
        soldBy.price = req.body.price;
        const newSoldBy = await soldBy.save();
        if (newSoldBy) return res.status(201).send({message: 'Item added to selling list', data: newSoldBy});
    }
    return res.status(500).send({message: 'Error in updating item'});
})

router.delete("/:id", isAuth, isSeller, async(req, res) => {
    const soldItemId = sanitize(req.params.id);
    const soldItem = await SoldBy.findOne({item: soldItemId, seller: sanitize(req.user.uid)});
    if (soldItem) {
        await soldItem.remove();
        return res.send({message: 'Item successfully deleted'});
    }
    return res.send({message: 'Error in deleting item'});
})

export default router;

