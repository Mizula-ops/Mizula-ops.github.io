<?php

namespace App\Model;
use App\Service\Config;
class Car
{
    private ?int $id = null;
    private ?string $brand = null;
    private ?string $model = null;
    private ?int $year = null;
    private ?int $price = null;
    private ?int $mileage = null;
    private ?string $description = null;

    public function getId(): ?int{
        return $this->id;
    }
    public function setId(?int $id): Car{
        $this->id = $id;

        return $this;
    }

    public function getBrand(): ?string{
        return $this->brand;
    }

    public function setBrand(?string $brand): Car{
        $this->brand = $brand;
        return $this;
    }

    public function getModel(): ?string{
        return $this->model;
    }

    public function setModel(?string $model): Car{
        $this->model = $model;
        return $this;
    }

    public function getYear(): ?int{
        return $this->year;
    }

    public function setYear(?int $year): Car{
        $this->year = $year;
        return $this;
    }

    public function getPrice(): ?int{
        return $this->price;
    }

    public function setPrice(?int $price): Car{
        $this->price = $price;
        return $this;
    }

    public function getMileage(): ?int{
        return $this->mileage;
    }

    public function setMileage(?int $mileage): Car{
        $this->mileage = $mileage;
        return $this;
    }

    public function getDescription(): ?string{
        return $this->description;
    }

    public function setDescription(?string $description): Car{
        $this->description = $description;
        return $this;
    }

    public static function fromArray(array $array): Car{
        $car = new self();
        $car->fill($array);

        return $car;
    }

    public function fill(array $array): Car{
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['brand'])) {
            $this->setBrand($array['brand']);
        }
        if (isset($array['model'])) {
            $this->setModel($array['model']);
        }
        if (isset($array['year'])) {
            $this->setYear((int) ($array['year']));
        }
        if (isset($array['price'])) {
            $this->setPrice((int) ($array['price']));
        }
        if (isset($array['mileage'])) {
            $this->setMileage((int) ($array['mileage']));
        }
        if (isset($array['description'])) {
            $this->setDescription($array['description']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $cars = [];
        $carsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($carsArray as $carArray) {
            $cars[] = self::fromArray($carArray);
        }
        return $cars;
    }
    public static function find($id): ?Car
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $carArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $carArray) {
            return null;
        }
        $car = self::fromArray($carArray);
        return $car;
    }
    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if ($this->getId()) {
            $sql = 'UPDATE car SET brand = :brand, model = :model, year = :year, price = :price, mileage = :mileage, description = :description WHERE id = :id';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'id' => $this->getId(),
                'brand' => $this->getBrand(),
                'model' => $this->getModel(),
                'year' => $this->getYear(),
                'price' => $this->getPrice(),
                'mileage' => $this->getMileage(),
                'description' => $this->getDescription(),
            ]);
        } else {
            $sql = 'INSERT INTO car (brand, model, year, price, mileage, description) VALUES (:brand, :model, :year, :price, :mileage, :description)';
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'brand' => $this->getBrand(),
                'model' => $this->getModel(),
                'year' => $this->getYear(),
                'price' => $this->getPrice(),
                'mileage' => $this->getMileage(),
                'description' => $this->getDescription(),
            ]);
            $this->setId((int)$pdo->lastInsertId());
        }
    }
    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'DELETE FROM car WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute([
            'id' => $this->getId()
        ]);
        $this->setId(null);
        $this->setBrand(null);
        $this->setModel(null);
        $this->setYear(null);
        $this->setPrice(null);
        $this->setMileage(null);
        $this->setDescription(null);



    }
}
