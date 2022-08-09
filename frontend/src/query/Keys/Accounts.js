export const accountsKeys = {
  all: () => ['accounts-list'],
  detail: (id) => [...accountsKeys.all(), id],
  
  // assessmentDetailTabView: (id, tab) => ['assessment_detail_tab_view', { id, tab }],
  // allUnpaginated: (role) => ['unpaginated_assessments', role],
  // chartsDetail: (id) => ['reports_chart', id],
  // assessmentAssignedUsers: (id) => ['assessment_assigned_users', id],
  // sideBarList: (id) => ['assess_side_bar_list', id],
  // checkPerformStatus: (id) => ['check_perform_status', id],
  // list: (filters) => [...todoKeys.lists(), { filters }],
  // details: () => [...todoKeys.all, 'detail'],
  // detail: (id) => [...todoKeys.details(), id],
}
export const generalKeys = {
  all: () => ['generals-list'],
  adjsutedEntiries: () => ['adjusted-entries-list'],
  detail: (id) => [...generalKeys.all(), id],

  
  // assessmentDetailTabView: (id, tab) => ['assessment_detail_tab_view', { id, tab }],
  // allUnpaginated: (role) => ['unpaginated_assessments', role],
  // chartsDetail: (id) => ['reports_chart', id],
  // assessmentAssignedUsers: (id) => ['assessment_assigned_users', id],
  // sideBarList: (id) => ['assess_side_bar_list', id],
  // checkPerformStatus: (id) => ['check_perform_status', id],
  // list: (filters) => [...todoKeys.lists(), { filters }],
  // details: () => [...todoKeys.all, 'detail'],
  // detail: (id) => [...todoKeys.details(), id],
}
export const balanceSheetKey = {
  ledgers: () => ['balance-sheet-ledgers'],
  adjustedLedgers: () => ['balance-sheet--adjusted-ledgers'],
}