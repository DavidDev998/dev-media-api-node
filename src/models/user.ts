type User = {
    id:string,
    name:string,
    email:string,
    salt: string,
    token: string,
    dateLoggedIn: Date,
    createdAt: Date,
    password:string,
}

export default User