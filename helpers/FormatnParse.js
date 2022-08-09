export const parseNewsStatus = (_statusId) => {
  switch (_statusId) {
    case 1:
      return "Mới"
    case 2:
      return "Đã đăng"
    case 3:
      return "Bị thu hồi"

    default:
      return "Không rõ"
  }
}
export const parseNewsStatusClass = (_statusId) => {
  switch (_statusId) {
    case 1:
      return "semantic_info"
    case 2:
      return "semantic_success"
    case 3:
      return "semantic_warning"

    default:
      return "unknow_color"
  }
}
export const parseNewsStatusTextClass = (_statusId) => {
  const prefix = parseNewsStatusClass(_statusId)
  return prefix + "--text"
}

// REPORTS
export const parseNewsReportStatus = (_statusId) => {
  switch (_statusId) {
    case 1:
      return "Chưa xử lý"
    case 2:
      return "Đã xóa"
    case 3:
      return "Đã giữ lại"

    default:
      return "Không rõ"
  }
}
export const parseNewsReportStatusClass = (_statusId) => {
  switch (_statusId) {
    case 1:
      return "semantic_warning"
    case 2:
      return "semantic_error"
    case 3:
      return "semantic_info"

    default:
      return "unknow_color"
  }
}
export const parseNewsReportStatusTextClass = (_statusId) => {
  const prefix = parseNewsReportStatusClass(_statusId)
  return prefix + "--text"
}

// USERS
export const parseUsersStatus = (_statusId) => {
  switch (+_statusId) {
    case 1:
      return "Đang hoạt động"
    case 0:
      return "Ngừng hoạt động"
    default:
      return "Không rõ"
  }
}
export const parseUsersStatusClass = (_statusId) => {
  switch (+_statusId) {
    case 1:
      return "semantic_success"
    case 0:
      return "semantic_error"

    default:
      return "unknow_color"
  }
}
export const parseUsersStatusTextClass = (_statusId) => {
  const prefix = parseUsersStatusClass(_statusId)
  return prefix + "--text"
}
