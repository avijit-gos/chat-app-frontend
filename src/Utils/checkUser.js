/** @format */

export function checkUser(users, myAccount) {
  for (let i = 0; i < users.length; i++) {
    if (users[i]._id !== myAccount._id) {
      return users[i];
    }
  }
}
