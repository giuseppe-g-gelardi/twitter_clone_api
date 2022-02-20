package main

import (
	"fmt"
	"log"
	"net/http"
)

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
