-- 1. Таблица сотрудников (для логирования created_by / finished_by)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee'
);

-- 2. Таблица позиций меню
CREATE TABLE IF NOT EXISTS menu (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_available BOOLEAN DEFAULT true
);

-- 3. Таблица ингредиентов на складе
CREATE TABLE IF NOT EXISTS warehouse (
    id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(255) NOT NULL UNIQUE,
    quantity NUMERIC(10, 3) NOT NULL DEFAULT 1 -- Храним в кг/литрах/штуках с точностью до грамма
);

-- 4. Связующая таблица: Рецепты (какие ингредиенты нужны для блюда из меню)
CREATE TABLE IF NOT EXISTS menu_ingredients (
    menu_id INT REFERENCES menu(id) ON DELETE CASCADE,
    ingredient_id INT REFERENCES warehouse(id) ON DELETE CASCADE,
    quantity_required NUMERIC(10, 3) NOT NULL, -- Сколько нужно ингредиента на 1 порцию блюда
    PRIMARY KEY (menu_id, ingredient_id)
);

-- 5. Таблица заказов
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    comments TEXT,
    payment_method VARCHAR(50) NOT NULL,
    is_priority BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'pending', -- pending, cooking, finished, cancelled
    
    -- Системные поля логирования
    created_at TIMESTAMP DEFAULT NOW(),
    modified_at TIMESTAMP DEFAULT NOW(),
    modified_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_by INT REFERENCES users(id) ON DELETE SET NULL, -- ID того, кто создал
    finished_at TIMESTAMP,                                  -- Проставляется при закрытии
    finished_by INT REFERENCES users(id) ON DELETE SET NULL  -- ID того, кто закрыл
);

-- 6. Связующая таблица: Содержимое заказа (что конкретно купили)
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INT REFERENCES menu(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0)
);
