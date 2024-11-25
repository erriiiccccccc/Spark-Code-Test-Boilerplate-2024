package main

import "net/http"
import "fmt"
import "encoding/json"

var todos []map[string]interface{}

func main() {
	http.HandleFunc("/add", PostTodos)
	http.HandleFunc("/todos", GetTodos)

	fmt.Println("SERVER START")
	http.ListenAndServe(":8080", nil)
}

// Add a todo to memory
func PostTodos(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")

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
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// to show all the retrieved todo items
	response := map[string]interface{}{
		"message": "All todos retrieved successfully",
		"data":    todos,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

