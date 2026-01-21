const swaggerJsdoc = require("swagger-jsdoc");

const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Surplus Driver App API",
			version: "1.0.0",
			description: "API documentation for the Surplus Driver App Internal Backend Service",
		},
		servers: [
			{
				url: "http://localhost:3070/api/v1",
				description: "Local Development Server",
			},
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
					description: "Enter your JWT token in the format: Bearer <token>",
				},
			},
			schemas: {
				Driver: {
					type: "object",
					properties: {
						id: { type: "integer" },
						name: { type: "string" },
						email: { type: "string" },
						phone: { type: "string" },
						is_active: { type: "boolean" },
					},
				},
				Admin: {
					type: "object",
					properties: {
						id: { type: "integer" },
						username: { type: "string" },
					},
				},
				Order: {
					type: "object",
					properties: {
						id: { type: "integer" },
						customer_name: { type: "string" },
						customer_address: { type: "string" },
						juice_type: { type: "string" },
						quantity: { type: "integer" },
						status: {
							type: "string",
							enum: ["MENUNGGU", "DITERIMA", "DALAM_PERJALANAN", "SELESAI"],
						},
						assigned_driver_id: { type: "integer" },
						created_at: { type: "string", format: "date-time" },
					},
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	apis: ["./src/routes/*.js"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = specs;
