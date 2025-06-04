<h1 align="center">
    <img src="https://www.logotypes101.com/logos/3/0DA971A6042F6233DB0E8F41F58E9C4A/Stinger.png" width="auto" height="180" />
  <br/>
 Ecommerce Application
</h1>

<h2>📌 Description</h2>
<p>
  The Stinger is our new product. It is an ecommerce platform where you can buy clothes, shoes, and other accessories.
  <br/>
  🔗 <strong>Live Site:</strong> <a href="http://stinger-web.s3-website.eu-north-1.amazonaws.com/" target="_blank">stinger-web.s3-website.eu-north-1.amazonaws.com</a>
  <br/>
  ⚒ Stinger is under construction
</p>

<h2>🛠️ Technologies Used</h2>
<ul>
  <li> 
     <img src="https://github.com/devicons/devicon/blob/master/icons/nestjs/nestjs-original.svg" title="nestjs" alt="nestjs " width="15" height="15"/>
    <strong>NestJS:</strong> Backend framework for building scalable applications.
  </li>
  <li>
     <img src="https://github.com/devicons/devicon/blob/master/icons/react/react-original.svg" title="react" alt="react" width="15" height="15"/>
    <strong>React:</strong> A Javascript library to create UI.
  </li>
  <li>
     <img src="https://github.com/devicons/devicon/blob/master/icons/postgresql/postgresql-original.svg" title="postgresql" alt="postgresql" width="15" height="15"/>
    <strong>PostgreSQL:</strong> An SQL database.
  </li>
  <li>
     <img src="https://github.com/devicons/devicon/blob/master/icons/redis/redis-original.svg" title="redis" alt="redis" width="15" height="15"/>
    <strong>Redis:</strong> An open-source, in-memory data store that can be used as a cache, database.
  </li>
  <li>
   <img src="https://github.com/devicons/devicon/blob/master/icons/docker/docker-original.svg" title="docker" alt="docker" width="15" height="15"/>
    <strong>Docker:</strong> Containerization for deployment.</li>
</ul>

<h2>🚀 Installation</h2>

<h3>🔹 Clone the Repository</h3>
<pre><code>
$ git clone https://github.com/akhiljith77/Stinger-service.git
$ cd Stinger-service
</code></pre>

<h3>🔹 Install Dependencies</h3>
<pre><code>
$ npm install
</code></pre>

<h2>📂 Authentication Module</h2>
<p>
  The Authentication module handles user authentication. It generates JWT tokens for session management 
  and securely stores user details in PostgreSQL
</p>


<h2>📄 API Endpoints</h2>

<h3>21️⃣ User Registration</h3>
<p><strong>🔹 Endpoint:</strong> <code>POST /users</code></p>
<p><strong>🔹 Description:</strong> Handles user registration and save the details in database.</p>
<h3>🔹 Request Body</h3>
<pre><code>
{
    "name":"John Honai",
    "email":"johnhonai@gmail.com",
    "password":"andrew'spetti"
}
</code></pre>
<p><strong>🔹Success Response 🟢</strong></p>
<pre><code>
{
  message:"user registered successfully"
}
</code></pre>
<p><strong>🔹Error Response 🔴</strong></p>
<pre><code>
{
    "statusCode": 401,
    "message": "User already exist",
    "error": "UnauthorizedException"
}
</code></pre>

<h3>2️⃣ User Login</h3>
<p><strong>🔹 Endpoint:</strong> <code>POST /users/login</code></p>
<p><strong>🔹 Description:</strong> Handles user login.</p>
<h3>🔹 Request Body</h3>
<pre><code>
{
    "email":"johnhonai@gmail.com",
    "password":"andrew'scase"
}
</code></pre>
<p><strong>🔹Success Response 🟢</strong></p>
<pre><code>
{
    "message": "User login Successfully",
    "token": "eyJ*****fPs"
}
</code></pre>
<p><strong>🔹Error Response 🔴</strong></p>
<pre><code>
{
    "response": {
        "message": "Invalid credentials",
        "error": "Unauthorized",
        "statusCode": 401
    },
}
</code></pre>

