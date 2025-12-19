#!/bin/bash

# create-frontend-structure.sh

# Create main source directory
mkdir -p src

# Create all directories first
directories=(
    # Assets
    "src/assets/images"
    "src/assets/icons"
    "src/assets/fonts"

    # Common Components
    "src/components/common/Button"
    "src/components/common/Input"
    "src/components/common/Table"
    "src/components/common/Modal"
    "src/components/common/Pagination"
    "src/components/common/LoadingSpinner"

    # Layout Components
    "src/components/layout/Header"
    "src/components/layout/Footer"
    "src/components/layout/Navigation"

    # Admin Components
    "src/components/admin/layout/AdminHeader"
    "src/components/admin/layout/AdminSidebar"
    "src/components/admin/layout/AdminLayout"
    "src/components/admin/dashboard/SalesChart"
    "src/components/admin/dashboard/StatsCards"
    "src/components/admin/dashboard/RecentOrders"
    "src/components/admin/products/ProductForm"
    "src/components/admin/products/ProductTable"
    "src/components/admin/products/ProductImageUpload"
    "src/components/admin/orders/OrderTable"
    "src/components/admin/orders/OrderDetails"
    "src/components/admin/users/UserTable"
    "src/components/admin/users/UserForm"

    # Feature Components
    "src/components/features/product/ProductCard"
    "src/components/features/product/ProductList"
    "src/components/features/product/ProductDetail"
    "src/components/features/cart/CartItem/CartItem"
    "src/components/features/cart/CartSummary"
    "src/components/features/cart/CartList"
    "src/components/features/checkout/CheckoutForm"
    "src/components/features/checkout/OrderSummary"
    "src/components/features/checkout/PaymentForm"

    # Hooks
    "src/hooks"

    # Pages
    "src/pages/client/Home"
    "src/pages/client/Products"
    "src/pages/client/Cart"
    "src/pages/client/Account"
    "src/pages/admin/Dashboard"
    "src/pages/admin/Products/ProductList"
    "src/pages/admin/Products/AddProduct"
    "src/pages/admin/Products/EditProduct"
    "src/pages/admin/Orders/OrderList"
    "src/pages/admin/Orders/OrderDetails"
    "src/pages/admin/Users/UserList"
    "src/pages/admin/Users/UserDetails"
    "src/pages/admin/Settings"

    # Services
    "src/services"

    # Store
    "src/store/actions"
    "src/store/reducers"

    # Utils
    "src/utils"

    # Styles
    "src/styles"

    # Routes
    "src/routes"
)

# Create directories
for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    echo "Created directory: $dir"
done

# Create common component files
for component in Button Input Table Modal Pagination LoadingSpinner; do
    touch "src/components/common/$component/$component.jsx"
    touch "src/components/common/$component/$component.module.css"
    touch "src/components/common/$component/index.js"
done

# Create layout component files
for component in Header Footer Navigation; do
    touch "src/components/layout/$component/$component.jsx"
    touch "src/components/layout/$component/$component.module.css"
    touch "src/components/layout/$component/index.js"
done

# Create hook files
hooks=("useCart.js" "useAuth.js" "useAdmin.js" "useProducts.js")
for hook in "${hooks[@]}"; do
    touch "src/hooks/$hook"
done

# Create client page files
client_pages=("Home" "Products" "Cart" "Account")
for page in "${client_pages[@]}"; do
    touch "src/pages/client/$page/$page.jsx"
    touch "src/pages/client/$page/$page.module.css"
    touch "src/pages/client/$page/index.js"
    echo "Created client page: $page"
done

# Create admin dashboard page files
touch "src/pages/admin/Dashboard/Dashboard.jsx"
touch "src/pages/admin/Dashboard/Dashboard.module.css"
touch "src/pages/admin/Dashboard/index.js"

# Create admin product pages
product_pages=("ProductList" "AddProduct" "EditProduct")
for page in "${product_pages[@]}"; do
    touch "src/pages/admin/Products/$page/$page.jsx"
    touch "src/pages/admin/Products/$page/$page.module.css"
    touch "src/pages/admin/Products/$page/index.js"
    echo "Created admin product page: $page"
done

# Create admin order pages
order_pages=("OrderList" "OrderDetails")
for page in "${order_pages[@]}"; do
    touch "src/pages/admin/Orders/$page/$page.jsx"
    touch "src/pages/admin/Orders/$page/$page.module.css"
    touch "src/pages/admin/Orders/$page/index.js"
    echo "Created admin order page: $page"
