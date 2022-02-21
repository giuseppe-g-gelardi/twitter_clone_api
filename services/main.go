package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// type User struct {
// 	Id string `json:"_id"`
// 	Username string `json:"username"`
// 	Email string `json:"email"`
// 	Password string `json:"password"`
// }

func init() {
	// * load .env file
	err := godotenv.Load("../.env")
	if err != nil {fmt.Println("Error loading .env")}
	fmt.Println(".env successfully loaded")

	// * connect to database
	client, err := mongo.NewClient(options.Client().ApplyURI(os.Getenv("DB")))
	if err != nil {
		log.Fatal(err)
	}
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		log.Fatal(err)
	}
	databases, err := client.ListDatabaseNames(ctx, bson.M{})
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println(databases)
}

func main() {
	server()
}

func server() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello... from go! :D ")
	})

	fmt.Println("Server started on port", os.Getenv("SERVICE_PORT"))
	log.Fatal(http.ListenAndServe(os.Getenv("SERVICE_PORT"), nil))
}
