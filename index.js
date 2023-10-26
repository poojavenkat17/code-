const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

mongoose.connect('mongodb+srv://yuvaraj0313:nlPvjLZbt8gY42OX@cartyy.mpvbcai.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const elements=new mongoose.Schema({
name:String,
price:Number,
images: {
  data: Buffer,
  contentType: String
}
 
})

const Product = mongoose.model('elements', elements);
const Marriage = new mongoose.Schema({
    name:String,
    date:Date,
  event:String,
  location:String,
  days:Number,
  mahal:String,
  
  images: [
    {
      name: String,
      data: Buffer,
    },
  ],
});

const marriageImage = mongoose.model('marriage', Marriage);



const baby = new mongoose.Schema({
    name:String,
    date:Date,
  event:String,
  location:String,
  days:Number,
  mahal:String,
  
  images: [
    {
      name: String,
      data: Buffer,
    },
  ],
});

const babyImage = mongoose.model('baby', baby);

const loginSchema= new mongoose.Schema({
  Username:{type:String},
  Email:{type:String},
  Password:{type:String},
})
const Login = mongoose.model('login', loginSchema
);



app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(__dirname + '/public'));





























app.get('/imageupload', (req, res) => {
  
  res.render('imageadd');
});

app.post('/imageupload', upload.array('images', 5), async (req, res) => {
  try {
    const images = req.files;
    const name=req.body.name;
    const days=req.body.date;
   const event=req.body.event;
   
console.log(event)
  if (event=="Wedding"){
    const imageDocument = new marriageImage({
      event:event,
      name:name,
      date:days,
  
   
      
    });
   
    images.forEach((image) => {
      
      imageDocument.images.push({
        name: image.originalname,
        data: image.buffer,
      });
    });

 
    await imageDocument.save();


  }
  if (event=="Baby photography"){
    const imageDocument = new babyImage({
      event:event,
      
      name:name,
      date:days,
  
    
    });
   
    images.forEach((image) => {
      
      imageDocument.images.push({
        name: image.originalname,
        data: image.buffer,
      });
    });

 
    await imageDocument.save();


  }
    
    res.redirect('/successimage');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});








app.get('/marriage', async (req, res) => {
    try {
   
        const imageDocument = await marriageImage.find();
        console.log(imageDocument)
        
        res.render('moments.ejs', { imageDocument });
      } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
      }
});
app.get('/baby', async (req, res) => {
  try {
   
    const imageDocument = await babyImage.find();
    console.log(imageDocument)
  
    res.render('moments.ejs', { imageDocument });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});





app.get('/view/:fileId', async (req, res) => {
  fileId = req.params.fileId;
  console.log(fileId)
  try {
      const item = await babyImage.findOne({_id:fileId}) ||  await marriageImage.findOne({_id:fileId});
       console.log(item)
      const images=item.images
      console.log(images.length)
      if (!item) {
          return res.status(404).send('File not found');
      }
   
      await res.render('inside.ejs', {item , images});
      
      
  } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred.');
  }
});



