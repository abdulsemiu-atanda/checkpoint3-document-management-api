import db from '../models';

db.Role.bulkCreate([{
  title: 'Admin'
},
{
  title: 'Regular'
}]);
