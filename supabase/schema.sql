-- ==============================================================================
-- OROX DATABASE INFRASTRUCTURE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================
-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ------------------------------------------------------------------------------
-- 1. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  offerprice numeric,
  images text[] NOT NULL DEFAULT '{}'::text[],
  sizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  returnpolicy text NOT NULL,
  brand text,
  category text,
  tags text[] DEFAULT '{}'::text[],
  tags_text text,
  stock_qty integer DEFAULT 0,
  seller_code_b text,
  prefix_a text,
  day_dd text,
  month_mm text,
  year_d integer,
  sequence_e bigint,
  search_text text,
  searchable_text tsvector,
  search_vector tsvector,
  CONSTRAINT products_pkey PRIMARY KEY (id)
);

-- ------------------------------------------------------------------------------
-- 2. COUPONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  type text DEFAULT 'percentage'::text,
  discount_percent integer CHECK (discount_percent > 0 AND discount_percent <= 100),
  discount_amount numeric,
  free_delivery boolean DEFAULT false,
  expiry_date timestamp without time zone NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT coupons_pkey PRIMARY KEY (id)
);

-- ------------------------------------------------------------------------------
-- 3. ORDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id text NOT NULL,
  user_id uuid,
  name text NOT NULL,
  address text NOT NULL,
  phone text NOT NULL,
  alt_phone text,
  total_amount numeric NOT NULL,
  payment_method text NOT NULL,
  discount numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'PLACED'::text,
  coupon_code text,
  razorpay_order_id text,
  razorpay_payment_id text,
  paid_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ------------------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS order_items_id_seq;

CREATE TABLE IF NOT EXISTS public.order_items (
  id bigint NOT NULL DEFAULT nextval('order_items_id_seq'::regclass),
  order_id text,
  product_id uuid NOT NULL,
  size text,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------------------------
-- 5. SELLERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sellers (
  email text NOT NULL,
  seller_code_b text NOT NULL,
  allowed_prefixes_a text[] NOT NULL DEFAULT '{}'::text[],
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT sellers_pkey PRIMARY KEY (email)
);

-- ------------------------------------------------------------------------------
-- 6. INFLUENCERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.influencers (
  email_id text NOT NULL,
  coupons text[],
  CONSTRAINT influencers_pkey PRIMARY KEY (email_id)
);

-- ------------------------------------------------------------------------------
-- 7. CART ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  size text,
  quantity integer NOT NULL DEFAULT 1,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cart_items_pkey PRIMARY KEY (id),
  CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_product_size UNIQUE (user_id, product_id, size)
);

