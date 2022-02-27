package main

import (
	"context"
	"fmt"
	"io/ioutil"
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
	http.HandleFunc("/posttest", func(w http.ResponseWriter, r *http.Request) {
		bodyBytes, err := ioutil.ReadAll(r.Body)
		if err != nil { log.Fatal(err) };

		bodyString := string(bodyBytes)
		fmt.Fprintf(w, string(bodyString), "test test test from go server")
	})

	fmt.Println("Server started on port", os.Getenv("SERVICE_PORT"))
	log.Fatal(http.ListenAndServe(os.Getenv("SERVICE_PORT"), nil))
}
