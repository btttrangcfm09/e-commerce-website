#!/bin/bash

# create-backend.sh
# Make directory structure
mkdir -p backend/src/{config,controllers/{admin,client},middleware/{auth,validation},models,routes/{admin,client},services,utils/{constants,helpers}} backend/uploads/{products,users}

# Create config files
touch backend/src/config/{database.js,multer.js,mail.js}

# Create admin controllers
touch backend/src/controllers/admin/{auth.controller.js,product.controller.js,order.controller.js,user.controller.js,dashboard.controller.js}

# Create client controllers
touch backend/src/controllers/client/{auth.controller.js,product.controller.js,order.controller.js,cart.controller.js,profile.controller.js}

# Create middleware files
touch backend/src/middleware/auth/{authenticate.js,authorize.js}
touch backend/src/middleware/validation/{product.validator.js,order.validator.js,user.validator.js}
touch backend/src/middleware/{upload.middleware.js,error.middleware.js}

# Create models
touch backend/src/models/{User.js,Product.js,Order.js,Cart.js,Category.js,Review.js}

# Create admin routes
touch backend/src/routes/admin/{auth.routes.js,product.routes.js,order.routes.js,user.routes.js,dashboard.routes.js}

# Create client routes
touch backend/src/routes/client/{auth.routes.js,product.routes.js,order.routes.js,cart.routes.js,profile.routes.js}
touch backend/src/routes/index.js

# Create services
touch backend/src/services/{auth.service.js,product.service.js,order.service.js,email.service.js,upload.service.js}

# Create utils files
touch backend/src/utils/constants/{roles.js,messages.js}
touch backend/src/utils/helpers/{jwt.helper.js,password.helper.js}

# Create main app file
touch backend/src/app.js

# Create root level files
touch backend/{.env,.env.example,.gitignore,package.json,README.md}

# Add basic content to .gitignore
echo "node_modules/
.env
.DS_Store
uploads/*
!uploads/products/.gitkeep
!uploads/users/.gitkeep" > backend/.gitignore

# Create .gitkeep files to maintain empty upload directories
touch backend/uploads/products/.gitkeep
touch backend/uploads/users/.gitkeep

# Add basic content to README.md
echo "# E-commerce Backend

## Setup
1. Install dependencies: \`npm install\`
2. Configure environment variables: Copy \`.env.example\` to \`.env\` and update values
3. Start server: \`npm start\`

## Project Structure
- \`src/config\`: Configuration files
- \`src/controllers\`: Request handlers
- \`src/middleware\`: Custom middleware
- \`src/models\`: Database models
- \`src/routes\`: API routes
- \`src/services\`: Business logic
- \`src/utils\`: Helper functions" > backend/README.md

# Add basic content to .env.example
echo "PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Mail Configuration
MAIL_HOST=smtp.example.com
MAIL_USER=your_email
MAIL_PASS=your_password

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password" > backend/.env.example

# Copy .env.example to .env
cp backend/.env.example backend/.env

# Add basic package.json
echo '{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "description": "E-commerce backend application",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}' > backend/package.json


echo "Backend structure created successfully!"
#!/bin/bash

# create-backend.sh
# Make directory structure
mkdir -p backend/src/{config,controllers/{admin,client},middleware/{auth,validation},models,routes/{admin,client},services,utils/{constants,helpers}} backend/uploads/{products,users}

# Create config files
touch backend/src/config/{database.js,multer.js,mail.js}

# Create admin controllers
touch backend/src/controllers/admin/{auth.controller.js,product.controller.js,order.controller.js,user.controller.js,dashboard.controller.js}

# Create client controllers
touch backend/src/controllers/client/{auth.controller.js,product.controller.js,order.controller.js,cart.controller.js,profile.controller.js}

# Create middleware files
touch backend/src/middleware/auth/{authenticate.js,authorize.js}
touch backend/src/middleware/validation/{product.validator.js,order.validator.js,user.validator.js}
touch backend/src/middleware/{upload.middleware.js,error.middleware.js}

# Create models
touch backend/src/models/{User.js,Product.js,Order.js,Cart.js,Category.js,Review.js}

# Create admin routes
touch backend/src/routes/admin/{auth.routes.js,product.routes.js,order.routes.js,user.routes.js,dashboard.routes.js}

# Create client routes
touch backend/src/routes/client/{auth.routes.js,product.routes.js,order.routes.js,cart.routes.js,profile.routes.js}
touch backend/src/routes/index.js

# Create services
touch backend/src/services/{auth.service.js,product.service.js,order.service.js,email.service.js,upload.service.js}

# Create utils files
touch backend/src/utils/constants/{roles.js,messages.js}
touch backend/src/utils/helpers/{jwt.helper.js,password.helper.js}

# Create main app file
touch backend/src/app.js

# Create root level files
touch backend/{.env,.env.example,.gitignore,package.json,README.md}

# Add basic content to .gitignore
echo "node_modules/
.env
.DS_Store
uploads/*
!uploads/products/.gitkeep
!uploads/users/.gitkeep" > backend/.gitignore

# Create .gitkeep files to maintain empty upload directories
touch backend/uploads/products/.gitkeep
touch backend/uploads/users/.gitkeep

# Add basic content to README.md
echo "# E-commerce Backend

## Setup
1. Install dependencies: \`npm install\`
2. Configure environment variables: Copy \`.env.example\` to \`.env\` and update values
3. Start server: \`npm start\`

## Project Structure
- \`src/config\`: Configuration files
- \`src/controllers\`: Request handlers
- \`src/middleware\`: Custom middleware
- \`src/models\`: Database models
- \`src/routes\`: API routes
- \`src/services\`: Business logic
- \`src/utils\`: Helper functions" > backend/README.md

# Add basic content to .env.example
echo "PORT=5000
JWT_SECRET=your_jwt_secret
NODE_ENV=development

# Mail Configuration
MAIL_HOST=smtp.example.com
MAIL_USER=your_email
MAIL_PASS=your_password

# Admin Configuration
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password" > backend/.env.example

# Copy .env.example to .env
cp backend/.env.example backend/.env

# Add basic package.json
echo '{
  "name": "ecommerce-backend",
  "version": "1.0.0",
  "description": "E-commerce backend application",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "multer": "^1.4.5-lts.1",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}' > backend/package.json


echo "Backend structure created successfully!"