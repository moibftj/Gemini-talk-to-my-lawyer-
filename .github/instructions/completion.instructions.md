---
applyTo: '*Supabase functions*'
---
Provide project context and coding guidelines that AI should follow when generating code, answering questions, or reviewing changes.

## Project Context
This is a lawyer consultation app integrated with Gemini AI for generating legal drafts. It supports three user types: 'client' (end-users seeking legal advice), 'lawyer' (professionals providing services), and 'admin' (system administrators managing users and statuses).

## Coding Guidelines
- Always implement role-based access control (RBAC) for all functionalities to ensure security and proper access for each user type.
- User roles are stored in the 'users' table under a 'role' column with values: 'client', 'lawyer', 'admin'.
- Fetch user role from the database in every function requiring authentication.
- Enforce permissions strictly: e.g., only 'admin' can change statuses, 'lawyer' and 'admin' can fetch users, 'lawyer'/'admin'/'client' can generate drafts (with appropriate context).
- Use Supabase for database operations and Gemini AI for content generation.
- Handle errors gracefully and return appropriate HTTP status codes.
- Ensure all code is secure, avoiding SQL injection and unauthorized access.
- Test functionalities for all user types to confirm flawless operation.
- Follow best practices for code readability, maintainability, and performance.
- Document code with comments explaining the purpose and functionality of complex sections.
- Use environment variables for sensitive information like API keys and database credentials.
- Adhere to the project's coding style and conventions for consistency across the codebase.
- Regularly review and update the code to incorporate new features or address any security vulnerabilities.
- Collaborate with team members for code reviews and feedback to ensure high-quality code.
- Stay updated with the latest developments in Supabase and Gemini AI to leverage new features and improvements.
- Ensure compliance with legal and ethical standards when handling user data and generating legal content.
- Optimize performance for database queries and AI interactions to provide a smooth user experience.
- Maintain a clear separation of concerns in the codebase, ensuring that functions and modules have single responsibilities.
- Use version control effectively, committing changes with clear and descriptive messages.
- Implement logging for critical operations to facilitate debugging and monitoring.
- Prioritize user privacy and data protection in all aspects of the application.
- Regularly back up the database and important configurations to prevent data loss.
- make sure all the supabase functions are correctly working and deployed