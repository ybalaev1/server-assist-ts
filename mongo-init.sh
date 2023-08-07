set -e

mongo <<EOF
db = db.getSiblingDB('dc')

db.createUser({
  user: 'y1balaev',
  pwd: 'rVsueR6Q4UYwG6pb',
  roles: [{ role: 'readWrite', db: 'dc' }],
});
db.createCollection('users')
db.createCollection('communities')
db.createCollection('appConstants')

EOF