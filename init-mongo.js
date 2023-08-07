var db = connect("mongodb://y1balaev:rVsueR6Q4UYwG6pb@localhost:27017/admin");
db.getSiblingDB('admin');
db.createUser({
  user: y1balaev,
  pwd: rVsueR6Q4UYwG6pb,
  roles: 'readWrite',
});
