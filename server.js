import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __filename and __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3019;

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this to handle JSON bodies

mongoose.connect('mongodb://localhost:27017/students');
const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
});

const Users = mongoose.model("data", userSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

app.post('/post', async (req, res) => {
    try {
        const { name, email, address, phone, message } = req.body; // Destructure form data from the request body
        const user = new Users({
            name,
            email,
            address,
            phone,
            message,
        }); // Use parentheses to initialize the new Users object

        await user.save(); // Save the user document to the database
        console.log(user);

        // Send a JSON response or a redirection to the success page
        res.status(200).sendFile(path.join(__dirname, 'index.html'));
    } catch (error) {
        console.error("Error saving user:", error);
        res.status(500).send("An error occurred");
    }
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
