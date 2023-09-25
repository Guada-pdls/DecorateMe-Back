const invalidProperties = user => {
  return `One or more properties were incomplete or invalid.
    Require properties:
    - first_name: need to be a string, received ${user.first_name}
    - last_name: need to be a string, received ${user.last_name}
    - email: need to be a string, received ${user.email}
    - age: need to be a number, received ${user.age}
    - password: need to be a string`
}

const nonExistentUserById = id => `The user with ID ${id} doesn't exist`

const nonExistentUserByEmail = email => `The user with email ${email} doesn't exist`

const passwordsDoNotMatch = 'Passwords mismatch'

const repeatedPassword = 'The new password cannot be the same as the old one'

const nonAuthorizedFields = `There's data that you cannot change. The following fields are not allowed to be changed:
  - password
  - role
  - cid
`

const notAuthorizedToBePremium = documents => {

  const requiredDocuments = ['identification', 'address proof', 'account statement proof']
  const missingDocuments = []

  for (const doc of requiredDocuments) {
    const found = documents.some((item) => item.name === doc);
    if (!found) {
      missingDocuments.push(doc);
    }
  }

  let message = 'To upgrade to premium, you need to provide the following documents: ';
  message += missingDocuments.join(', ');
  return message;
}

export { invalidProperties, passwordsDoNotMatch, repeatedPassword, nonExistentUserById, nonExistentUserByEmail, nonAuthorizedFields, notAuthorizedToBePremium }