# Mix Master

Mix Master is a full-stack application designed to help DJs create, organize, and manage their performance setlists. It allows users to add, remove, and reorder songs while keeping track of key details such as BPM and transitions, ensuring a seamless flow during live performances.

## Project Description

Mix Master serves as an essential tool for DJs, offering a user-friendly interface to streamline the setlist creation process. By providing detailed song management features, it enhances the efficiency and creativity of DJs, enabling them to craft perfect mixes for their gigs.

## Why These Technologies Were Chosen

- **React:** To create a dynamic and responsive user interface.
- **Express & Node.js:** For building a robust back-end API to handle data operations.
- **MongoDB & Mongoose:** To store and manage the songs and setlists efficiently, with flexibility in data modeling.
- **TypeScript:** To enforce type safety and improve code quality, making the development process smoother and less error-prone.
- **ESLint & Prettier:** To maintain consistent code formatting and standards across the project.
- **react-beautiful-dnd:** To provide intuitive drag-and-drop functionality for reordering songs in a setlist.

## Challenges Faced & Future Features

### Challenges:

- Integrating drag-and-drop functionality while maintaining performance and smooth UI transitions.
- Ensuring seamless communication between the front-end and back-end, especially during real-time data updates.

### Future Features:

- **Sharing Setlists:** Allowing users to share their setlists with others.
- **Soundcloud API Integration:** Adding a powerful search feature to quickly find songs published on SoundCloud.

## Table of Contents

- [Project's Title](#mix-master)
- [Project Description](#project-description)
- [How to Install and Run the Project](#how-to-install-and-run-the-project)
- [How to Use the Project](#how-to-use-the-project)
- [License](#license)
- [Tests](#tests)

## How to Install and Run the Project

To run Mix Master locally, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mix-master.git
    cd mix-master
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    - Create a `.env` file in the root directory.
    - Add the necessary environment variables such as `MONGO_URI`, `PORT`, etc.

4. **Start the development server:**

    ```bash
    npm run dev
    ```

5. **Build the front-end:**

    ```bash
    npm run build
    ```

6. **Run the project:**

    The application should now be running at [http://localhost:3000](http://localhost:3000).

## How to Use the Project

1. **Create a Setlist:**

    - Navigate to the setlist creation page.
    - Add songs by filling in details such as title, intro BPM, outro BPM, and transitions.

2. **Manage Songs:**

    - Drag and drop songs to reorder them within the setlist.
    - Edit or remove songs as needed.

3. **Save and Access Setlists:**

    - Save your setlist for future use.
    - Access saved setlists from the dashboard for quick edits and updates.
  
4. **Sign Up and Log In:**

    - Navigate to the sign-up page to create a new user account.
    - After signing up, log in using your credentials to access and manage your personalized setlists.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Tests

To run the tests for Mix Master:

1. **Run integration tests:**

    ```bash
    npm run test
    ```
