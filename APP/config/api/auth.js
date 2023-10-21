import client from "../HttpCLient";

export const login = async (email, password) => {
    try {
        const obj = {
            email,
            password
        }
        const response = await client.post('/login', obj);
        return response.data
    } catch (err) {
        console.log(err);
    }
}