done

# Create admin user pages
user_pages=("UserList" "UserDetails")
for page in "${user_pages[@]}"; do
    touch "src/pages/admin/Users/$page/$page.jsx"
    touch "src/pages/admin/Users/$page/$page.module.css"
    touch "src/pages/admin/Users/$page/index.js"
    echo "Created admin user page: $page"
done

# Create admin settings page
touch "src/pages/admin/Settings/Settings.jsx"
touch "src/pages/admin/Settings/Settings.module.css"
touch "src/pages/admin/Settings/index.js"

# Create service files
services=("api.js" "auth.js" "products.js" "orders.js" "admin.js")
for service in "${services[@]}"; do
    touch "src/services/$service"
done

# Create store files
touch "src/store/actions/cartActions.js"
touch "src/store/actions/authActions.js"
touch "src/store/actions/adminActions.js"
touch "src/store/reducers/cartReducer.js"
touch "src/store/reducers/authReducer.js"
touch "src/store/reducers/adminReducer.js"
touch "src/store/index.js"

# Create util files
utils=("constants.js" "helpers.js" "validation.js" "permissions.js")
for util in "${utils[@]}"; do
    touch "src/utils/$util"
done

# Create style files
styles=("variables.css" "global.css" "admin.css" "mixins.css")
for style in "${styles[@]}"; do
    touch "src/styles/$style"
done

# Create route files
touch "src/routes/clientRoutes.js"
touch "src/routes/adminRoutes.js"
touch "src/routes/protectedRoute.js"

# Create admin component files
admin_components=(
    "layout/AdminHeader"
    "layout/AdminSidebar"
    "layout/AdminLayout"
    "dashboard/SalesChart"
    "dashboard/StatsCards"
    "dashboard/RecentOrders"
    "products/ProductForm"
    "products/ProductTable"
    "products/ProductImageUpload"
    "orders/OrderTable"
    "orders/OrderDetails"
    "users/UserTable"
    "users/UserForm"
)

for component in "${admin_components[@]}"; do
    base_path="src/components/admin/$component"
    component_name=$(basename "$component")
    touch "$base_path/$component_name.jsx"
    touch "$base_path/$component_name.module.css"
    touch "$base_path/index.js"
    echo "Created admin component: $component_name"
done

# Create feature component files
feature_components=(
    "product/ProductCard"
    "product/ProductList"
    "product/ProductDetail"
    "cart/CartItem"
    "cart/CartSummary"
    "cart/CartList"
    "checkout/CheckoutForm"
    "checkout/OrderSummary"
    "checkout/PaymentForm"
)

for component in "${feature_components[@]}"; do
    base_path="src/components/features/$component"
    component_name=$(basename "$component")
    touch "$base_path/$component_name.jsx"
    touch "$base_path/$component_name.module.css"
    touch "$base_path/index.js"
    echo "Created feature component: $component_name"
done

# Create client pages
client_pages=(
    "Home"
    "Products"
    "Cart"
    "Account"
)

for page in "${client_pages[@]}"; do
    base_path="src/pages/client/$page"
    touch "$base_path/$page.jsx"
    touch "$base_path/$page.module.css"
    touch "$base_path/index.js"
    echo "Created client page: $page"
done

# Create admin pages
admin_pages=(
    "Dashboard"
    "Products/ProductList"
    "Products/AddProduct"
    "Products/EditProduct"
    "Orders/OrderList"
    "Orders/OrderDetails"
    "Users/UserList"
    "Users/UserDetails"
    "Settings"
)

for page in "${admin_pages[@]}"; do
    base_path="src/pages/admin/$page"
    page_name=$(basename "$page")
    touch "$base_path/$page_name.jsx"
    touch "$base_path/$page_name.module.css"
    touch "$base_path/index.js"
    echo "Created admin page: $page_name"
done

# Create root files
touch "src/App.jsx"
touch "src/index.js"

echo "Frontend structure has been created successfully!"

# Optional: Create basic index.js exports for each component
find src -name "index.js" -exec sh -c '
    component_name=$(basename "$(dirname "{}")")
    echo "export { default } from '\''./'"$component_name"'\''" > "{}"
' \;

# Optional: Add basic content to App.jsx
cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Your routes will go here */}
      </div>
    </Router>
  );
}

export default App;
EOF

# Optional: Add basic content to index.js
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo "Basic template content has been added to App.jsx and index.js"
#!/bin/bash

