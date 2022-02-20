package main

import (
	"fmt"
	"log"
	"net/http"
)

type User struct {
	Id string `json:"_id"`
	Username string `json:"username"`
	Email string `json:"email"`
	Password string `json:"password"`
}

func main() {
	server()
}

func server() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello")
	})

	fmt.Println("JWT Auth server started on port 8080 ")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
