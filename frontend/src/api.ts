// Get the API URL from environment variable
// In development with Vite proxy, this might be empty string (use relative paths)
// In production or when hosted separately, use the full URL
export const API_URL = import.meta.env.VITE_API_URL || ''

// Helper function to construct full API URLs
export const getApiUrl = (path: string): string => {
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // If API_URL is empty (using proxy), use relative paths
  // Otherwise, construct full URL
  if (API_URL) {
    return `${API_URL}/${cleanPath}`
  }
  return path
}
