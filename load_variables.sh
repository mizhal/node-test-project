# Variables

# Actualizar el path para usar los comandos de los modulos de node
CURRENT_PATH=`pwd`
export PATH=$PATH:$CURRENT_PATH/node_modules/.bin/
export NODE_ENV=development
alias regenerate-test-db="node admin-utils/drop_database.js test; node admin-utils/create_database.js test; NODE_ENV=test sequelize db:migrate"