-- ------------------------------------------------------------------------------
-- 8. CONTACT INQUIRIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  topic text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT contact_inquiries_pkey PRIMARY KEY (id)
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders (razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_products_tags_array ON public.products USING gin (tags);
CREATE INDEX IF NOT EXISTS idx_products_tags_trgm ON public.products USING gin (tags_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON public.products USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_search_idx ON public.products USING gin (searchable_text);
CREATE INDEX IF NOT EXISTS products_search_text_idx ON public.products USING gin (search_vector);

-- ==============================================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Update orders.updated_at timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_orders_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_orders_updated_at_trigger ON public.orders;
CREATE TRIGGER update_orders_updated_at_trigger
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_orders_updated_at();

-- Update products tags_text trigger function
CREATE OR REPLACE FUNCTION public.update_tags_text()
RETURNS trigger AS $$
BEGIN
  IF NEW.tags IS NOT NULL THEN
    NEW.tags_text = array_to_string(NEW.tags, ' ');
  ELSE
    NEW.tags_text = '';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_tags_text ON public.products;
CREATE TRIGGER trg_update_tags_text
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_tags_text();

-- Update products search vectors trigger functions
CREATE OR REPLACE FUNCTION public.products_search_vector_update()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('simple', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.brand, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('simple', coalesce(NEW.tags_text, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_search_vector_trigger ON public.products;
CREATE TRIGGER products_search_vector_trigger
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.products_search_vector_update();

CREATE OR REPLACE FUNCTION public.products_tsvector_trigger()
RETURNS trigger AS $$
BEGIN
  NEW.searchable_text :=
    setweight(to_tsvector('english', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.brand, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.tags_text, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tsvectorupdate ON public.products;
CREATE TRIGGER tsvectorupdate
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.products_tsvector_trigger();

-- Search functions
CREATE OR REPLACE FUNCTION public.search_products(
  q text,
  cat text DEFAULT NULL::text,
  min_price integer DEFAULT NULL::integer,
  max_price integer DEFAULT NULL::integer,
  size_filter text DEFAULT NULL::text,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS SETOF public.products AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.products p
  WHERE (q IS NULL OR q = '' OR p.search_vector @@ websearch_to_tsquery('simple', q) OR p.name ILIKE ('%' || q || '%'))
    AND (cat IS NULL OR p.category ILIKE cat)
    AND (min_price IS NULL OR coalesce(p.offerprice, p.price) >= min_price)
    AND (max_price IS NULL OR coalesce(p.offerprice, p.price) <= max_price)
    AND (size_filter IS NULL OR size_filter = ANY(p.sizes))
  ORDER BY p.id DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.search_products_with_count(
  q text,
  cat text DEFAULT NULL::text,
  min_price integer DEFAULT NULL::integer,
  max_price integer DEFAULT NULL::integer,
  size_filter text DEFAULT NULL::text,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  name text,
  description text,
  price text,
  offerprice text,
  image text,
  brand text,
  category text,
  total_count integer
) AS $$
DECLARE
  v_total integer;
BEGIN
  SELECT COUNT(*) INTO v_total
  FROM public.products p
  WHERE (q IS NULL OR q = '' OR p.search_vector @@ websearch_to_tsquery('simple', q) OR p.name ILIKE ('%' || q || '%'))
    AND (cat IS NULL OR p.category ILIKE cat)
    AND (min_price IS NULL OR coalesce(p.offerprice, p.price) >= min_price)
    AND (max_price IS NULL OR coalesce(p.offerprice, p.price) <= max_price)
    AND (size_filter IS NULL OR size_filter = ANY(p.sizes));

  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.price::text,
    p.offerprice::text,
    coalesce(p.images[1], '') as image,
    p.brand,
    p.category,
    v_total as total_count
  FROM public.products p
  WHERE (q IS NULL OR q = '' OR p.search_vector @@ websearch_to_tsquery('simple', q) OR p.name ILIKE ('%' || q || '%'))
    AND (cat IS NULL OR p.category ILIKE cat)
    AND (min_price IS NULL OR coalesce(p.offerprice, p.price) >= min_price)
    AND (max_price IS NULL OR coalesce(p.offerprice, p.price) <= max_price)
    AND (size_filter IS NULL OR size_filter = ANY(p.sizes))
  ORDER BY p.id DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- 1. cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own cart" ON public.cart_items;
CREATE POLICY "Users can view own cart" ON public.cart_items
  FOR SELECT TO public
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own cart" ON public.cart_items;
CREATE POLICY "Users can insert own cart" ON public.cart_items
  FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
CREATE POLICY "Users can update own cart" ON public.cart_items
  FOR UPDATE TO public
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own cart" ON public.cart_items;
CREATE POLICY "Users can delete own cart" ON public.cart_items
  FOR DELETE TO public
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own cart items" ON public.cart_items;
CREATE POLICY "Users can manage their own cart items" ON public.cart_items
  FOR ALL TO public
  USING (auth.uid() = user_id);

-- 2. contact_inquiries
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable insert for anonymous users" ON public.contact_inquiries;
CREATE POLICY "Enable insert for anonymous users" ON public.contact_inquiries
  FOR INSERT TO public
  WITH CHECK (true);

-- 3. coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to coupons" ON public.coupons;
CREATE POLICY "Allow public read access to coupons" ON public.coupons
  FOR SELECT TO public
  USING (true);

-- 4. orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT TO public
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders" ON public.orders
  FOR INSERT TO public
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
CREATE POLICY "Users can update own orders" ON public.orders
  FOR UPDATE TO public
  USING (auth.uid() = user_id);

-- 5. order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
CREATE POLICY "Users can view own order items" ON public.order_items
  FOR SELECT TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

-- 6. products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "Public can select products" ON public.products;
CREATE POLICY "Public can select products" ON public.products
  FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "Seller can select own products" ON public.products;
CREATE POLICY "Seller can select own products" ON public.products
  FOR SELECT TO public
  USING (true);

DROP POLICY IF EXISTS "Seller can insert own products" ON public.products;
CREATE POLICY "Seller can insert own products" ON public.products
  FOR INSERT TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Seller can update own products" ON public.products;
CREATE POLICY "Seller can update own products" ON public.products
  FOR UPDATE TO public
  USING (true);

DROP POLICY IF EXISTS "Seller can delete own products" ON public.products;
CREATE POLICY "Seller can delete own products" ON public.products
  FOR DELETE TO public
  USING (true);

-- 7. sellers & influencers
ALTER TABLE public.sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

