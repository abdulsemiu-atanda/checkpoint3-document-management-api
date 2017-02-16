const testdata = {
  fakeUser: {
    firstName: 'Sam',
    lastName: 'Winchester',
    username: 'sam.winchester',
    email: 'sam.winchester@gmail.com',
    password: 'password',
    roleId: 2
  },
  fakeAdmin: {
    firstName: 'Shaquisha',
    lastName: 'Daniels',
    username: 'shaquisha.daniels',
    email: 'shaquisha.daniels@gmail.com',
    password: 'password',
    roleId: 1
  },
  fakeUserDoc: {
    title: 'Sweet Talker',
    content: 'The Quick Brown Fox jumps over the lazy dog'
  },
  fakeAdminDoc: {
    title: 'Scooby Doo',
    content: 'Scooby Doo is an awesome dog who loves chewing bones'
  },
  privateDoc: {
    title: 'Silly',
    content: 'Scooby Doo is an awesome dog who loves chewing bones',
    access: 'private'
  },
  roleDoc: {
    title: 'Sully',
    content: 'Scooby Doo is an awesome dog who loves chewing bones',
    access: 'role'
  },
  role: {
    title: 'Admin'
  },
  modelUser: {
    firstName: 'Shaquisha',
    lastName: 'Daniels',
    username: 'shaquisha.daniels',
    email: 'shaquisha.daniels@gmail.com',
    password: 'password',
    RoleId: 1
  },
  noRoleUser: {
    firstName: 'Sam',
    lastName: 'Winchester',
    username: 'sam.winchester',
    email: 'sam.winchester@gmail.com',
    password: 'password',
    RoleId: 2
  },
  fakeMailUser: {
    firstName: 'Sam',
    lastName: 'Winchester',
    username: 'sam.winchester',
    email: 'sam.winchester',
    password: 'password',
    RoleId: 2
  },
  modelDoc: {
    title: 'Brown Fox',
    content: 'The Quick Brown Fox jumps over the lazy dog',
    OwnerId: 1
  }
};

export default testdata;
