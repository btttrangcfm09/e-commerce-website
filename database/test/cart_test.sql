-- Full SQL Test File for public.update_cart_item_quantity function

-- Set up test environment (reset the database before testing)
-- These tables should already exist in your DB, but we're assuming a clean slate for testing.

BEGIN;

-- Create the necessary user for testing
-- Assumption: There is a "users" table with at least "id" and "name"
-- (Replace with actual user table definition if different)
INSERT INTO public.users (id, name) 
VALUES ('user1', 'Test User 1'), ('user2', 'Test User 2');

-- Create a test product (make sure stock is set)
INSERT INTO public.products (id, name, price, stock) 
VALUES (1, 'Test Product', 20.00, 100);  -- Product 1 with stock 100

-- Test 1: Product Exists, Valid Cart, Valid Quantity Update
-- Creating initial test data: user, product, and cart with an item

-- Create cart for 'user1'
INSERT INTO public.carts (id, customer_id) 
VALUES ('testcartid1234567', 'user1');  -- User cart

-- Add product to cart for user1 with initial quantity 10
INSERT INTO public.cart_items (id, cart_id, product_id, quantity) 
VALUES ('testitemid12345678901234', 'testcartid1234567', 1, 10);  -- Product 1 in cart with initial quantity 10

-- Now test the valid update
SELECT public.update_cart_item_quantity('user1', 1, 20);

-- Verify the quantity has been updated
SELECT quantity FROM public.cart_items 
WHERE cart_id = 'testcartid1234567' AND product_id = 1;

-- Expected: Quantity should be updated to 20

-- Cleanup
ROLLBACK;

-- Test 2: Product Exists, Valid Cart, Quantity = 0 (Delete Item)
-- Creating initial test data again
BEGIN;

-- Create cart for 'user1'
INSERT INTO public.carts (id, customer_id) 
VALUES ('testcartid1234567', 'user1');  -- User cart

-- Add product to cart for user1 with initial quantity 10
INSERT INTO public.cart_items (id, cart_id, product_id, quantity) 
VALUES ('testitemid12345678901234', 'testcartid1234567', 1, 10);  -- Product 1 in cart with initial quantity 10

-- Now test the delete (set quantity to 0)
SELECT public.update_cart_item_quantity('user1', 1, 0);

-- Verify the item is deleted
SELECT * FROM public.cart_items 
WHERE cart_id = 'testcartid1234567' AND product_id = 1;

-- Expected: The row should no longer exist

-- Cleanup
ROLLBACK;

-- Test 3: Product Does Not Exist (Exception)
-- Testing when the product does not exist
BEGIN;

-- Create cart for 'user1'
INSERT INTO public.carts (id, customer_id) 
VALUES ('testcartid1234567', 'user1');  -- User cart

-- Trying to update a non-existent product (product_id 999 does not exist)
BEGIN
    PERFORM public.update_cart_item_quantity('user1', 999, 10);  -- Product 999 does not exist
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Caught exception: %', SQLERRM;  -- Expected exception message
END;

-- Expected: 'Product with id 999 does not exist'

-- Cleanup
ROLLBACK;

-- Test 4: Negative Quantity (Exception)
-- Testing when the quantity is negative
BEGIN;

-- Create cart for 'user1'
INSERT INTO public.carts (id, customer_id) 
VALUES ('testcartid1234567', 'user1');  -- User cart

-- Add product to cart for user1 with initial quantity 10
INSERT INTO public.cart_items (id, cart_id, product_id, quantity) 
VALUES ('testitemid12345678901234', 'testcartid1234567', 1, 10);  -- Product 1 in cart with initial quantity 10

-- Now test invalid quantity (negative value)
BEGIN
    PERFORM public.update_cart_item_quantity('user1', 1, -5);  -- Negative quantity
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Caught exception: %', SQLERRM;  -- Expected exception message
END;

-- Expected: 'Desired quantity must be non-negative'

-- Cleanup
ROLLBACK;

-- Test 5: Desired Quantity Exceeds Available Stock (Exception)
-- Testing when the quantity exceeds available stock
BEGIN;

-- Create cart for 'user1'
INSERT INTO public.carts (id, customer_id) 
VALUES ('testcartid1234567', 'user1');  -- User cart

-- Create product with stock 10
INSERT INTO public.products (id, name, price, stock) 
VALUES (1, 'Test Product', 20.00, 10);  -- Product 1 with stock 10

-- Add product to cart for user1 with initial quantity 5
INSERT INTO public.cart_items (id, cart_id, product_id, quantity) 
VALUES ('testitemid12345678901234', 'testcartid1234567', 1, 5);  -- Product 1 in cart with initial quantity 5

-- Now test invalid quantity (exceeds stock)
BEGIN
    PERFORM public.update_cart_item_quantity('user1', 1, 15);  -- Desired quantity exceeds stock (10)
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Caught exception: %', SQLERRM;  -- Expected exception message
END;

-- Expected: 'Desired quantity (15) exceeds available stock (10) for product_id=1'

-- Cleanup
ROLLBACK;

-- Test 6: No Cart Exists, Cart Created for User
-- Testing when there is no cart for a user and the system should create one
BEGIN;

-- Try updating cart item for 'user2' (user without cart)
SELECT public.update_cart_item_quantity('user2', 1, 5);

-- Verify that a cart is created for user2
SELECT * FROM public.carts WHERE customer_id = 'user2';

-- Expected: A new cart with id should be created for 'user2'

-- Cleanup
ROLLBACK;

-- Test 7: Cart Item Already Exists (Conflict Resolution)
-- Testing the conflict resolution when an item is already in the cart
BEGIN;

-- Create cart for 'user1'
INSERT INTO public.carts (id, customer_id) 
VALUES ('testcartid1234567', 'user1');  -- User cart

-- Add product to cart for user1 with initial quantity 5
INSERT INTO public.cart_items (id, cart_id, product_id, quantity) 
VALUES ('testitemid12345678901234', 'testcartid1234567', 1, 5);  -- Product 1 in cart with initial quantity 5

-- Now test updating the existing quantity (conflict resolution)
SELECT public.update_cart_item_quantity('user1', 1, 10);

-- Verify the quantity has been updated
SELECT quantity FROM public.cart_items 
WHERE cart_id = 'testcartid1234567' AND product_id = 1;

-- Expected: Quantity should be updated to 10

-- Cleanup
ROLLBACK;

-- Final Commit: If everything runs fine, commit the changes (none here as we use ROLLBACK for cleanup)
COMMIT;
