create table car
(
    id integer not null
        constraint car_pk
            primary key autoincrement,
    brand text not null,
    model text not null,
    year integer not null,
    price integer not null,
    mileage integer not null,
    description text not null
);