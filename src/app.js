export function createApp() {
  const app = express();

  const corsOrigin = process.env.CORS_ORIGIN || "https://api.shimmersnshine.in";

  const allowedOrigins = corsOrigin
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(
    cors({
      origin: function (requestOrigin, callback) {
        if (!requestOrigin) {
          return callback(null, true);
        }

        if (allowedOrigins.includes(requestOrigin)) {
          return callback(null, requestOrigin);
        }

        return callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "1mb" }));

  app.use("/api", publicRouter);
  app.use("/api/payments", publicPaymentsRouter);

  app.use("/api/admin/auth", adminAuthRouter);
  app.use("/api/admin/categories", requireAdmin, adminCategoriesRouter);
  app.use("/api/admin/products", requireAdmin, adminProductsRouter);
  app.use("/api/admin/coupons", requireAdmin, adminCouponsRouter);
  app.use("/api/admin/orders", requireAdmin, adminOrdersRouter);
  app.use("/api/admin/customers", requireAdmin, adminCustomersRouter);

  return app;
}