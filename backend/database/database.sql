create TABLE person(
    id SERIAL PRIMARY KEY,
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    pass VARCHAR(100),
    roole VARCHAR(10),
    token VARCHAR(250), 
    code VARCHAR(20)
);

create TABLE person_bufer(
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    pass VARCHAR(100),
    roole VARCHAR(10),
    code VARCHAR(10)
);

create TABLE price_formation(
    price_name VARCHAR(200),
    price_data VARCHAR(5000)
);

create TABLE orders(
    order_number VARCHAR(8),
    user_id BIGINT,
    title VARCHAR(250),
    order_description VARCHAR(2000),
    price REAL,
    current_language VARCHAR(5)
);

create TABLE current_order_number(
    order_number BIGINT
);

// Statuses
// 0: canceled,
// 1: paid,
// 2: performed,
// 3: completed,

create TABLE products(
    order_number VARCHAR(8),
    user_id BIGINT,
    title VARCHAR(250),
    order_description VARCHAR(2000),
    price VARCHAR(15),
    current_language VARCHAR(5),
    create_date VARCHAR(20), 
    create_time VARCHAR(10),
    product_status INT
);

// Statuses
// 0: canceled,
// 1: under consideration,
// 2: paid,
// 3: performed,
// 4: completed,

create TABLE other_products(
    order_number VARCHAR(8),
    user_id BIGINT,
    title VARCHAR(30),
    order_description VARCHAR(2000),
    price VARCHAR(15),
    current_language VARCHAR(5),
    create_date  VARCHAR(20),
    create_time VARCHAR(10),
    product_status INT
);