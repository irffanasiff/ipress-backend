import mongoose from 'mongoose';

// a printing product schema is created
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    fields: [
      {
        name: {
          type: String,
          required: true,
        },
        placeholder: {
          type: String,
          required: true,
        },
      },
    ],
    browseDesign: {
      type: Boolean,
      required: true,
    },
    uploadDesign: {
      type: Boolean,
      required: true,
    },
    designs: [
      {
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// a product model is exported
export default mongoose.model('Product', productSchema);
