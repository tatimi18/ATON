import axios from "axios";

export default class UserService {
    static async getAll(page = 1, perPage = 6) {
        const response = await axios.get('https://reqres.in/api/users', {
            params: {
                page: page,
                per_page: perPage
            }
        });
        const end = Date.now() ;
        return [response, end];
    };
};