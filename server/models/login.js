const { connectToDatabase } = require("../database");
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

async function loginUser(pseudo, password) {
    try {
        const db = await connectToDatabase();

        // Find user by pseudo
        const Users = db.collection('Users');
        const user = await Users.findOne({ pseudo: pseudo });

        if (user) {
            // Compare passwords
            const passwordIsValid = await bcrypt.compare(password, user.passwordUser);
            if (passwordIsValid) {
                // Generate a new token for the user
                const newUserToken = uuidv4();

                // Update user token in the database
                await Users.updateOne({ _id: user._id }, { $set: { userToken: newUserToken } });

                // Successful login
                return {
                    success: true,
                    message: "Connexion réussie.",
                    user: {
                        id: user._id,
                        pseudo: user.pseudo,
                        token: newUserToken
                    }
                };
            } else {
                // Incorrect password
                return { success: false, message: "Mot de passe incorrect." };
            }
        } else {
            // User not found
            return { success: false, message: "Utilisateur non trouvé." };
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return { success: false, message: "Erreur lors de la connexion." };
    }
}

async function registerUser(pseudo, password) {
    try {
        const db = await connectToDatabase();

        // Check if the user already exists
        const Users = db.collection('Users');
        const existingUser = await Users.findOne({ pseudo: pseudo });

        if (existingUser) {
            return { success: false, message: "Pseudo déjà utilisé." };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a new token for the user
        const userToken = uuidv4();

        // Insert user into Users collection
        const insertedUser = await Users.insertOne({
            pseudo: pseudo,
            passwordUser: hashedPassword,
            dateCrea: new Date(),
            userToken: userToken
        });

        // Insert initial wallet data into Wallets collection
        const Wallets = db.collection('Wallets');
        await Wallets.insertOne({ idUser: insertedUser.insertedId, tokenName: "USDT", amount: 10000 });
        await Wallets.insertOne({ idUser: insertedUser.insertedId, tokenName: "BTC", amount: 0 });
        await Wallets.insertOne({ idUser: insertedUser.insertedId, tokenName: "ETH", amount: 0 });
        await Wallets.insertOne({ idUser: insertedUser.insertedId, tokenName: "SOL", amount: 0 });

        return { success: true, message: "Inscription réussie avec solde initial." };
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error);
        return { success: false, message: "Erreur lors de l'inscription." };
    }
}

module.exports = { loginUser, registerUser };