<h3>3️⃣ Forgot Password</h3>
<p><strong>🔹 Endpoint:</strong> <code>POST /users/forgot-password</code></p>
<p><strong>🔹 Description:</strong> If you forgot your password, you can given the registered email and get the reset password link.</p>
<h3>🔹 Request Body</h3>
<pre><code>
{
    "email":"johnhonai@gmail.com"
}
</code></pre>
<p><strong>🔹Success Response 🟢</strong></p>
<pre><code>
{
    "message": "Password reset link sent to email",
    "link": "http://localhost:5173/reset-password/eyJ*****fPs"
}
</code></pre>
<p><strong>🔹Error Response 🔴</strong></p>
<pre><code>
{
    "response": {
        "message": "Invalid credentials",
        "error": "Unauthorized",
        "statusCode": 401
    },
}
</code></pre>

<h3>4️⃣ Reset Password</h3>
<p><strong>🔹 Endpoint:</strong> <code>PATCH /users/reset-password/:token</code></p>
<p><strong>🔹 Description:</strong> you can access this link to reset the password</p>
<h3>🔹 Request Body</h3>
<pre><code>
{
    "password":"ammachi'spetti"
}
</code></pre>
<p><strong>🔹Success Response 🟢</strong></p>
<pre><code>
{
    "message": "Password successfully reset"
}
</code></pre>
<p><strong>🔹Error Response 🔴</strong></p>
<pre><code>
{
    "statusCode": 401,
    "message": "Invalid token or expired token",
    "error": "UnauthorizedException"
}
</code></pre>

<br/>

<h2>📂 Product Module</h2>

<p>
  This is the product module where you can create new products, list all products and based on filters like search product, price range, caterogy wise. Can get single product details, update product, delete product
</p>


<h2>📄 Create Product API</h2>

<h3>🔹 Endpoint</h3>
<p><code>POST /products</code></p>

<h3>🔹 Description</h3>
<p>
  Here you can create a new product by giving details like name, description, price, category, color, image.
</p>

<h3>🔹 Request Body</h3>
<pre><code>
{
            "name": "EYEBOGLER",
            "description": "Men Shirt with Spread Collar",
            "price": 390,
            "color": "Navy",
            "size": [
                "S",
                "M",
                "L",
                "XL",
                "2XL"
            ],
            "stock": 30,
            "categoryId": "c1*********************c",
            "imageURL": "https://assets.*****.jpg"
        },
</code></pre>

<p><strong>🔹Success Response 🟢</strong></p>
<pre><code>
{
  "message":"Product created successfully"
}
</code></pre>
<p><strong>🔹Error Response 🔴</strong></p>
<pre><code>
{
    "statusCode": 400,
    "message": "name must be a string", //missing data will be displayed
    "error": "BadRequestException"
}
</code></pre>

<h2>📄 List Product API</h2>

<h3>🔹 Endpoint</h3>
<p><code>GET /products?query</code></p>

<h3>🔹 Description</h3>
<p>
   This API allows users to list all products. can give filters. Should give login token to access the api,
</p>
<pre><code>
Authorization: Bearer $token
</code></pre>

<h3>🔹 Queries</h3>
<pre><code>
search: Get product based on keyword
minPrice: Get product based on minimum price
maxPrice: Get product based on maximum price
</code></pre>

<p><strong>🔹Success Response 🟢</strong></p>
<pre><code>
[
  {
        "id": "2e*****************a3",
        "name": "EYEBOGLER",
        "description": "Men Shirt with Spread Collar",
        "price": 390,
       ...data
  },
  {
        ...data
  },
]
</code></pre>

<p><strong>🔹Error Response 🔴</strong></p>
<pre><code>
{
    "response": "Products not found",
    "status": 404,
    "message": "Products not found",
    "name": "HttpException"
}
</code></pre>



<h2>🛠️ Environment Variables</h2>
<p>Create a <code>.env</code> file and configure:</p>
<pre><code>
HOST=your_host
DBPORT=your_port
DB_USERNAME=your_username
DB_PASSWORD=your_password
DATABASE=your_database_name
WT_SECRET=your_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
</code></pre>

<h2>💻 Running the Application</h2>
<pre><code>
# Start the server in development mode
$ npm run start:dev
</code></pre>

<h2>🐳 Running with Docker</h2>
<p>If you want to run the application inside a Docker container:</p>
<pre><code>
# Build the Docker image
$ docker build -t stinger-service.

# Run the container
$ docker run -p 5000:5000 --env-file .env stinger-service

<h2>🧪 Testing the Deployed API</h2>
<p>
  The API is currently deployed on Amazon EC2 and database on RDS
</p>
</code></pre>

