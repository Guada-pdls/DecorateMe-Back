class UserDTO {
  constructor(user) {
    this._id = user._id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.full_name = user.first_name + " " + user.last_name;
    this.email = user.email;
    this.photo = user.photo;
    this.role = user.role;
    this.cid = user.cid;
  }
}

export default UserDTO;
