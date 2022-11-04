"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    // const forgottenDetail = await queryInterface.sequelize.query(
    //   "SELECT * FROM details WHERE name='Nivele'",
    //   {
    //     type: queryInterface.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // console.log(forgottenDetail);
    // const abusedDetail = await queryInterface.sequelize.query(
    //   "SELECT * FROM details WHERE name LIKE '%de nivele%'",
    //   {
    //     type: queryInterface.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // console.log(abusedDetail);
    // const insertedOptions = await queryInterface.sequelize.query(
    //   "SELECT * FROM options WHERE e999id IN (1641, 1643, 1644, 1652)",
    //   {
    //     type: queryInterface.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // console.log(insertedOptions);
    // // const offerTypeIds = await queryInterface.sequelize.query(
    // //   "SELECT * FROM offer_typess",
    // //   {
    // //     type: queryInterface.sequelize.QueryTypes.SELECT,
    // //   }
    // // );
    // // console.log(offerTypeIds);
    // const propTypes = await queryInterface.sequelize.query(
    //   "SELECT * FROM property_types",
    //   {
    //     type: queryInterface.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // // console.log(propTypes);
    // const newDetailOptions = insertedOptions.map((o) => {
    //   return {
    //     optionId: o.id,
    //     detailId: forgottenDetail[0].id,
    //   };
    // });
    // console.log(newDetailOptions);
    // await queryInterface.bulkInsert("detail_options", newDetailOptions);
    // let _optionIds = "";
    // for (let i = 0; i < insertedOptions.length; i++) {
    //   const op = insertedOptions[i];
    //   const addon = `${op.id}${i + 1 < insertedOptions.length ? ", " : ""}`;
    //   _optionIds += addon;
    // }
    // console.log(_optionIds);
    // const insertedNew = await queryInterface.sequelize.query(
    //   `SELECT * FROM detail_options WHERE optionId IN (${_optionIds})`,
    //   {
    //     type: queryInterface.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // console.log(insertedNew);
    // const _setDetail = `${forgottenDetail[0].id}`;
    // const _propTypeToChange = propTypes.find((item) => item.e999Id === 1406).id;
    // // console.log(_propTypeToChange);
    // await queryInterface.sequelize.query(
    //   `UPDATE property_type_details SET detailId=207 WHERE detailId=219 and propertyTypeId=28`,
    //   {
    //     type: queryInterface.sequelize.QueryTypes.SELECT,
    //   }
    // );
    // await queryInterface.sequelize.query("SELECT * FROM offer_typess", {
    //   type: queryInterface.sequelize.QueryTypes.SELECT,
    // });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
