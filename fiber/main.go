package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v4"
)

type User struct {
	Id string `json:"id"`
	Email string `json:"email"`
}

func main() {
	app := fiber.New()

	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	app.Post("/test", func(c *fiber.Ctx) error {
		req := new(User)
		if err := c.BodyParser(req); err != nil {
			return err
		}
		user := &User{
			Id:     req.Id,
			Email:  req.Email,
		}
		token, err := generateToken(*user)
		if err != nil {
			return err
		}

		return c.JSON(fiber.Map{"token": token})
	})

  app.Listen(":8080")
}

func generateToken(user User) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = user.Id
	claims["user_email"] = user.Email
	t, err := token.SignedString([]byte("secret"))
	if err != nil {
		return "", err
	}

	return t, nil
}

// app.Get("/test", func(c *fiber.Ctx) error {
	// 	body := c.Body()
	// 	return c.SendString(string(body))
	// })

	// func generateToken(user User) (string, int64, error) {
	// 	exp := time.Now().Add(time.Minute * 30).Unix()
	// 	token := jwt.New(jwt.SigningMethodHS256)
	// 	claims := token.Claims.(jwt.MapClaims)
	// 	claims["user_id"] = user.Id
	// 	claims["user_email"] = user.Email
	// 	claims["exp"] = exp
	// 	t, err := token.SignedString([]byte("secret"))
	// 	if err != nil {
	// 		return "", 0, err
	// 	}
	
	// 	return t, exp, nil
	// }

		// return c.JSON(fiber.Map{"token": token, "exp": exp, "user": user})
