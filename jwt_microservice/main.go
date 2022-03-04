package main

import (
	"fmt"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
)

type User struct {
	Id string `json:"id"`
}

func main() {
	// * init fiber app
	app := fiber.New()

	// * load .env file
	err := godotenv.Load("../.env")
	if err != nil {fmt.Println("Error loading .env")}
	fmt.Println(".env successfully loaded")
	
	// * endpoint to generate JWT
	app.Post("/token", func(c *fiber.Ctx) error {
		req := new(User)
		if err := c.BodyParser(req); err != nil {
			return err
		}
		user := &User{
			Id: req.Id,
		}
		token, err := generateToken(*user)
		if err != nil {
			return err
		}
		// return c.JSON(fiber.Map{"token": token})
		return c.JSON(token)
	})
	
  app.Listen(":8080")
}

func generateToken(user User) (string, error) {
	createdAt := time.Now().UTC()
	expiresIn := time.Now().Add(time.Minute  * 30).UTC()
	token := jwt.New(jwt.SigningMethodHS256)
	jwtSecretKey := os.Getenv("JWT")
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = user.Id
	claims["createdAt"] = createdAt
	claims["expiresIn"] = expiresIn
	t, err := token.SignedString([]byte(jwtSecretKey))
	if err != nil {
		return "", err
	}
	return t, nil
}