///Login

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/login', async (req, res) => {
  
  try {
    const textToDisplay = "";
    await res.render('login' ,{textToDisplay});
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/login', async (req, res) => {


  try {
    
    const Email = req.body.Email;
    const Password=req.body.Password;
    const use=req.body.userType;
    const secretkey=req.body.secretKey;
    
    const user = await Login.findOne({Email:Email}) ;
    const user_pass = await Login.findOne({Password:Password}) ;
    console.log(user)
    
   
    if (secretkey==="zappy123" && user && user_pass && use==='Admin') {
      return res.redirect('/admin');
      
    } 
    if (user && user_pass && secretkey!=="zappy123" && use==='Admin'){
      const textToDisplay = "SecretKey Entered Wrong";
       await res.render('login', {textToDisplay});
      
      
      
    }
    if(user && user_pass && use==='User'){
      return res.redirect('/sell')
    }
    else{
      const textToDisplay = "You are Not registred";
      await res.render('login', {textToDisplay});

     
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
}
  )

  
    
app.get('/registeredlogin', async (req, res) => {
  
  try {
    const textToDisplay = "";
    await res.render('registeredlogin' ,{textToDisplay});
    
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});


app.post('/registeredlogin', async (req, res) => {


  try {
    
    const Email = req.body.Email;
    const Password=req.body.Password;
    const use=req.body.userType;
    const secretkey=req.body.secretKey;
    
    const user = await Login.findOne({Email:Email}) ;
    const user_pass = await Login.findOne({Password:Password}) ;
    console.log(user)
    
   
    if (secretkey==="zappy123" && user && user_pass) {
      return res.redirect('/admin');
      
    } 
    if (user && user_pass && secretkey!=="zappy123" && use==='Admin'){
      const textToDisplay = "SecretKey Entered Wrong";
       await res.render('login', {textToDisplay});
      
      
      
    }
    if(user && user_pass && use==='User'){
      return res.redirect('/sell')
    }
    else{
      const textToDisplay = "You are Not registred";
      await res.render('login', {textToDisplay});

     
    }
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
}
  )


  
  app.get('/register', async (req, res) => {
  
    try {
      const textToDisplay = "";
     await res.render('reg', {textToDisplay});
    
      
      
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });
  
  app.post('/register', async (req, res,next) => {
    try{
   const username=req.body.Username
   const email=req.body.Email
   const password=req.body.Password
  
   const newLogin = new Login({
    Username:username,
    Email:email,
    Password:password
    
  });
  await newLogin.save();
  
  
  // const textToDisplay = "You are registred ";
  await res.render('registeredlogin', { textToDisplay: "You are registred " });
  
  
  
  
    }
    catch (error) {
      console.error(error);
      res.status(500).send('An error occurred.');
  }
  });




// delete
app.get('/', (req, res) => {
  res.render('index');
});
app.get('/moments', (req, res) => {
  res.render('main');
});
app.get('/about', (req, res) => {
  res.render('about');
});
app.get('/contactus', (req, res) => {
  res.render('contactus');
});
app.get('/successimage', (req, res) => {
  res.render('sucessimage');
});
app.get('/successproduct', (req, res) => {
  res.render('sucessproduct');
});

app.get('/inside', (req, res) => {
  res.render('inside');
});


app.get('/imagedelete', (req, res) => {
  
  res.render('maindelete');
});
app.get('/admin', (req, res) => {
  
  res.render('admin');
});








app.get('/marriagedelete', async (req, res) => {
  try {
 
      const imageDocument = await marriageImage.find();
      console.log(imageDocument)
      
      res.render('imagedelete', { imageDocument });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
});
app.get('/babydelete', async (req, res) => {
try {
 
  const imageDocument = await babyImage.find();
  console.log(imageDocument)
  
  res.render('imagedelete', { imageDocument });
} catch (error) {
  console.error(error);
  res.status(500).send('Server error');
}
});

app.get('/remove_cards/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);

  try {
    if (!fileId) {
      return res.status(404).send('File not found');
    }

    const babyImageDeletion = await babyImage.deleteOne({ _id: fileId });
    const marriageImageDeletion = await marriageImage.deleteOne({ _id: fileId });

    if (babyImageDeletion.deletedCount > 0) {
     const imageDocument=await babyImage.find()
      return res.render('imagedelete',{imageDocument});
    } 
    if (marriageImageDeletion.deletedCount > 0) {
      const imageDocument=await marriageImage.find()
       return res.render('imagedelete',{imageDocument});
     }
    
    
    else {
      return res.status(404).send('File not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});




app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.json());



app.get('/element_add', async(request, response) => {
  
    response.render('productadd');
  });

app.post('/element_add',upload.single('images'),async(request,response)=>{
  const name=request.body.name;
  const price=request.body.price;
  
  try {
    console.log(price,name)

     const newFormData = new Product({
         name:name,
         price:price,
         images: {
          data: request.file.buffer,
          contentType: request.file.mimetype
        }
         
     });
     await newFormData.save();
     response.redirect('/successproduct');
     
 } catch (error) {
     console.error(error);
     response.status(500).send('An error occurred.');
 }
});









app.get('/sell', async(request, response) => {
  const result=await Product.find()
    response.render('product', { products: result ,cart:[]});
  });



app.post('/add_cart', async(request, response) => {


  const product_id = request.body.product_id;
  const product_name = request.body.product_name;
  const product_price = request.body.product_price;
  const result=await Product.find()
 

  const cart =  JSON.parse(request.body.cart)|| [];
console.log(cart,request.body.cart)
  let count = 0;
  for (let i = 0; i <cart.length; i++) {
    if (cart[i].product_id === product_id) {
      cart[i].quantity += 1;
      count++;
    } 
  }

  if (count === 0) {
    const cart_data = {
      product_id: product_id,
      name: product_name,
      price: parseFloat(product_price),
      quantity: 1
    };
    cart.push(cart_data);
  
  }
  console.log(cart)
  response.render('product', { products:result,cart: cart });
});




app.get('/remove_items/:productId', async (request, response) => {
  const productId = request.params.productId;
  const cart = JSON.parse(request.query.cart) || [];


  const itemToRemove = cart.find(item => item.product_id === productId);

  if (itemToRemove) {
    
    if (itemToRemove.quantity > 1) {
      itemToRemove.quantity -= 1;
    } else {
      
      const itemIndex = cart.indexOf(itemToRemove);
      cart.splice(itemIndex, 1);
    }
  }

  
  const result = await Product.find();

  response.render('product', { products: result, cart: cart });
 
});



app.get('/deleteproduct', async (req, res) => {
  try {
   
    const products = await Product.find();
    console.log(products)
    
    res.render('productdelete', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
  });

  
app.post('/deleteproduct/:fileId', async (req, res) => {
  const fileId = req.params.fileId;
  console.log(fileId);

  try {
    if (!fileId) {
      return res.status(404).send('File not found');
    }

    const elementsfinal = await Product.deleteOne({ _id: fileId });
    

   
    
     const products=await Product.find()
     return res.render('productdelete',{products});
    
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});




app.listen(8000, () => {
  console.log('Server has started on port number 3000');
});
