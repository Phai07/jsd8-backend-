import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    // Destructure ข้อมูล
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    
// ควบคุม logic ที่อัพเดทรูปยังไง และจัดเก็บข้อมูล img แต่ละตัว 
// request รูปจาก file และเลือกใช้ในการเก็บไปใน array ถ้ามี img ให้เข้าไปเอาใน position แรก
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

      //ตัวแปรประกาศขึ้นมาเพื่อเก็บ img ที่ upload เข้าไป  ถ้าเป็น undefined จะ filter ออกไป
    const images = [image1, image2, image3, image4].filter(

      //จะเอาแค่ item ที่ไม่ใช่ undefined
      (item) => item !== undefined
    );

    //ติดต่อไปที่ cloudinary จะมีพวก build method
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        // ไปเอา file ที่ถูกต้องได้
        let result = await cloudinary.uploader.upload(item.path, {
          //ช่วยบอกด้วยสิ่งที่ส่งเข้าไปคืออะไร cloudinary
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

//การเตรียมไปเก็บ mongoDB
    const productData = {
      name,      //ข้อมูลได้จาก adminuser
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,   //เอา img จากcloudinary
      date: Date.now(),  //บันทึกวันเวลา
    };

    console.log(productData);

    //Contact mongoDB
    const product = new productModel(productData);
    // และให้ save ที่ database ด้วย
    await product.save();

    //สำเร็จก็จะมี respond return message "Product Added"
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for list product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
