## Silzila Application Installation Guide for Contributors

### Prerequisites

**For Backend**

-   **Java Development Kit (JDK)**: Ensure you have JDK 17 or higher
    installed.

-   **Maven**: Ensure you have Maven installed and configured.

-   **Git**: Ensure you have Installed git before proceeding forward.
             Please, refer [Git Installation Guide](https://docs.github.com/en/get-started/quickstart/set-up-git).

-   **VS Code / IntelliJ IDEA**: Any Java IDE for running the backend
    application.

-   **API Testing Tool**: Insomnia, Postman, or any other API testing
    tool.

**For Frontend**

-   **Node.js and NPM**: Ensure you have Node.js and NPM installed.

    -   **For Windows**: [Download and Install Node.js](https://nodejs.org/)

    -   **For macOS**: Install via Homebrew: brew install node

### Backend Installation and Setup

**Clone the Repository**

1.  Create a folder called silzila (or any name of your choice).

2.  Open your command prompt (Windows) or terminal (macOS/Linux) and
    navigate to the folder:

     > cd path/to/your/silzila/folder

3.  Clone the Silzila repository:

     > git clone https://github.com/silzila/silzila.git

**Open and Run the Application**

1.  Open the cloned repository in your IDE (e.g., VS Code / IntelliJ
    IDEA ).

2.  Navigate to the viz application within the IDE.

3.  Click the run symbol in vs code/ IntelliJ IDEA , to run the backend
    Spring boot code.


![VS Code Start](https://github.com/user-attachments/assets/2b353f7c-692c-45c6-bdcf-97cdc5c2599d)

![IntelliJ Viz app RUN](https://github.com/user-attachments/assets/4d28f0a7-7e01-4a66-a595-b249ab8aadb4)



4.  Spring boot application will run in  **http://localhost:8080**

**API Testing**

1.  Install Insomnia or any other API testing tool.

2.  Import the provided Insomnia API file into your API testing tool.
    This file contains all the necessary API endpoints for testing the
    Silzila application.

3.  Use the imported API endpoints to test the Silzila backend.

### Frontend Installation and Setup

**Navigate to the Folder**

1.  Open your command prompt (Windows) or terminal (macOS/Linux).

2.  Navigate to the Silzila frontend folder:

     > cd path/to/silzila/silzila-frontend

**Install Dependencies**

1.  Install npm dependencies:

     > npm install

2.  If the installation fails, force install the dependencies:

     > npm install -f

**Start the Frontend Application**

1.  Once the dependencies are installed successfully, start the frontend
    application:

    > npm start

2\. React application will open in default browser in http://localhost:3000

**Additional Notes**

-   Ensure that both backend and frontend are running simultaneously to
    fully test the application.

-   If you face any issues during the installation or running process,
    refer to the respective official documentation for Java, Maven,
    Node.js, and NPM.

By following these steps, you should be able to set up and run both the
backend and frontend of the Silzila application successfully.
