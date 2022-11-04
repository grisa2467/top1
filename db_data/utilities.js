const { forEach } = require("./_utilitiesList");
const utilitiesDict = require("./_utilitiesList");

const utilitiesSet = new Set();
const utilitiesWithPropertyAndOfferType = [];
const getPropertyTypeUtilities = async (
  insertedUtilities,
  preUtilitiesList
) => {
  const ptde = [];
  preUtilitiesList.forEach((preUt) => {
    insertedUtilities.forEach((insertedDet) => {
      if (+preUt.utilityId === insertedDet.e999Id) {
        const x = { ...preUt, utilityId: insertedDet.id };
        ptde.push(x);
      }
    });
  });
  return ptde;
};
module.exports = async (offerTypes, propertyTypes) => {
  offerTypes.forEach((offerType) => {
    let index = 0;
    utilitiesDict.forEach((util, i) => {
      if (util.offerType === offerType.e999Id) {
        index = i;
      }
    });
    const offerTypeDict = utilitiesDict[index];
    propertyTypes.forEach((propertyType) => {
      let j = 0;
      offerTypeDict.features.forEach((util, i) => {
        if (util.propertyType === propertyType.e999Id) {
          j = i;
        }
      });
      const utilitiesList = offerTypeDict.features[j].list;
      utilitiesList.forEach((item) => {
        utilitiesSet.add(JSON.stringify(item));
        utilitiesWithPropertyAndOfferType.push({
          offerTypeId: offerType.id,
          propertyTypeId: propertyType.id,
          utilityId: item.id,
        });
      });
    });
  });
  const uniqueUtilitiesList = Array.from(utilitiesSet).map((item) => {
    const _item = JSON.parse(item);
    return {
      name: _item.title,
      e999Id: _item.id,
    };
  });
  return {
    uniqueUtilitiesList,
    utilitiesWithPropertyAndOfferType,
    getPropertyTypeUtilities,
  };
};
