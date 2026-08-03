import swaggerJSDoc from "swagger-jsdoc";
import schemas from "../docs/schemas.js";

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "DevPulse API",
      version: "1.0.0",
      description:
        "Backend API for DevPulse",
    },

    servers: [
      {
        url: "http://localhost:5000/api/v1",
      },
    ],

    tags: [
      {
        name: "Authentication",
      },
      {
        name: "Users",
      },
      {
        name: "Posts",
      },
      {
        name: "Likes",
      },
      {
        name: "Comments",
      },
      {
        name: "Follow",
      },
      {
        name: "Notifications",
      },
      {
        name: "Feed",
      },
    ],

    ...schemas,
  },

  apis: [
    "./src/routes/*.js",
  ],
};

const swaggerSpec =
  swaggerJSDoc(options);

export default swaggerSpec;