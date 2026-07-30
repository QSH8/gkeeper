-- DROP TABLE IF EXISTS menu_ingredients CASCADE;
-- DROP TABLE IF EXISTS menu CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- 1. Таблица сотрудников (для логирования created_by / finished_by)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    login VARCHAR(100) NOT NULL,
    password_hash VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee'
);

-- 2. Таблица позиций меню
CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    price INT NOT NULL,
    is_available BOOLEAN DEFAULT true
);

-- 3. Таблица ингредиентов на складе
CREATE TABLE IF NOT EXISTS warehouse (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    quantity INT NOT NULL DEFAULT 1,
    units VARCHAR(20) NOT NULL DEFAULT 'шт'
);

-- 4. Связующая таблица: Рецепты (какие ингредиенты нужны для блюда из меню)
CREATE TABLE IF NOT EXISTS menu_ingredients (
    id SERIAL PRIMARY KEY,
    menu_id INT REFERENCES menu(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES warehouse(id) ON DELETE CASCADE,
    quantity_required INT NOT NULL
);

-- 5. Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    comments TEXT,
    payment_method VARCHAR(50) NOT NULL,
    is_priority BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'in_progress',
    
    -- Системные поля логирования
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finished_at TIMESTAMP WITH TIME ZONE,
    modified_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    finished_by INT REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Связующая таблица: Содержимое заказа (что конкретно купили)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INT REFERENCES menu(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);
