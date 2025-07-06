import { User } from "@crenauto/domain"

export function createUserFixture() {
    let currentUser: User | undefined

    function givenTheLoggedInAccountIs(user: User) {
        currentUser = user
    }

    function createFakeUser(
        userData: Omit<User["data"], "role"> & { role: string }
    ): User {
        return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password,
            role: userData.role,
        } as unknown as User
    }

    return {
        get currentUser() {
            return currentUser
        },
        createFakeUser,
        givenTheLoggedInAccountIs,
    }
}

export type UserFixture = ReturnType<typeof createUserFixture>
