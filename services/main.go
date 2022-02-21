package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

// type User struct {
// 	Id string `json:"_id"`
// 	Username string `json:"username"`
// 	Email string `json:"email"`
// 	Password string `json:"password"`
// }

func init() {
	err := godotenv.Load("../.env")
	if err != nil { 
		fmt.Println("Error loading .env")
	}
	fmt.Println("JWT Secret Key:", os.Getenv("JWT"))
}

func main() {
	server()
}

func server() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello... from go ;) ")
	})

	fmt.Println("JWT Auth server started on port 8080 ")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
