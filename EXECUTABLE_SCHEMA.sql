-- EXECUTABLE POS SYSTEM SCHEMA
-- This schema is properly ordered to respect foreign key dependencies

-- Create the public schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (foundational table)
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  username character varying NOT NULL UNIQUE,
  email character varying UNIQUE,
  password_hash text,
  first_name character varying,
  last_name character varying,
  role character varying NOT NULL DEFAULT 'cashier'::character varying CHECK (role::text = ANY (ARRAY['admin'::character varying, 'manager'::character varying, 'cashier'::character varying, 'staff'::character varying]::text[])),
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id)
);

-- Categories table
CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Suppliers table
CREATE TABLE public.suppliers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  contact_person character varying,
  email character varying,
  phone character varying,
  address text,
  city character varying,
  state character varying,
  zip_code character varying,
  country character varying,
  tax_id character varying,
  payment_terms character varying DEFAULT 'Net 30'::character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT suppliers_pkey PRIMARY KEY (id)
);

-- Customers table
CREATE TABLE public.customers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name character varying NOT NULL,
  last_name character varying NOT NULL,
  email character varying,
  phone character varying,
  address text,
  city character varying,
  state character varying,
  zip_code character varying,
  country character varying,
  date_of_birth date,
  loyalty_points integer DEFAULT 0,
  credit_limit numeric DEFAULT 0.00,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customers_pkey PRIMARY KEY (id)
);

-- Products table
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  category_id uuid,
  description text,
  barcode character varying UNIQUE,
  sku character varying UNIQUE,
  unit_of_measure character varying DEFAULT 'piece'::character varying,
  selling_price numeric NOT NULL DEFAULT 0.00,
  cost_price numeric NOT NULL DEFAULT 0.00,
  wholesale_price numeric DEFAULT 0.00,
  stock_quantity integer NOT NULL DEFAULT 0,
  min_stock_level integer DEFAULT 0,
  max_stock_level integer DEFAULT 10000,
  is_active boolean DEFAULT true,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

-- Discounts table
CREATE TABLE public.discounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  code character varying UNIQUE,
  description text,
  discount_type character varying NOT NULL DEFAULT 'percentage'::character varying CHECK (discount_type::text = ANY (ARRAY['percentage'::character varying, 'fixed'::character varying]::text[])),
  discount_value numeric NOT NULL,
  minimum_order_value numeric DEFAULT 0.00,
  maximum_discount_amount numeric,
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  usage_limit integer,
  used_count integer DEFAULT 0,
  apply_to character varying DEFAULT 'all'::character varying CHECK (apply_to::text = ANY (ARRAY['all'::character varying, 'specific_products'::character varying, 'specific_categories'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT discounts_pkey PRIMARY KEY (id)
);

-- Discount-Category relationship table
CREATE TABLE public.discount_categories (
  discount_id uuid NOT NULL,
  category_id uuid NOT NULL,
  CONSTRAINT discount_categories_pkey PRIMARY KEY (discount_id, category_id),
  CONSTRAINT discount_categories_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id),
  CONSTRAINT discount_categories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);

-- Discount-Product relationship table
CREATE TABLE public.discount_products (
  discount_id uuid NOT NULL,
  product_id uuid NOT NULL,
  CONSTRAINT discount_products_pkey PRIMARY KEY (discount_id, product_id),
  CONSTRAINT discount_products_discount_id_fkey FOREIGN KEY (discount_id) REFERENCES public.discounts(id),
  CONSTRAINT discount_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

-- Sales table
CREATE TABLE public.sales (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  user_id uuid,
  invoice_number character varying UNIQUE,
  sale_date timestamp with time zone DEFAULT now(),
  subtotal numeric NOT NULL DEFAULT 0.00,
  discount_amount numeric NOT NULL DEFAULT 0.00,
  tax_amount numeric NOT NULL DEFAULT 0.00,
  total_amount numeric NOT NULL DEFAULT 0.00,
  amount_paid numeric NOT NULL DEFAULT 0.00,
  change_amount numeric NOT NULL DEFAULT 0.00,
  payment_method character varying NOT NULL DEFAULT 'cash'::character varying,
  payment_status character varying NOT NULL DEFAULT 'paid'::character varying CHECK (payment_status::text = ANY (ARRAY['paid'::character varying, 'partial'::character varying, 'unpaid'::character varying, 'refunded'::character varying]::text[])),
  sale_status character varying NOT NULL DEFAULT 'completed'::character varying CHECK (sale_status::text = ANY (ARRAY['completed'::character varying, 'pending'::character varying, 'cancelled'::character varying]::text[])),
  notes text,
  reference_number character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sales_pkey PRIMARY KEY (id),
  CONSTRAINT sales_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT sales_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Sale items table
CREATE TABLE public.sale_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sale_id uuid,
  product_id uuid,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  discount_amount numeric NOT NULL DEFAULT 0.00,
  tax_amount numeric NOT NULL DEFAULT 0.00,
  total_price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sale_items_pkey PRIMARY KEY (id),
  CONSTRAINT sale_items_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id),
  CONSTRAINT sale_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

-- Purchase orders table
CREATE TABLE public.purchase_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  supplier_id uuid,
  user_id uuid,
  order_number character varying UNIQUE,
  order_date date NOT NULL,
  expected_delivery_date date,
  total_amount numeric NOT NULL DEFAULT 0.00,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'ordered'::character varying, 'received'::character varying, 'partially_received'::character varying, 'cancelled'::character varying]::text[])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT purchase_orders_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT purchase_orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Purchase order items table
