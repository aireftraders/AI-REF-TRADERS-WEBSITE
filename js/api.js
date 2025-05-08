// API utility functions to connect with our serverless backend

// Base URL for API requests - change this to your deployed backend URL
const API_BASE_URL = "" // Empty string means same domain

// Function to handle API requests
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  }

  // Add authorization token if provided
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Configure request options
  const options = {
    method,
    headers,
  }

  // Add request body for non-GET requests
  if (data && method !== "GET") {
    options.body = JSON.stringify(data)
  }

  try {
    // Make the request
    const response = await fetch(`${API_BASE_URL}/api/${endpoint}`, options)
    const responseData = await response.json()

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(responseData.error || "Something went wrong")
    }

    return { success: true, data: responseData }
  } catch (error) {
    console.error("API request error:", error)
    return { success: false, error: error.message }
  }
}

// Authentication functions
async function login(email, password) {
  const result = await apiRequest("auth/login", "POST", { email, password })

  if (result.success) {
    // Store auth token and user data
    localStorage.setItem("auth_token", result.data.session.access_token)
    localStorage.setItem("user_data", JSON.stringify(result.data.user))
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userEmail", email)
  }

  return result
}

async function signup(userData) {
  return await apiRequest("auth/signup", "POST", userData)
}

async function logout() {
  // Clear auth data
  localStorage.removeItem("auth_token")
  localStorage.removeItem("user_data")
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("userEmail")

  return { success: true }
}

// Payment functions
async function initializePayment(paymentData) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest("payments/initialize", "POST", paymentData, token)
}

async function verifyPayment(reference, userId) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest("payments/verify", "POST", { reference, userId }, token)
}

// Bank account functions
async function validateBankAccount(accountData) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest("bank-accounts/validate", "POST", accountData, token)
}

// User activity functions
async function trackAdWatched(adData) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest("activities/ad-watched", "POST", adData, token)
}

async function getUserActivities(userId) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest(`users/activities?userId=${userId}`, "GET", null, token)
}

// Referral functions
async function getUserReferrals(userId) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest(`users/referrals?userId=${userId}`, "GET", null, token)
}

// Support ticket functions
async function submitSupportTicket(ticketData) {
  const token = localStorage.getItem("auth_token")
  return await apiRequest("support/tickets", "POST", ticketData, token)
}

// Export all functions
window.api = {
  login,
  signup,
  logout,
  initializePayment,
  verifyPayment,
  validateBankAccount,
  trackAdWatched,
  getUserActivities,
  getUserReferrals,
  submitSupportTicket,
}
