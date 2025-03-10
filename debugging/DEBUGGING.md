# Debugging Analysis

## Scenario 1: Authentication Middleware

-   **Breakpoint Location:** authenticate.ts, line 41
-   **Objective:** To see what information gets passed when authenticating a user

### Debugger Observations

-   **Variable States:**
-   decodedIdToken.email = "officer@example.com"
-   decodedIdToken.firebase.sign_in_provider = "password"
-   decodedIdToken.role = "officer"
-   decodedIdToken.uid = "4GWTrb0TElZmMeZ52pRBw8QltOb2"

-   **Call Stack:**
The request has just successfuly gotten past all of the errors and the user can now be authenticated.

-   **Behavior:**
The request gets passed to the next function which will be the authorizer.

### Analysis

-   What did you learn from this scenario?
I learned that the firebase sign in provider is passed as a variable.

-   Did you observe any unexpected behavior? If so, what might be the cause?
I didn't observe any unexpected behaviour.

-   Are there areas for improvement or refactoring in this part of the code?
There probably is, but I don't really know what they would be.

-   How does this enhance your understanding of the overall project?
I now know how user authentication works a little better.

## Scenario 2: Role-Based Access Control

-   **Breakpoint Location:** authorize.ts, line 38
-   **Objective:** to see what information the program uses to deny user due to insufficient role

### Debugger Observations

-   **Variable States:**
-   role = "officer"
-   uid = "4GWTrb0TElZmMeZ52pRBw8QltOb2"
-   opts.hasRole = (1) ["manager"]

-   **Call Stack:**
The user was authenticated and during authorization, his officer role was compared to the array of accepted roles.

-   **Behavior:**
Since the user's role doesn't match the accepted roles, the user is about to get denied.

### Analysis

-   What did you learn from this scenario?
I learned how to preform role based authentication through code.

-   Did you observe any unexpected behavior? If so, what might be the cause?
I did not observe any unexpected behaviour.   

-   Are there areas for improvement or refactoring in this part of the code?
None to my knowledge, but im sure there is someting.

-   How does this enhance your understanding of the overall project?
It shows me posibilities of adding many roles and managing them.

## Scenario 3: Loan Application Endpoints

-   **Breakpoint Location:** loanController.ts, line 119
-   **Objective:** To see if any authentication or authorization variables are still lingering

### Debugger Observations

-   **Variable States:**
-   loans = (0) []

-   **Call Stack:**
The user has successfully passed authentication and authorization and has successfully retrieved all the loans.   

-   **Behavior:**
The user will get a success response with the loans and a message.

### Analysis

-   What did you learn from this scenario?
I learned that the computer doesn't hold on to authentication and autorization variables after going through that process.

-   Did you observe any unexpected behavior? If so, what might be the cause?
I didn't really know what to expect. I wish I had thought more about it beforehand and made a prediction.   

-   Are there areas for improvement or refactoring in this part of the code?
I don't know, probably, it seems there is always a better way to do stuff.   

-   How does this enhance your understanding of the overall project?
It gave me an idea about how these programs manage their variables to run efficiently.