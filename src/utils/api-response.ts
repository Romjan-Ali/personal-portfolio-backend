// src/core/utils/api-response.ts
export class ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }

  constructor(
    success: boolean,
    message: string,
    data?: T,
    pagination?: ApiResponse['pagination']
  ) {
    this.success = success
    this.message = message
    this.data = data
    this.pagination = pagination
  }

  static success<T>(message: string, data?: T, pagination?: any) {
    return new ApiResponse(true, message, data, pagination)
  }

  static error(message: string) {
    return new ApiResponse(false, message)
  }
}