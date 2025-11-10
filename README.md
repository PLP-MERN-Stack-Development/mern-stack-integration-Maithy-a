# MERN Stack Integration

This assignment focuses on building a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates seamless integration between front-end and back-end components.

## Project Overview

You will build a blog application with the following features:
1. RESTful API with Express.js and MongoDB
2. React front-end with component architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization
5. Advanced features like image uploads and comments

## Project Structure

```
mern-blog/
├── client/                
│   ├── public/             
│   ├── src/                
│   │   ├── components/    
│   │   ├── pages/        
│   │   ├── hooks/         
│   │   ├── services/      
│   │   ├── context/        
│   │   └── App.jsx        
│   └── package.json       
├── server/                
│   ├── config/           
│   ├── controllers/    
│   ├── models/          
│   ├── routes/           
│   ├── middleware/       
│   ├── utils/            
│   ├── server.js          
│   └── package.json      
└── README.md             
```

## Getting Started

1. Accept clone the Repository
```JS
git clone https://github.com/Maithy-a/mern-stack-integration-Maithy-a.git
cd mern-stack-integration-Maithy-a
```
2. Install dependancies 
```JS
cd server
npm install
```
```JS
cd client
npm install
```

3. Create a .env file in the server
```JS
PORT=5000
MONGODB_URI=your_mongo_db_url
JWT_SECRET=your_JWT_secret
JWT_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```
5. Create a .env file in the client folder root 
```JS
VITE_API_URL=http://localhost:5000/api
```
6. Run the application
```JS
cd client
npm run dev
```
```JS
cd server
npm run dev
```
7. Open `http://localhost:3000` in your browser to view the project.

## Screenshot
<img src="client/public/image.png">

