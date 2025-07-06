import { type UserRole, UserRoles } from "../services/RoleService"

export abstract class User {
    constructor(
        protected _id: string,
        protected _name: string,
        protected _email: string,
        protected _password: string,
        protected _role: UserRole
    ) {}

    get role() {
        return this._role
    }

    get data() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: this._role,
        }
    }
}

export class Admin extends User {
    static make({ id, name, email, password }: Omit<Admin["data"], "role">) {
        return new Admin(id, name, email, password)
    }

    constructor(_id: string, _name: string, _email: string, _password: string) {
        super(_id, _name, _email, _password, UserRoles.ADMIN)
    }

    get data() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: UserRoles.ADMIN,
        }
    }
}

export class Director extends User {
    static make({
        id,
        name,
        email,
        password,
        relatedCompany,
    }: Omit<Director["data"], "role">) {
        return new Director(id, name, email, password, relatedCompany)
    }

    constructor(
        _id: string,
        _name: string,
        _email: string,
        _password: string,
        private _relatedCompany: string
    ) {
        super(_id, _name, _email, _password, UserRoles.DIRECTOR)
    }

    get relatedCompany() {
        return this._relatedCompany
    }
    
    get data() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: UserRoles.DIRECTOR,
            relatedCompany: this._relatedCompany,
        }
    }
}

export class Executive extends User {
    static make({
        id,
        name,
        email,
        password,
        relatedCompany,
    }: Omit<Executive["data"], "role">) {
        return new Executive(id, name, email, password, relatedCompany)
    }

    constructor(
        _id: string,
        _name: string,
        _email: string,
        _password: string,
        private _relatedCompany: string
    ) {
        super(_id, _name, _email, _password, UserRoles.EXECUTIVE)
    }

    get data() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: UserRoles.EXECUTIVE,
            relatedCompany: this._relatedCompany,
        }
    }
}

export class Instructor extends User {
    static make({
        id,
        name,
        email,
        password,
        relatedCompany,
    }: Omit<Instructor["data"], "role">) {
        return new Instructor(id, name, email, password, relatedCompany)
    }

    constructor(
        _id: string,
        _name: string,
        _email: string,
        _password: string,
        private _relatedCompany: string
    ) {
        super(_id, _name, _email, _password, UserRoles.INSTRUCTOR)
    }

    get data() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: UserRoles.INSTRUCTOR,
            relatedCompany: this._relatedCompany,
        }
    }
}

export class Student extends User {
    static make({ id, name, email, password }: Omit<Student["data"], "role">) {
        return new Student(id, name, email, password)
    }

    constructor(_id: string, _name: string, _email: string, _password: string) {
        super(_id, _name, _email, _password, UserRoles.STUDENT)
    }

    get data() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            password: this._password,
            role: UserRoles.STUDENT,
        }
    }
}
