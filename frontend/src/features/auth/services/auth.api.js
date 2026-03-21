import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/auth',
    withCredentials: true
})

export const register = async (username, email,password)=>{
    try{
        const response = await api.post("/register",{
            username,
            email,
            password
        })

        return response.data
    }catch(err){
        throw err.response.data
    }

}

export const login = async (username,email,password)=>{
    try{
        const response = await api.post('/login',{
            username,
            email,
            password        
        })
        
        return response.data

    }catch(err){
        throw err.response.data
    }
}

export const getMe = async ()=>{
    try{
        const response = await api.get('/get-me');
        return response.data
    }catch(err){
        throw err.response.data
    }
}

export const logout = async ()=>{
    try{
        const response = await api.post('/logout');
        return response.data
    }catch(err){
        throw err.response.data
    }
}
