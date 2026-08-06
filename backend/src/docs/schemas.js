const schemas = {
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "accessToken",
      },
    },

    schemas: {
      ApiResponse: {
        type: "object",
        properties: {
          statusCode: {
            type: "integer",
          },

          success: {
            type: "boolean",
          },

          message: {
            type: "string",
          },

          data: {
            type: "object",
          },
        },
      },

      RegisterRequest: {
        type: "object",

        required: [
          "fullName",
          "username",
          "email",
          "password",
        ],

        properties: {
          fullName: {
            type: "string",
            example: "Jivesh Sharma",
          },

          username: {
            type: "string",
            example: "jivesh21",
          },

          email: {
            type: "string",
            example: "jivesh@gmail.com",
          },

          password: {
            type: "string",
            example: "Password@123",
          },
        },
      },

      LoginRequest: {
        type: "object",

        required: [
          "email",
          "password",
        ],

        properties: {
          email: {
            type: "string",
            example: "jivesh@gmail.com",
          },

          password: {
            type: "string",
            example: "Password@123",
          },
        },
      },
    },
  },
};

export default schemas;