CREATE TABLE public.purchase_order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  purchase_order_id uuid,
  product_id uuid,
  quantity_ordered integer NOT NULL DEFAULT 1,
  quantity_received integer NOT NULL DEFAULT 0,
  unit_cost numeric NOT NULL,
  total_cost numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id),
  CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

-- Returns table
CREATE TABLE public.returns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sale_id uuid,
  customer_id uuid,
  user_id uuid,
  return_date timestamp with time zone DEFAULT now(),
  reason character varying,
  return_status character varying NOT NULL DEFAULT 'processed'::character varying CHECK (return_status::text = ANY (ARRAY['requested'::character varying, 'approved'::character varying, 'processed'::character varying, 'rejected'::character varying]::text[])),
  total_amount numeric NOT NULL DEFAULT 0.00,
  refund_method character varying,
  refund_amount numeric NOT NULL DEFAULT 0.00,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT returns_pkey PRIMARY KEY (id),
  CONSTRAINT returns_sale_id_fkey FOREIGN KEY (sale_id) REFERENCES public.sales(id),
  CONSTRAINT returns_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT returns_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Return items table
CREATE TABLE public.return_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  return_id uuid,
  sale_item_id uuid,
  product_id uuid,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL,
  total_price numeric NOT NULL,
  reason character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT return_items_pkey PRIMARY KEY (id),
  CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id),
  CONSTRAINT return_items_sale_item_id_fkey FOREIGN KEY (sale_item_id) REFERENCES public.sale_items(id),
  CONSTRAINT return_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id)
);

-- Debts table
CREATE TABLE public.debts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  supplier_id uuid,
  debt_type character varying NOT NULL CHECK (debt_type::text = ANY (ARRAY['customer'::character varying, 'supplier'::character varying]::text[])),
  amount numeric NOT NULL,
  description text,
  due_date date,
  status character varying NOT NULL DEFAULT 'outstanding'::character varying CHECK (status::text = ANY (ARRAY['outstanding'::character varying, 'paid'::character varying, 'overdue'::character varying, 'written_off'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT debts_pkey PRIMARY KEY (id),
  CONSTRAINT debts_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT debts_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id)
);

-- Expenses table
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  category character varying NOT NULL,
  description text NOT NULL,
  amount numeric NOT NULL,
  payment_method character varying NOT NULL,
  expense_date date NOT NULL,
  receipt_url text,
  is_business_related boolean DEFAULT true,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expenses_pkey PRIMARY KEY (id),
  CONSTRAINT expenses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Reports table
CREATE TABLE public.reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  report_type character varying NOT NULL,
  title character varying NOT NULL,
  description text,
  start_date date,
  end_date date,
  file_url text,
  status character varying NOT NULL DEFAULT 'generated'::character varying CHECK (status::text = ANY (ARRAY['generated'::character varying, 'processing'::character varying, 'failed'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reports_pkey PRIMARY KEY (id),
  CONSTRAINT reports_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Access logs table
CREATE TABLE public.access_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action character varying NOT NULL,
  description text,
  ip_address character varying,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT access_logs_pkey PRIMARY KEY (id),
  CONSTRAINT access_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Customer settlements table
CREATE TABLE public.customer_settlements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  customer_id uuid,
  user_id uuid,
  amount numeric NOT NULL,
  payment_method character varying NOT NULL,
  reference_number character varying,
  notes text,
  settlement_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT customer_settlements_pkey PRIMARY KEY (id),
  CONSTRAINT customer_settlements_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id),
  CONSTRAINT customer_settlements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Supplier settlements table
CREATE TABLE public.supplier_settlements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  supplier_id uuid,
  user_id uuid,
  amount numeric NOT NULL,
  payment_method character varying NOT NULL,
  reference_number character varying,
  notes text,
  settlement_date timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT supplier_settlements_pkey PRIMARY KEY (id),
  CONSTRAINT supplier_settlements_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id),
  CONSTRAINT supplier_settlements_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Damaged products table
CREATE TABLE public.damaged_products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid,
  user_id uuid,
  quantity integer NOT NULL,
  reason character varying,
  date_reported timestamp with time zone DEFAULT now(),
  status character varying NOT NULL DEFAULT 'reported'::character varying CHECK (status::text = ANY (ARRAY['reported'::character varying, 'verified'::character varying, 'resolved'::character varying]::text[])),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT damaged_products_pkey PRIMARY KEY (id),
  CONSTRAINT damaged_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT damaged_products_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Inventory audits table
CREATE TABLE public.inventory_audits (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  product_id uuid,
  user_id uuid,
  audit_date timestamp with time zone DEFAULT now(),
  expected_quantity integer NOT NULL,
  actual_quantity integer NOT NULL,
  difference integer NOT NULL,
  reason character varying,
  notes text,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT inventory_audits_pkey PRIMARY KEY (id),
  CONSTRAINT inventory_audits_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT inventory_audits_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);