# create-frontend-structure.sh

# Create main source directory
mkdir -p src

# Create all directories first
directories=(
    # Assets
    "src/assets/images"
    "src/assets/icons"
    "src/assets/fonts"

    # Common Components
    "src/components/common/Button"
    "src/components/common/Input"
    "src/components/common/Table"
    "src/components/common/Modal"
    "src/components/common/Pagination"
    "src/components/common/LoadingSpinner"

    # Layout Components
    "src/components/layout/Header"
    "src/components/layout/Footer"
    "src/components/layout/Navigation"

    # Admin Components
    "src/components/admin/layout/AdminHeader"
    "src/components/admin/layout/AdminSidebar"
    "src/components/admin/layout/AdminLayout"
    "src/components/admin/dashboard/SalesChart"
    "src/components/admin/dashboard/StatsCards"
    "src/components/admin/dashboard/RecentOrders"
    "src/components/admin/products/ProductForm"
    "src/components/admin/products/ProductTable"
    "src/components/admin/products/ProductImageUpload"
    "src/components/admin/orders/OrderTable"
    "src/components/admin/orders/OrderDetails"
    "src/components/admin/users/UserTable"
    "src/components/admin/users/UserForm"

    # Feature Components
    "src/components/features/product/ProductCard"
    "src/components/features/product/ProductList"
    "src/components/features/product/ProductDetail"
    "src/components/features/cart/CartItem/CartItem"
    "src/components/features/cart/CartSummary"
    "src/components/features/cart/CartList"
    "src/components/features/checkout/CheckoutForm"
    "src/components/features/checkout/OrderSummary"
    "src/components/features/checkout/PaymentForm"

    # Hooks
    "src/hooks"

    # Pages
    "src/pages/client/Home"
    "src/pages/client/Products"
    "src/pages/client/Cart"
    "src/pages/client/Account"
    "src/pages/admin/Dashboard"
    "src/pages/admin/Products/ProductList"
    "src/pages/admin/Products/AddProduct"
    "src/pages/admin/Products/EditProduct"
    "src/pages/admin/Orders/OrderList"
    "src/pages/admin/Orders/OrderDetails"
    "src/pages/admin/Users/UserList"
    "src/pages/admin/Users/UserDetails"
    "src/pages/admin/Settings"

    # Services
    "src/services"

    # Store
    "src/store/actions"
    "src/store/reducers"

    # Utils
    "src/utils"

    # Styles
    "src/styles"

    # Routes
    "src/routes"
)

# Create directories
for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    echo "Created directory: $dir"
done

# Create common component files
for component in Button Input Table Modal Pagination LoadingSpinner; do
    touch "src/components/common/$component/$component.jsx"
    touch "src/components/common/$component/$component.module.css"
    touch "src/components/common/$component/index.js"
done

# Create layout component files
for component in Header Footer Navigation; do
    touch "src/components/layout/$component/$component.jsx"
    touch "src/components/layout/$component/$component.module.css"
    touch "src/components/layout/$component/index.js"
done

# Create hook files
hooks=("useCart.js" "useAuth.js" "useAdmin.js" "useProducts.js")
for hook in "${hooks[@]}"; do
    touch "src/hooks/$hook"
done

# Create client page files
client_pages=("Home" "Products" "Cart" "Account")
for page in "${client_pages[@]}"; do
    touch "src/pages/client/$page/$page.jsx"
    touch "src/pages/client/$page/$page.module.css"
    touch "src/pages/client/$page/index.js"
    echo "Created client page: $page"
done

# Create admin dashboard page files
touch "src/pages/admin/Dashboard/Dashboard.jsx"
touch "src/pages/admin/Dashboard/Dashboard.module.css"
touch "src/pages/admin/Dashboard/index.js"

# Create admin product pages
product_pages=("ProductList" "AddProduct" "EditProduct")
for page in "${product_pages[@]}"; do
    touch "src/pages/admin/Products/$page/$page.jsx"
    touch "src/pages/admin/Products/$page/$page.module.css"
    touch "src/pages/admin/Products/$page/index.js"
    echo "Created admin product page: $page"
done

# Create admin order pages
order_pages=("OrderList" "OrderDetails")
for page in "${order_pages[@]}"; do
    touch "src/pages/admin/Orders/$page/$page.jsx"
    touch "src/pages/admin/Orders/$page/$page.module.css"
    touch "src/pages/admin/Orders/$page/index.js"
    echo "Created admin order page: $page"
