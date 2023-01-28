create TABLE person(
    id SERIAL PRIMARY KEY,
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    pass VARCHAR(100),
    roole VARCHAR(10),
    token VARCHAR(250)
);

create TABLE person_bufer(
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    pass VARCHAR(100),
    roole VARCHAR(10),
    code VARCHAR(10)
);