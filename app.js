require('dotenv').config();
var express = require('express');
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Customize Port
const port = process.env.PORT || 3000;


// =================================== Start DATABASE & MODEL ===================================
// Setup Sequelize connection
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgresql'
});

// Define model User
const Menu = sequelize.define('Menu', {
   id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false
   },
   picture: {
      type: DataTypes.STRING,
      allowNull: false
   },
   price: {
      type: DataTypes.INTEGER,
      allowNull: false
   }
});

// =================================== End DATABASE & MODEL ===================================


// =================================== Start ROUTES ===================================
// Autoupdate database schema
app.all('/api/autoupdate', async (req, res) => {
   try {
     await sequelize.sync({ alter: true });
     res.status(200).json({ message: "Model updated successfully" });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
});

// Get Greeting
app.get('/api/greeting', async (req, res) => {
   console.log('HIT GET /api/greeting is Start!');
   try {
      const responses = []; // fill this if needed
      const memory = {}; // fill this if needed
      const user_attributes = {}; // fill this if needed
      const quickreplies = [`About Us`, `Opening Hours`, `Menu`];

      console.log('responses = ', responses);
      console.log('memory = ', memory);
      console.log('user_attributes = ', user_attributes);
      console.log('quickreplies = ', quickreplies);
      console.log('GET /api/greeting is Success!');
      
      res.status(200).json({ success: true, responses, memory, user_attributes,  quickreplies });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
});

// About Us
app.get('/api/about_us', async (req, res) => {
   console.log('HIT GET /api/about_us is Start!');
   try {
      const src = "https://firebasestorage.googleapis.com/v0/b/restaurant-ordering-syst-2b90a.appspot.com/o/mcdonalds.jpg?alt=media&token=71547e8d-59af-46ea-b8da-1276ede3a031";
      const img = `<img src=${src} alt="Image description" style="width: 15rem; height: auto;"></img>`;
      const aboutUs = `McDonald's Indonesia hadir sejak tahun 1991, menawarkan kelezatan burger, kentang goreng, dan menu favorit lainnya dengan komitmen terhadap kualitas, pelayanan, dan kebersihan.`;

      const responses = [`<b>About Us</b> <br><br> ${aboutUs}<br>${img}`];
      const memory = {}; // fill this if needed
      const user_attributes = {}; // fill this if needed
      const quickreplies = [`About Us`, `Opening Hours`, `Menu`];

      console.log('responses = ', responses);
      console.log('memory = ', memory);
      console.log('user_attributes = ', user_attributes);
      console.log('quickreplies = ', quickreplies);
      console.log('GET /api/about_us is Success!');

      res.status(200).json({ success: true, responses, memory, user_attributes,  quickreplies });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
});

// Opening Hours
app.get('/api/opening_hours', async (req, res) => {
   console.log('HIT GET /api/opening_hours is Start!');
   try {
      const openingHours = `<br><b>Weekdays</b> (Monday until Friday): <br><b>9:00 AM - 6:00 PM</b> <br><br> <b>Weekends</b> (Saturday & Sunday): <br><b>9:00 AM - 9:00 PM</b>`;

      const responses = [`<b>Opening Hours</b><br>${openingHours}`];
      const memory = {}; // fill this if needed
      const user_attributes = {}; // fill this if needed
      const quickreplies = [`About Us`, `Opening Hours`, `Menu`];

      console.log('responses = ', responses);
      console.log('memory = ', memory);
      console.log('user_attributes = ', user_attributes);
      console.log('quickreplies = ', quickreplies);
      console.log('GET /api/opening_hours is Success!');

      res.status(200).json({ success: true, responses, memory, user_attributes,  quickreplies });
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
});

// Menu
app.post('/api/menu', async (req, res) => {
   console.log('HIT POST /api/menu is Start!');
   try {
      const {
         name,
         picture,
         price,
      } = req.body;

      if (!name || !price) {
         res.status(400).json({ success: false, msg: `This fields (name, price, picture) are required. and This fields (description, picture) are optional.` });
         return;
      }
      const payload = {
         name,
         picture,
         price,
      };
      let menu;
      try {
        const existingMenu = await Menu.findOne({ where: { name: payload.name } });
        if (existingMenu) {
          menu = await Menu.patch(payload, { where: { name: payload.name } });
        } else {
          menu = await Menu.create(payload);
        }
      } catch (error) {
        throw new Error('Failed to save menu: ' + error.message);
      }

      const responses = []; // fill this if needed
      const memory = {}; // fill this if needed
      const user_attributes = {}; // fill this if needed
      const quickreplies = []; // fill this if needed

      console.log('responses = ', responses);
      console.log('memory = ', memory);
      console.log('user_attributes = ', user_attributes);
      console.log('quickreplies = ', quickreplies);
      console.log('menu = ', menu);
      console.log('POST /api/opening_hours is Success!');

      res.status(200).json({ success: true, responses, memory, user_attributes,  quickreplies, menu });
   } catch (error) {
      res.status(400).json({ error: error.message });
   }
});

app.get('/api/menu', async (req, res) => {
   console.log('HIT GET /api/menu is Start!');
   try {
      const { category } = req.query;

      let menu;
      if (!category) {
         menu = await Menu.findAll();
         if (menu.length === 0) {
            res.status(400).json({ success: false, msg: `Tidak ada data menu yang tersedia.` });
            return;
         }
      } else {
         const categories = await Menu.findAll({
            attributes: ['category'],
            group: ['category']
         });
         const categoryList = categories.map(c => c.category).sort().reverse();
         if (!categoryList.includes(category)) {
            res.status(400).json({ success: false, msg: `Tidak ada data menu yang tersedia.` });
            return;
         }
         menu = await Menu.findAll({ where: { category: category } });
      }

      const menuList = menu.map(item => {
         const img = `<img src="${item.picture}" alt="Deskripsi gambar" style="width: 15rem; height: auto;"></img>`;
         const formattedPrice = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.price);
         return `${img} <br> <b>${item.name}</b> <br> Harga: <b>${formattedPrice}</b> <br><br>`;
      }).join('<br>');

      const responses = [`<b>Our Menu</b> <br><br> ${menuList}`];
      const memory = {}; // fill this if needed
      const user_attributes = {}; // fill this if needed
      const quickreplies = [`About Us`, `Opening Hours`, `Menu`];

      console.log('responses = ', responses);
      console.log('memory = ', memory);
      console.log('user_attributes = ', user_attributes);
      console.log('quickreplies = ', quickreplies);
      console.log('GET /api/opening_hours is Success!');

      res.status(200).json({ success: true, responses, memory, user_attributes,  quickreplies });
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
});

// Test API
app.all('/*', async function (req, res) {
   console.log("-------------- New Request --------------");
   console.log("Headers:"+ JSON.stringify(req.headers, null, 3));
   console.log("Body:"+ JSON.stringify(req.body, null, 3));
   const { min, max } = req.query;
   console.log(`Query Min: ${min}, Query Max: ${max}`);
   try {
       await sequelize.authenticate();
       console.log('Connection has been established successfully.');
   } catch (error) {
       console.error('Unable to connect to the database:', error);
   }
   res.json({ message: "Thank you for the message" });
})
// =================================== End ROUTES ===================================


// =================================== Start Server Listener ===================================
app.listen(port, function () {
   console.log(`Server listening at http://localhost:${port}`)
});
// =================================== End Server Listener ===================================