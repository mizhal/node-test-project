module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable("Errores", {
      id:  {     
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      center_x: Sequelize.FLOAT,
      center_y: Sequelize.FLOAT,
      radius: Sequelize.FLOAT,
      estado: Sequelize.INTEGER,
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Categorias",
        referencesKey: "id"
      },
      entregaId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Entregas",
        referencesKey: "id"
      },
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: "Usuarios",
        referencesKey: "id"
      }
    });

    queryInterface.addIndex("Errores", ["usuario_id"]);
    queryInterface.addIndex("Errores", ["entrega_id"]);
    queryInterface.addIndex("Errores", ["category_id"]);
  },

  down: function (queryInterface, Sequelize) {
    return queryInteface.dropTable("Errores")
  }
};