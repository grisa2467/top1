import axios from 'axios'
export const fetchProperties = async (
  propertyTypeId,
  offerTypeId,
  data = null
) => {
  const requestUrl = `${window.location.origin}/api/properties`
  if (propertyTypeId) data.propertyTypeId = propertyTypeId
  if (offerTypeId) data.offerTypeId = offerTypeId
  const response = await axios({
    url: requestUrl,
    method: 'GET',
    params: data
  })
  const _props = response.data.properties.map(property => {
    const details = property.propertyDetails.map(detail => {
      return {
        id: detail.detailId,
        name: detail.details.name,
        value: detail.optionId ? detail.optionValue.name : detail.value
      }
    })

    // const utilities = property.utilities.map((utility) => {
    //   return {
    //     name: utility.name,
    //     id: utility.id,
    //   };
    // });
    return {
      propertyTypeId: property.propertyTypeId,
      offerTypeId: property.offerTypeId,
      // e999AdvertId: property.e999AdvertId,
      id: property.id,
      price: property.price,
      oldPrice: property.oldPrice,
      details,
      // utilities,
      street: property?.location?.street || '',
      houseNr: property?.location?.houseNr || '',
      region: property?.location?.region?.name || '',
      city: property?.location?.city?.name || '',
      sector: property?.location?.sector?.name || '',
      priority: property.priority
      // agent: property.user,
      // photoIds: property.photos.sort((a, b) =>
      //   a.order !== null ? (b.order !== null ? a.order - b.order : -1) : 1
      // ),
      // description: property.description,
    }
  })
  return { properties: _props, filterLocations: response.data.filterLocations }
}

export const fetchAgent = async userId => {
  const requestUrl = `${window.location.origin}/api/users/agentProfile/${userId}`

  const response = await axios({
    url: requestUrl,
    method: 'GET'
  })

  return { profile: response.data.profile }
}

export const fetchPropertyImages = async propertyId => {
  const requestUrl = `${window.location.origin}/api/properties/images?propertyId=${propertyId}`

  const response = await axios({
    url: requestUrl,
    method: 'GET'
  })

  return response.data.images
}

export const fetchProperty = async id => {
  const requestUrl = `${window.location.origin}/api/property?propertyId=${id}`

  const response = await axios({
    url: requestUrl,
    method: 'GET'
  })
  const property = response.data.property
  const details = response.data.propertyDetails.map(detail => {
    return {
      id: detail.detailId,
      name: detail.details.name,
      value: detail.optionId ? detail.optionValue.name : detail.value,
      optionId: detail.optionId
    }
  })
  const utilities = response.data.utilities.map(utility => {
    return {
      name: utility.utilities.name,
      id: utility.utilityId
    }
  })

  return {
    propertyTypeId: property.propertyTypeId,
    offerTypeId: property.offerTypeId,
    e999AdvertId: property.e999AdvertId,
    id: property.id,
    price: property.price,
    oldPrice: property.oldPrice,
    details,
    utilities,
    street: property?.location?.street || '',
    houseNr: property?.location?.houseNr || '',
    region: property?.location?.region?.name || '',
    city: property?.location?.city?.name || '',
    sector: property?.location?.sector?.name || '',
    sectorId: property?.location?.sectorId || '',
    agent: property.user,
    photoIds: response.data.photos.sort((a, b) =>
      a.order !== null ? (b.order !== null ? a.order - b.order : -1) : 1
    ),
    description: property.description,
    title: property.title,
    priority: property.priority,
    mapLocation: property.mapLocation
  }
}

export const getAllPropertyTypeDetails = async (
  propertyTypeId,
  offerTypeId
) => {
  const requestUrl = `${window.location.origin}/api/details?offerTypeId=${offerTypeId}&propertyTypeId=${propertyTypeId}`
  const request = await fetch(requestUrl)
  const _details = await request.json()
  const allDetails = _details
    // .filter((item) => item.details.detailOptions.length)
    .map(item => {
      return {
        required: item.required,
        id: item.detailId,
        details: item.details
      }
    })
  return allDetails
}

export const getAllPropertyTypeUtilities = async (
  propertyTypeId,
  offerTypeId
) => {
  const requestUrl = `${window.location.origin}/api/utilities?offerTypeId=${offerTypeId}&propertyTypeId=${propertyTypeId}`
  const request = await fetch(requestUrl)
  const _utilities = await request.json()
  return _utilities
}

export const fetchSiteInfo = async data => {
  const requestUrl = `${window.location.origin}/api/info`

  const response = await axios({
    url: requestUrl,
    method: 'GET',
    params: {
      fields: data
    }
  })
  return { info: response.data.info }
}

export const sendEmail = async data => {
  const requestUrl = `${window.location.origin}/api/mail`

  const response = await axios({
    url: requestUrl,
    method: 'POST',
    data
  })
  return { info: response.data }
}
