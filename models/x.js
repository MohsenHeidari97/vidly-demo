
// POST /api/returns {customerId, movieId}

// Returns 401 if client is not logged in
// Returns 400 if customerId is not provided
// Returns 400 if movieId is not provided
// Returns 404 if no rental found for this customer/movie
// Returns 400 if rental already processed
// Returns 200 if valid request
// Set the return date
// Calculate the rental fee (numberOfDays * movie.dailyRentalRate)
// Increase the stock
// Return the rental