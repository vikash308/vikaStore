-- ============================================================
-- BECOME A SELLER FEATURE MIGRATION
-- Run this in Supabase SQL Editor to apply changes
-- ============================================================

-- 1. ADD ROLE AND EMAIL TO PROFILES
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'pending_seller', 'seller', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Update the user creation trigger to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$;

-- Update existing admins (if you have specific admin emails, you can run an update query. Otherwise they act as customers until updated via dashboard)

-- 2. ADD SELLER_ID TO PRODUCTS
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- 3. UPDATE PROFILES RLS
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view any profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Recreate policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
-- Allow Admins to update any profile (to approve sellers)
CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. UPDATE PRODUCTS RLS
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Public can read all products
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);

-- Sellers and Admins can insert products
CREATE POLICY "Sellers and Admins can insert products" ON products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('seller', 'admin'))
);

-- Sellers can update their own products, Admins can update any
CREATE POLICY "Sellers update own, Admins update any" ON products FOR UPDATE USING (
  (auth.uid() = seller_id) OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sellers can delete their own products, Admins can delete any
CREATE POLICY "Sellers delete own, Admins delete any" ON products FOR DELETE USING (
  (auth.uid() = seller_id) OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. STORAGE BUCKET FOR PRODUCT IMAGES
-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Public product images read" ON storage.objects;
DROP POLICY IF EXISTS "Sellers and Admins can upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Sellers and Admins can delete product images" ON storage.objects;

-- Allow public read access to images
CREATE POLICY "Public product images read" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

-- Allow Sellers and Admins to insert/upload images
CREATE POLICY "Sellers and Admins can upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('seller', 'admin'))
);

-- Allow Sellers and Admins to update images
CREATE POLICY "Sellers and Admins can update product images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'product-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('seller', 'admin'))
);

-- Allow Sellers and Admins to delete images
CREATE POLICY "Sellers and Admins can delete product images" ON storage.objects FOR DELETE USING (
  bucket_id = 'product-images' AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('seller', 'admin'))
);

-- 6. SET DEFAULT ADMIN (Optional helper query)
-- Uncomment and replace with your admin's email to instantly make them an admin
-- UPDATE profiles SET role = 'admin' WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
