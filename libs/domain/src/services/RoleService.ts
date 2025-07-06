import type { Admin, Director, User } from "../entities"

export const UserRoles = {
    ADMIN: "admin",
    DIRECTOR: "director",
    EXECUTIVE: "executive",
    INSTRUCTOR: "instructor",
    STUDENT: "student",
} as const

export type UserRole = (typeof UserRoles)[keyof typeof UserRoles]

export class RoleService {
    static isAdmin(user: User): user is Admin {
        return user.role === UserRoles.ADMIN
    }

    static isDirector(user: User): user is Director {
        return user.role === UserRoles.DIRECTOR
    }

    static isAdminOrDirector(user: User): user is Admin | Director {
        return user.role === UserRoles.ADMIN || user.role === UserRoles.DIRECTOR
    }
}
