import axios from 'axios';

// Instancia central do Axios. Todos os services usam essa baseURL para chamar o backend Spring.
export const api = axios.create({
    baseURL: 'http://localhost:8080',
});
