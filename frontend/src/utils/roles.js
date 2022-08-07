
export const ROLE = {
    CGA: "Cyberian Global Admin",
    SA: "Subscriber Admin",
    SAVO: "Subscriber View Only",
    RAA: "Risk Assessor Admin",
    RAVO: "Risk Assessor View Only",
    Accessor: "Accessor",
};

export const USER_STATUS = {
    active: 1,
    inactive: 2, 
    deleted: 3,
};

export const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);

export const getStatusByValue = (value) => getKeyByValue(USER_STATUS, value);