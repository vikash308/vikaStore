-- ==========================================
-- VIKASTORE RESET & SEED SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR
-- ==========================================

DO $$
DECLARE
  vikash_id UUID;
  admin_id UUID;
BEGIN

  -- 1. Lookup the required users
  SELECT id INTO vikash_id FROM auth.users WHERE email = 'vikash308x@gmail.com';
  -- (Change 'vp946203@gmail.com' if your admin email is different)
  SELECT id INTO admin_id FROM auth.users WHERE email = 'vp946203@gmail.com';

  -- Ensure they exist before proceeding
  IF vikash_id IS NULL THEN
    RAISE EXCEPTION 'Please sign up vikash308x@gmail.com first before running this script!';
  END IF;

  IF admin_id IS NULL THEN
    RAISE NOTICE 'Admin account (vp946203@gmail.com) not found. Skipping admin preservation.';
  END IF;

  -- 2. Clear all products (this also clears order items due to cascade)
  TRUNCATE TABLE public.products CASCADE;

  -- 3. Delete all other users EXCEPT vikash308x@gmail.com and the admin
  DELETE FROM auth.users WHERE id NOT IN (
    COALESCE(vikash_id, '00000000-0000-0000-0000-000000000000'), 
    COALESCE(admin_id, '00000000-0000-0000-0000-000000000000')
  );

  -- 4. Ensure profiles exist and set the correct roles
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (vikash_id, 'Vikash Seller', 'vikash308x@gmail.com', 'seller')
  ON CONFLICT (id) DO UPDATE SET role = 'seller', email = 'vikash308x@gmail.com';

  IF admin_id IS NOT NULL THEN
    INSERT INTO public.profiles (id, full_name, email, role)
    VALUES (admin_id, 'System Admin', 'vp946203@gmail.com', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', email = 'vp946203@gmail.com';
  END IF;

  -- 5. Insert 30 Products for vikash308x@gmail.com
  INSERT INTO public.products (seller_id, name, description, price, original_price, category, brand, stock, is_featured, is_on_sale, image) VALUES 
  (vikash_id, 'Wireless Noise-Canceling Headphones', 'Premium sound quality with active noise cancellation.', 14999, 19999, 'Electronics', 'Sony', 50, true, true, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'),
  (vikash_id, 'Smart Fitness Watch Series 5', 'Track your health, workouts, and receive notifications.', 8999, 11999, 'Electronics', 'Fitbit', 120, false, true, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'),
  (vikash_id, 'Ultra HD 4K Action Camera', 'Capture your adventures in stunning 4K resolution.', 24999, 29999, 'Electronics', 'GoPro', 30, true, false, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'),
  (vikash_id, 'Bluetooth Portable Speaker', 'Waterproof and drop-resistant speaker for outdoor parties.', 4500, 5999, 'Electronics', 'JBL', 200, false, false, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80'),
  (vikash_id, 'Gaming Mechanical Keyboard', 'RGB backlit mechanical keyboard with tactile switches.', 6500, 8500, 'Electronics', 'Razer', 80, true, true, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80'),
  (vikash_id, 'Ergonomic Office Chair', 'Adjustable lumbar support and breathable mesh.', 12000, 15000, 'Furniture', 'ErgoPro', 40, false, false, 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=800&q=80'),
  (vikash_id, 'Minimalist Wooden Desk', 'Sleek and modern desk for your home office.', 18000, 22000, 'Furniture', 'WoodCraft', 25, true, false, 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80'),
  (vikash_id, 'Leather Sofa Set', 'Premium 3-seater leather sofa.', 45000, 55000, 'Furniture', 'LuxeHome', 10, false, true, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80'),
  (vikash_id, 'Bookshelf with 5 Tiers', 'Industrial style tall bookshelf.', 7500, 9500, 'Furniture', 'HomeTrends', 60, false, false, 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&q=80'),
  (vikash_id, 'Men''s Classic Leather Jacket', 'Genuine leather jacket with a timeless design.', 5999, 8999, 'Fashion', 'UrbanStyle', 150, true, true, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80'),
  (vikash_id, 'Women''s Floral Summer Dress', 'Lightweight and breathable dress for warm days.', 2499, 3999, 'Fashion', 'Zara', 300, false, true, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80'),
  (vikash_id, 'Unisex Running Sneakers', 'Comfortable and durable sneakers for daily jogs.', 3499, 4999, 'Fashion', 'Nike', 250, true, false, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'),
  (vikash_id, 'Polarized Aviator Sunglasses', 'UV400 protection with classic aviator frames.', 1500, 2500, 'Accessories', 'RayBan', 400, false, false, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80'),
  (vikash_id, 'Leather Crossbody Bag', 'Stylish and practical bag with adjustable strap.', 3200, 4500, 'Accessories', 'Gucci', 120, true, true, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80'),
  (vikash_id, 'Smart Home Hub', 'Control your smart devices from one central hub.', 9999, 12999, 'Electronics', 'Google', 85, false, false, 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=800&q=80'),
  (vikash_id, 'Wireless Charging Pad', 'Fast wireless charger for all Qi-enabled devices.', 1999, 2999, 'Electronics', 'Anker', 500, true, true, 'https://images.unsplash.com/photo-1586816879360-004f5b0c51e3?w=800&q=80'),
  (vikash_id, 'Stainless Steel Water Bottle', 'Insulated bottle keeps drinks cold for 24 hours.', 1200, 1800, 'Accessories', 'Milton', 600, false, false, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80'),
  (vikash_id, 'Yoga Mat with Alignment Lines', 'Eco-friendly and non-slip yoga mat.', 2500, 3500, 'Accessories', 'YogaPro', 350, true, false, 'https://images.unsplash.com/photo-1592432678016-e910b06b7407?w=800&q=80'),
  (vikash_id, 'Men''s Chronograph Watch', 'Elegant watch with stainless steel strap.', 8500, 12000, 'Accessories', 'Fossil', 90, false, true, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'),
  (vikash_id, 'Women''s Silver Necklace', 'Sterling silver pendant necklace.', 4500, 6000, 'Accessories', 'Pandora', 110, true, false, 'https://images.unsplash.com/photo-1599643478514-4a4130541fb3?w=800&q=80'),
  (vikash_id, 'Smartphone Gimbal Stabilizer', 'Smooth video recording for content creators.', 8500, 11000, 'Electronics', 'DJI', 70, true, true, 'https://images.unsplash.com/photo-1586227740560-8cf2732c1531?w=800&q=80'),
  (vikash_id, 'Noise-Isolating Earbuds', 'Compact design with deep bass.', 3500, 5000, 'Electronics', 'Boat', 300, false, false, 'https://images.unsplash.com/photo-1572569432705-d68a57ba50f8?w=800&q=80'),
  (vikash_id, 'Portable SSD 1TB', 'High-speed external storage.', 11000, 14000, 'Electronics', 'Samsung', 150, true, false, 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&q=80'),
  (vikash_id, 'Mechanical Pencil Set', 'Premium metal body drafting pencils.', 1200, 1800, 'Accessories', 'Rotring', 200, false, true, 'https://images.unsplash.com/photo-1585336261022-680e2a5ce241?w=800&q=80'),
  (vikash_id, 'Leather Wallet', 'Slim bifold wallet with RFID blocking.', 2500, 3500, 'Accessories', 'Tommy Hilfiger', 250, true, false, 'https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?w=800&q=80'),
  (vikash_id, 'Canvas Tote Bag', 'Eco-friendly and spacious everyday bag.', 800, 1200, 'Accessories', 'EcoLife', 500, false, false, 'https://images.unsplash.com/photo-1597484661643-2f5fef640df1?w=800&q=80'),
  (vikash_id, 'Men''s Denim Jacket', 'Classic blue denim with a relaxed fit.', 4500, 6000, 'Fashion', 'Levi''s', 180, true, true, 'https://images.unsplash.com/photo-1495105787522-5334e3ffa0eb?w=800&q=80'),
  (vikash_id, 'Women''s Ankle Boots', 'Suede leather boots for autumn and winter.', 5500, 7500, 'Fashion', 'Clarks', 100, false, false, 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80'),
  (vikash_id, 'Unisex Graphic T-Shirt', '100% cotton with unique artist print.', 1200, 1800, 'Fashion', 'Threadless', 400, true, false, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'),
  (vikash_id, 'Modern Dining Table', 'Tempered glass top with metal legs.', 25000, 32000, 'Furniture', 'IKEA', 15, false, true, 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=800&q=80');

END $$;
