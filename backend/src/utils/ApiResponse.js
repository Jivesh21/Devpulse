class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;

    // Success only for 2xx responses
    this.success =
      statusCode >= 200 && statusCode < 300;

    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;