done

# Create admin user pages
user_pages=("UserList" "UserDetails")
for page in "${user_pages[@]}"; do
    touch "src/pages/admin/Users/$page/$page.jsx"
    touch "src/pages/admin/Users/$page/$page.module.css"
    touch "src/pages/admin/Users/$page/index.js"
    echo "Created admin user page: $page"
done

# Create admin settings page
touch "src/pages/admin/Settings/Settings.jsx"
touch "src/pages/admin/Settings/Settings.module.css"
touch "src/pages/admin/Settings/index.js"

# Create service files
services=("api.js" "auth.js" "products.js" "orders.js" "admin.js")
for service in "${services[@]}"; do
    touch "src/services/$service"
done

# Create store files
touch "src/store/actions/cartActions.js"
touch "src/store/actions/authActions.js"
touch "src/store/actions/adminActions.js"
touch "src/store/reducers/cartReducer.js"
touch "src/store/reducers/authReducer.js"
touch "src/store/reducers/adminReducer.js"
touch "src/store/index.js"

# Create util files
utils=("constants.js" "helpers.js" "validation.js" "permissions.js")
for util in "${utils[@]}"; do
    touch "src/utils/$util"
done

# Create style files
styles=("variables.css" "global.css" "admin.css" "mixins.css")
for style in "${styles[@]}"; do
    touch "src/styles/$style"
done

# Create route files
touch "src/routes/clientRoutes.js"
touch "src/routes/adminRoutes.js"
touch "src/routes/protectedRoute.js"

# Create admin component files
admin_components=(
    "layout/AdminHeader"
    "layout/AdminSidebar"
    "layout/AdminLayout"
    "dashboard/SalesChart"
    "dashboard/StatsCards"
    "dashboard/RecentOrders"
    "products/ProductForm"
    "products/ProductTable"
    "products/ProductImageUpload"
    "orders/OrderTable"
    "orders/OrderDetails"
    "users/UserTable"
    "users/UserForm"
)

for component in "${admin_components[@]}"; do
    base_path="src/components/admin/$component"
    component_name=$(basename "$component")
    touch "$base_path/$component_name.jsx"
    touch "$base_path/$component_name.module.css"
    touch "$base_path/index.js"
    echo "Created admin component: $component_name"
done

# Create feature component files
feature_components=(
    "product/ProductCard"
    "product/ProductList"
    "product/ProductDetail"
    "cart/CartItem"
    "cart/CartSummary"
    "cart/CartList"
    "checkout/CheckoutForm"
    "checkout/OrderSummary"
    "checkout/PaymentForm"
)

for component in "${feature_components[@]}"; do
    base_path="src/components/features/$component"
    component_name=$(basename "$component")
    touch "$base_path/$component_name.jsx"
    touch "$base_path/$component_name.module.css"
    touch "$base_path/index.js"
    echo "Created feature component: $component_name"
done

# Create client pages
client_pages=(
    "Home"
    "Products"
    "Cart"
    "Account"
)

for page in "${client_pages[@]}"; do
    base_path="src/pages/client/$page"
    touch "$base_path/$page.jsx"
    touch "$base_path/$page.module.css"
    touch "$base_path/index.js"
    echo "Created client page: $page"
done

# Create admin pages
admin_pages=(
    "Dashboard"
    "Products/ProductList"
    "Products/AddProduct"
    "Products/EditProduct"
    "Orders/OrderList"
    "Orders/OrderDetails"
    "Users/UserList"
    "Users/UserDetails"
    "Settings"
)

for page in "${admin_pages[@]}"; do
    base_path="src/pages/admin/$page"
    page_name=$(basename "$page")
    touch "$base_path/$page_name.jsx"
    touch "$base_path/$page_name.module.css"
    touch "$base_path/index.js"
    echo "Created admin page: $page_name"
done

# Create root files
touch "src/App.jsx"
touch "src/index.js"

echo "Frontend structure has been created successfully!"

# Optional: Create basic index.js exports for each component
find src -name "index.js" -exec sh -c '
    component_name=$(basename "$(dirname "{}")")
    echo "export { default } from '\''./'"$component_name"'\''" > "{}"
' \;

# Optional: Add basic content to App.jsx
cat > src/App.jsx << 'EOF'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/global.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Your routes will go here */}
      </div>
    </Router>
  );
}

export default App;
EOF

# Optional: Add basic content to index.js
cat > src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo "Basic template content has been added to App.jsx and index.js"