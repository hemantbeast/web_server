export class ResponseUtil {
  static successResponse<T>(
    data: T,
    message: string = 'Success',
    isSuccess: boolean = true,
  ): JSON {
    return JSON.parse(
      JSON.stringify({
        success: isSuccess,
        data: data,
        message: message,
      }),
    ) as JSON;
  }
}
