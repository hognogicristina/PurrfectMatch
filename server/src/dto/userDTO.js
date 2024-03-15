class UserDTO {
    constructor(user) {
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.imageId = user.imageId
        this.username = user.username
        this.email = user.email
        this.birthday = user.birthday
        this.description = user.description
        this.hobbies = user.hobbies
        this.experienceLevel = user.experienceLevel
    }
}

module.exports = UserDTO