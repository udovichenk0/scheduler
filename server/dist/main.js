"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const session = require("express-session");
const config_1 = require("@nestjs/config");
const cron_1 = require("cron");
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
(0, cron_1.job)('0 */24 * * *', async function () {
    await prismaClient.user.deleteMany({
        where: {
            AND: [
                { verified: false },
                {
                    created_at: {
                        lte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
                    },
                },
            ],
        },
    });
}, null, true);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true,
    });
    app.use(session({
        secret: configService.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
        },
    }));
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map