# Purrfect Match

## Overview

"Purrfect Match" is a full-stack web application meticulously crafted to provide an engaging platform for cat
enthusiasts
to find their ideal feline companions. It integrates a robust backend with a responsive frontend, ensuring a seamless
user experience. The application is designed to cater to the unique preferences of users, offering a detailed database
of cats, each with comprehensive profiles. Users can explore, save, and revisit their favorite cats, making "Purrfect
Match" an indispensable tool for prospective cat owners. The platform also features a community section where users can
interact, and engage in discussions, fostering a sense of community among cat lovers.

## Preview

## Features
- **RESTful API**: Ensures seamless data management and communication between the frontend and backend.
- **Detailed Models**: Includes comprehensive models for cats, user profiles.
- **Responsive Client Interface**:
- **User Authentication**: Secure user authentication and authorization.
- **Community Section**: Enables users to interact and engage in discussions.
- **Search and Filter**: Allows users to search and filter cats based on various criteria.
- **Save Favorites**: Users can save their favorite cats for future reference.
- **Admin Panel**: Provides an admin panel for managing users and cats.

## Technologies

- **Backend**: Node.js and Express
- **Database**: SQLite, integrated with Sequelize for ORM
- **Frontend**: React.js
- **API**: RESTful API endpoints
-

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/hognogicristina/Project.git

#### Server Setup

1. Navigate to the server directory:
    ```bash
    cd Project/server

2. Install the dependencies:
    ```bash
    npm install

3. Start the server:
    ```bash
    npm start

4. Open your browser and navigate to `http://localhost:3000` to access the API.

#### Client Setup

## Database

### Sequelize ORM

1. Initialize Sequelize in your project:
    ```bash
    npx sequelize-cli init

2. Create migrations:
    ```bash
    npx sequelize-cli migration:generate --name create-table-name

3. Run the migration:
    ```bash
    npx sequelize-cli db:migrate

## JWT Secret Key

- Generate a secret key for JWT:
    ```bash
    openssl rand -base64 32

## Postman Collection

- Import the `Adopt-A-Cat.postman_collection.json` file located at `Project/server/postmanCollection`

## Contributing

Contributions are welcome and greatly appreciated. If you have suggestions for improving this application, please fork
the repo and create a pull request or open an issue.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/feature-name`)
3. Commit your Changes (`git commit -m 'here it is the feature implemented'`)
4. Push to the Branch (`git push origin feature/feature-name`)
5. Open a Pull Request
