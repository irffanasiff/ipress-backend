import expressAsyncHandler from "express-async-handler";
import Item from "../Models/item.model.js";
export const addItems = expressAsyncHandler(async (req, res) => {
  try {
    console.log("recieved");
    req.body.forEach(async (data) => {
      const item = new Item({ ...data });
      const createdItem = await item.save();
    });
  } catch {
    (err) => console.log(err);
  }
  res.status(201);
});
export const editItems = expressAsyncHandler(async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.body.item._id,
      {
        ...req.body.item,
      },
      function (err, docs) {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch {
    (err) => console.log(err);
  }
  res.status(201);
});
export const getItems = expressAsyncHandler(async (req, res) => {
  const items = await Item.find();
  res.status(200).json(items);
});
