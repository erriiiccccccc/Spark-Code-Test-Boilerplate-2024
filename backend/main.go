package main

import "net/http"
import "fmt"
import "encoding/json"

var todos []map[string]interface{}

func main() {
	http.HandleFunc("/add", handleCORS(PostTodos))
	http.HandleFunc("/todos", handleCORS(GetTodos))

	fmt.Println("SERVER START")
	http.ListenAndServe(":8080", nil)
}

// To stop CORS from blocking 
func handleCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

// Add a todo to memory
func PostTodos(w http.ResponseWriter, r *http.Request) {
	var requestData map[string]interface{}

	// Input validation
	if err := json.NewDecoder(r.Body).Decode(&requestData); err != nil {
		http.Error(w, "Invalid JSON format", http.StatusBadRequest)
		return
	}

	todos = append(todos, requestData)

	// success message for debugging
	response := map[string]interface{}{
		"message": "Todo added!!!",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Retrieve all todo items in the memory
func GetTodos(w http.ResponseWriter, r *http.Request) {
	// to show all the retrieved todo items
	response := map[string]interface{}{
		"message": "All todos retrieved successfully",
		"data":    todos,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

