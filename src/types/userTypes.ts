type User = {
    user_id: number;
    username: string;
    email: string;
    password_hash: string;
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