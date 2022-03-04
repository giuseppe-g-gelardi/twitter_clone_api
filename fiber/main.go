package main

import (
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
	"github.com/joho/godotenv"
)

type User struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type UserLoginRequest struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type UserRegisterRequest struct {
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"password"`
}

func main() {
	// * init fiber app
	app := fiber.New()

	// * load .env file
	err := godotenv.Load("../.env")
	if err != nil {fmt.Println("Error loading .env")}
	fmt.Println(".env successfully loaded")

	app.Get("/", func(c *fiber.Ctx) error {
	return c.SendString("Hello, World!")
	})
	
	// ! TEST endpoint to generate login token
	app.Post("/test", func(c *fiber.Ctx) error {
		req := new(User)
		if err := c.BodyParser(req); err != nil {
			return err
		}
		user := &User{
			Email:  req.Email,
			Password: req.Password,
		}
		token, err := generateToken(*user)
		if err != nil {
			return err
		}
		// return c.JSON(fiber.Map{"token": token})
		return c.JSON(token)
	})

	app.Post("/login", func(c *fiber.Ctx) error {
		req := new(UserLoginRequest)
		if err := c.BodyParser(req); err != nil { return err }

		user := &UserLoginRequest{
			Email: req.Email,
			Password: req.Password,
		}
		token, err := generateLoginToken(*user)
		if err != nil { return err }

		// return c.JSON(fiber.Map{"token": token})
		return c.JSON(token)
	})

	app.Post("/register", func(c *fiber.Ctx) error {
		req := new(UserRegisterRequest)
		if err := c.BodyParser(req); err != nil { return err }

		user := &UserRegisterRequest{
			Username: req.Username,
			Email: req.Email,
			Password: req.Password,
		}
		token, err := generateRegisterToken(*user)
		if err != nil { return err }

		// return c.JSON(fiber.Map{"token": token})
		return c.JSON(token)
	})
	
  app.Listen(":8080")
}

func generateToken(user User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	jwtSecretKey := os.Getenv("JWT")
	claims := token.Claims.(jwt.MapClaims)
	claims["user_email"] = user.Email
	claims["user_password"] = user.Password
	t, err := token.SignedString([]byte(jwtSecretKey))
	if err != nil {
		return "", err
	}
	return t, nil
}

func generateLoginToken(user UserLoginRequest) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	jwtSecretKey := os.Getenv("JWT")
	claims := token.Claims.(jwt.MapClaims)
	claims["user_email"] = user.Email
	claims["user_password"] = user.Password
	t, err := token.SignedString([]byte(jwtSecretKey))
	if err != nil {
		return "", err
	}
	return t, nil
}

func generateRegisterToken(user UserRegisterRequest) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	jwtSecretKey := os.Getenv("JWT")
	claims := token.Claims.(jwt.MapClaims)
	claims["username"] = user.Username
	claims["email"] = user.Email
	claims["password"] = user.Password
	t, err := token.SignedString([]byte(jwtSecretKey))
	if err != nil {
		return "", err
	}
	return t, nil
}




// t, err := token.SignedString([]byte("secret"))

// app.Get("/", func(c *fiber.Ctx) error {
// 	return c.SendString("Hello, World!")
// })
