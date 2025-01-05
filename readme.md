# InternshipYatra

Link - https://internshipyatra.ravikhokle.site

InternshipYatra is a web-based platform that connects students with internship opportunities, enabling seamless interaction between students and HR professionals. Interns can apply for internships, while HR can manage internship postings and review applicants' resumes and profiles.

### Key Features:
- **Interns**: Apply for internships, create a profile, and submit their resumes.
- **HR**: Publish, update, and delete internship listings, and view applicants' profiles and resumes.
- **Authentication**: JWT for secure authentication.
- **Security**: bcrypt for hashing passwords.
- **Cloud Storage**: Cloudinary for storing images.
- **Database**: MongoDB hosted on Atlas for secure data storage.
- **User Notifications**: Toastify for displaying success/error messages in the UI.

### Technologies Used:
- **Frontend**: React.js, JSX, CSS
- **Backend**: Node.js, Express.js
- **Authentication**: JWT, bcrypt
- **Database**: MongoDB (MongoDB Atlas)
- **File Storage**: Cloudinary
- **Notifications**: Toastify
- **Version Control**: Git, GitHub

### Build and Run

To build and run the project locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/ravikhokle/InternshipYatra.git
    cd InternshipYatra
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    URI=your_mongodb_uri
    JWT_SECRATE=your_jwt_secret
    PORT=5000
    CLOUDINARY_API_KEY=your_cloudinary_apikey
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloudName
    CLOUDINARY_API_SECRET=your_cloudinary_secret
    CLOUDINARY_URL=your_cloudinary_url
    ```

4. **Run the development server**:
    ```sh
    npm run dev
    ```

5. **Build for production**:
    ```sh
    npm run build
    ```

6. **Start the production server**:
    ```sh
    npm start
    ```

The application should now be running at `http://localhost:3000`.
