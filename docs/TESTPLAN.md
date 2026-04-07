# COBOL Application Test Plan

This test plan covers the current business logic of the COBOL application in `src/cobol`. It is designed for validation with business stakeholders and can be used later as a basis for unit and integration tests in the Node.js application.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|--------------|-----------------------|----------------|------------|-----------------|---------------|--------------------|----------|
| TC01 | Display main menu options | Application started | 1. Start the application
2. Observe the menu | The menu shows options: View Balance, Credit Account, Debit Account, Exit |  |  |  |  |
| TC02 | View current balance | Application started | 1. Choose option 1
2. Observe the displayed balance | Displays "Current balance: 1000.00" (initial balance) |  |  |  |  |
| TC03 | Credit account with a valid amount | Application started | 1. Choose option 2
2. Enter amount: 200.00
3. Observe confirmation and new balance | Displays "Amount credited. New balance: 1200.00" |  |  |  |  |
| TC04 | Debit account with a valid amount less than balance | Application started | 1. Choose option 3
2. Enter amount: 500.00
3. Observe confirmation and new balance | Displays "Amount debited. New balance: 500.00" if starting from 1000.00 |  |  |  |  |
| TC05 | Attempt debit with insufficient funds | Application started | 1. Choose option 3
2. Enter amount: 1500.00
3. Observe response | Displays "Insufficient funds for this debit." and balance remains unchanged |  |  |  |  |
| TC06 | Invalid menu selection handling | Application started | 1. Enter choice 5 (or any invalid input)
2. Observe response | Displays "Invalid choice, please select 1-4." and returns to menu |  |  |  |  |
| TC07 | Exit the application | Application started | 1. Choose option 4
2. Observe response | Displays "Exiting the program. Goodbye!" and terminates |  |  |  |  |
| TC08 | Read balance after credit / debit operations | Application started with prior operations | 1. Perform credit or debit
2. Choose option 1 to view balance | Balance reflects the last committed amount after write |  |  |  |  |
| TC09 | Data persistence within session | Application started | 1. Credit or debit a valid amount
2. Perform another read or transaction without restarting | The updated balance is used for the next operation within the same program run |  |  |  |  |
| TC10 | No negative balance allowed | Application started | 1. Choose option 3
2. Enter debit amount greater than current balance | Debit is rejected with insufficient funds message; balance remains unchanged |  |  |  |  |
