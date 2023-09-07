export default generateUserErrorInfo = user => {
    return `One or more properties were incomplete or invalid.
    Require properties:
    - first_name: need to be a string, received ${user.first_name}
    - last_name: need to be a string, received ${user.last_name}
    - email: need to be a string, received ${user.email}
    - age: need to be a number, received ${user.age}
    - password: need to be a string`
}