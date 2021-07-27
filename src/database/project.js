"use strict";
module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define(
    "Project",
    {
      projectid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ownerid: DataTypes.STRING,
      smcid: DataTypes.INTEGER,
    },
    {
      tableName: "projects",
      timestamps: false,
    },
  );

  return Project;
};
