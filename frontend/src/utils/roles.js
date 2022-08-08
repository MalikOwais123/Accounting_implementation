export const ACC_NATURE = {
  current_asset: 'current_asset',
  longterm_asset: 'longterm_asset',
  current_liability: 'current_liability',
  longterm_liability: 'longterm_liability',
  expense: 'expense',
  owner_equity: 'owner_equity',
  revenue: 'revenue',
}

export const USER_STATUS = {
  active: 1,
  inactive: 2,
  deleted: 3,
}

export const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value)

export const getStatusByValue = (value) => getKeyByValue(USER_STATUS, value)

export const getStatusClr = (st) => {
  // return st === ('current_asset' || "current_liability") ? "success" : "warning"
  return st === ('current_asset' || 'current_liability')
    ? 'success'
    : st === ('longterm_asset' || 'longterm_liability')
    ? 'warning'
    : st === 'expense'
    ? 'error'
    : st === 'owner_equity' || 'revenue'
    ? 'info'
    : 'warning'
}
