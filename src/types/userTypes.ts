// missing password_hash property because it is not needed in the User type
type User = {
    user_id: number;
    username: string;
    email: string;
    created_at: Date;
    updated_at: Date;
};

type Roles = {
    roleId: number;
    role_name: string;
}

type UserRoles = {
    userId: number;
    roleId: number;
}

export {
    User,
    Roles,
    UserRoles
}