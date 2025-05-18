/**
 * Handles : 
 *  - login state
 *  - user identity
 *  - token handling 
 *  - login and logout logic
 */

/**
 * Why do we do this?
 * 
 * Because multiple components might need to: 
 *  - Check if a user is logged in
 *  - Display the username etc 
 * 
 * so stores/auth.ts acts as the single source of truth for the user's session
 */