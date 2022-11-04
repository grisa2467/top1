const detailsDict = require("./_detailsList");
const mappedIds = new Set();

module.exports = async (details, options) => {
  const detailOptionArray = [];
  detailsDict.forEach((offerTypeChunk) => {
    offerTypeChunk.features.forEach((propertyTypeChunk) => {
      propertyTypeChunk.list.forEach((det) => {
        if (!mappedIds.has(det.id)) {
          const { id: detailId } = details.find(
            (detailItem) => detailItem.e999Id === +det.id
          );
          // if (!detailId) throw new Error();
          if (det.options) {
            det.options.forEach((o) => {
              const { id: optionId } = options.find(
                (optionItem) => optionItem.e999Id === +o.id
              );
              // if (!optionId) throw new Error();
              detailOptionArray.push({ detailId, optionId });
            });
          }
          mappedIds.add(det.id);
        }
      });
    });
  });
  return detailOptionArray;
};
