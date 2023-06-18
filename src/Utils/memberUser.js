/** @format */

function memberUser(members, userId) {
  for (let i = 0; i < members.length; i++) {
    if (members[i]._id === userId) {
      return true;
    }
  }
}

export default memberUser;
