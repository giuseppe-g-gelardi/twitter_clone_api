package main

import (
	"fmt"
	"log"
	"net/http"
)

func server() {
	fmt.Println("JWT Auth server started on port 8080 ")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func main() {
	server()
}


