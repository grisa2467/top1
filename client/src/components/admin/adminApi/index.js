import axios from "axios";

export const fetchGroups = async (token) => {
  const url = `${window.location.origin}/api/groups`;
  const groups = await axios({
    url,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
    crossDomain: true,
  });
  return groups.data.groups;
};

export const fetchGroup = async (token, groupId) => {
  const url = `${window.location.origin}/api/groups/agents?groupId=${groupId}`;
  const response = await axios({
    url,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
    crossDomain: true,
  });
  return response.data.group;
};

export const addNewGroup = async (token, data) => {
  const url = `${window.location.origin}/api/groups/`;
  const response = await axios({
    url,
    method: "POST",
    headers: {
      "x-auth-token": token,
    },
    data,
  });
  return response.data;
};

export const addAgent = async (token, data) => {
  const url = `${window.location.origin}/api/users/`;
  const response = await axios({
    url,
    method: "POST",
    headers: {
      "x-auth-token": token,
    },
    data,
  });
  return response.data;
};

export const fetchAllProperties = async (token) => {
  const url = `${window.location.origin}/api/properties/all`;
  const response = await axios({
    url,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
  return response.data.properties;
};

export const deleteProperty = async (token, propertyId) => {
  const url = `${window.location.origin}/api/properties?id=${propertyId}`;
  const response = await axios({
    url,
    method: "DELETE",
    headers: {
      "x-auth-token": token,
    },
  });
  return response.data;
};

export const updateProperty = async (token, data) => {
  const requestUrl = `${window.location.origin}/api/properties/update`;

  const response = await axios({
    url: requestUrl,
    method: "PATCH",
    headers: {
      "x-auth-token": token,
    },
    data,
  });
  return response.data;
};

export const fetchAgent = async (token, id) => {
  const requestUrl = `${window.location.origin}/api/users/profile?id=${id}`;

  const response = await axios({
    url: requestUrl,
    method: "GET",
    headers: {
      "x-auth-token": token,
    },
  });
  return response.data;
};

export const updateAgentProfile = async (token, data) => {
  const requestUrl = `${window.location.origin}/api/users/update`;

  const response = await axios({
    url: requestUrl,
    method: "PATCH",
    headers: {
      "x-auth-token": token,
    },
    data,
  });
  return response.data;
};

export const updateSiteInfo = async (token, data) => {
  const requestUrl = `${window.location.origin}/api/info`;

  const response = await axios({
    url: requestUrl,
    method: "PATCH",
    headers: {
      "x-auth-token": token,
    },
    data,
  });
  return response.data;
};
