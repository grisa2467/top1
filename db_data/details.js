const detailsDict = require("./_detailsList");
const detailsSet = new Set();
const optionsSet = new Set();
const detailsWithPropertyAndOfferType = [];

const getPropertyTypeDetailsEntries = async (
  insertedDetails,
  preDetailsList
) => {
  const ptde = [];
  preDetailsList.forEach((preDet) => {
    insertedDetails.forEach((insertedDet) => {
      if (+preDet.detailId === insertedDet.e999Id) {
        ptde.push({ ...preDet, detailId: insertedDet.id });
      }
    });
  });
  return ptde;
};
module.exports = async (offerTypes, propertyTypes) => {
  offerTypes.forEach((offerType) => {
    let index = 0;
    detailsDict.forEach((util, i) => {
      if (util.offerType === offerType.e999Id) {
        index = i;
      }
    });
    const offerTypeDict = detailsDict[index];
    propertyTypes.forEach((propertyType) => {
      let j = 0;
      offerTypeDict.features.forEach((util, i) => {
        if (util.propertyType === propertyType.e999Id) {
          j = i;
        }
      });
      const detailsList = offerTypeDict.features[j].list;
      detailsList.forEach((item) => {
        if (item.options !== null) {
          item.options.forEach((option) => {
            optionsSet.add(
              JSON.stringify({ name: option.title, e999Id: option.id })
            );
          });
        }
        detailsSet.add(JSON.stringify({ id: item.id, title: item.title }));
        detailsWithPropertyAndOfferType.push({
          offerTypeId: offerType.id,
          propertyTypeId: propertyType.id,
          detailId: item.id,
          required: item.required,
        });
      });
    });
  });
  const uniqueOptionsList = Array.from(optionsSet).map((item) =>
    JSON.parse(item)
  );
  const uniqueDetailsList = Array.from(detailsSet).map((item) => {
    const _item = JSON.parse(item);
    return {
      name: _item.title,
      e999Id: _item.id,
    };
  });

  return {
    uniqueDetailsList,
    uniqueOptionsList,
    detailsWithPropertyAndOfferType,
    getPropertyTypeDetailsEntries,
  };
};
