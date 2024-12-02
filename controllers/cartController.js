// import userModel from "../models/userModel.js";

// // add products to user cart
// const addToCart = async (req, res) => {
//   try {
//     //body คือไว้เก็บข้อมูลที่ไว้ใช้ในแอพเรา ที่เก็บพวกนี้อยู่ userId, itemId, size โดยการ Destructure
//     const { userId, itemId, size } = req.body;
//     //หา useid โดยใช้คำสั้่ง findById
//     const userData = await userModel.findById(userId);

//     //มีของยู่กี่ชิ้น อะไรบ้างใน cart ใช้ let เพราะมีการเปลี่ยนแปลงอยู่ตลอด
//     let cartData = await userData.cartData;
//     //  ถ้ามีของอยู่ในตะกร้า และsize
//     if (cartData[itemId]) {
//       if (cartData[itemId][size]) {
//         cartData[itemId][size] += 1;
//       } else {
//         cartData[itemId][size] = 1; //ไม่มีการเปลลี่ยนแปลง
//       }
//       //ถ้าไม่มีตามเงื่อไขด้านบนให้ return ด้านล่าง
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][size] = 1; //ไม่มีการเปลลี่ยนแปลง
//     }

//     //เห็นคำว่า model นึกถึง mongosh(mongoDB) ให้อัพเดทสินค้าในพาสนี้
//     await userModel.findByIdAndUpdate(userId, { cartData });
//     //แล้วส่งข้อความไปบอกว่า  success: true และของ message: "Added To Cart"
//     res.json({ success: true, message: "Added To Cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // update user cart

// const updateCart = async (req, res) => {
//   try {
//     const { userId, itemId, size, quantity } = req.body;
//     //contact mongoDB เพื่อไปเอาข้อมูลมาไปใช้งานต่อ
//     const userData = await userModel.findById(userId);

//     let cartData = await userData.cartData;
//     //อัพเดท quantity ไอเทมเรา

//     cartData[itemId][size] = quantity;
//     //ส่งกลับ database
//     await userModel.findByIdAndUpdate(userId, { cartData });
//     res.json({ success: true, message: "Cart Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// // get user cart data เอาข้อมูลออกมาจาก database
// const getUserCart = async (req, res) => {
//   try {
//     //เข้าถึง body เอาข้อมูล userId ออกมาใช้งาน
//     const { userId } = req.body;
//     //contact mongoDB เพื่อไปเอาข้อมูลมาไปใช้งานต่อ
//     const userData = await userModel.findById(userId);
//     //ข้อมูล respond ได้รับกลับมา
//     let cartData = await userData.cartData;

//     res.json({ success: true, cartData });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };
//  //ส่งออก เตรียมเรียกใช้งาน
// export { addToCart, updateCart, getUserCart };
import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };