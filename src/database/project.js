"use strict";
module.exports = (sequelize, DataTypes) => {
  var Project = sequelize.define(
    "Project",
    {
      projectid: {
        type: DataTypes.NUMBER,
        primaryKey: true,
      },
      ownerid: DataTypes.STRING,
      smcid: DataTypes.NUMBER,
    },
    {
      tableName: "projects",
      timestamps: false,
    },
  );

  return Project;
};
