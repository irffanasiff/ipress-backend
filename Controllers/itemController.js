import expressAsyncHandler from 'express-async-handler';
import Item from '../Models/item.model.js';
import cloudinaryApi from '../Utils/cloudinaryApi.js';
export const addItems = expressAsyncHandler(async (req, res) => {
  try {
    console.log(req.user.isAdmin);
    req.body.forEach(async (data) => {
      const item = new Item({ ...data });
      const createdItem = await item.save();
    });
  } catch {
    (err) => console.log(err);
  }
  res.status(201);
});
//@desc add carousel image url, add new fields and edit existing fields
//@route PATCH /api/items/:id
//@access Admin
export const editItems = expressAsyncHandler(async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const { index, field, value, image, type, folder, price } = req.body;
      const item = await Item.findById(req.body.id);
      if (field || field === 0) {
        let arr = value.split(',').filter((i) => i && i.trim());
        if (index) item.children[index].fields[field].value = arr;
        else item.fields[field].value = arr;
        // Mongodb won't pick up such a deep change
        item.markModified('children');
        await item.save();
        const navItems = await Item.find();
        res.status(201).json(navItems);
      } else if (image && type === 'Upload') {
        cloudinaryApi.uploader
          .upload(image, {
            resource_type: 'image',
            folder: folder ? `IPRESS/${folder}` : 'IPRESS/Mockups',
          })
          .then(async (result) => {
            if (folder) {
              res.status(201).json(result);
            } else {
              let url = result.secure_url.split('upload/');
              if (index)
                item.children[index].image.push(
                  url[0] + 'upload/q_auto/' + url[1]
                );
              else item.image.push(url[0] + 'upload/q_auto/' + url[1]);
              item.markModified('children');
              await item.save();
              const navItems = await Item.find();
              res.status(201).json(navItems);
            }
          });
      } else if (image && type === 'Delete') {
        let public_id =
          image.split('/')[0] +
          '/' +
          folder +
          '/' +
          image.split('/')[2].split('.')[0];
        cloudinaryApi.uploader
          .destroy(folder ? public_id : image.split('.')[0])
          .then(async (result) => {
            if (folder) {
              res.status(201).json(result);
            } else {
              let imgArray = index
                ? item.children[index].image.filter(
                    (img) => !img.includes(image)
                  )
                : item.image.filter((img) => !img.includes(image));
              if (index) item.children[index].image = imgArray;
              else item.image = imgArray;
              // Mongodb won't pick up such a deep change
              item.markModified('children');
              await item.save();
              const navItems = await Item.find();
              res.status(201).json(navItems);
            }
          });
      } else if (price) {
        if (index) {
          item.children[index].price = price;
          item.markModified('children');
        } else {
          item.price = price;
          console.log('out');
        }
        try {
          await item.save();
          const navItems = await Item.find();
          res.status(201).json(navItems);
        } catch (e) {
          console.log(e);
        }
      }
      res.status(201);
    } else {
      res.status(404);
    }
  } catch {
    (err) => console.log(err);
  }
});
export const getItems = expressAsyncHandler(async (req, res) => {
  const items = await Item.find();
  res.status(200).json(items);
});
