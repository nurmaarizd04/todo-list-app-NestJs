import { Logger, ValidationPipe } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { MainModule } from "./main.module";

async function bootstrap() {
        const app: INestApplication = await NestFactory.create(MainModule);
        app.setGlobalPrefix("v1");

        // app.useGlobalPipes(
        //         new ValidationPipe({
        //                 whitelist: false,
        //                 forbidNonWhitelisted: true,
        //                 transform: true
        //         })
        // );

        app.enableCors({
                origin: "http://localhost:3000",
                credentials: true
        });

        const logger: Logger = new Logger("TodoListApplication");
        const port: string | number = process.env.APP_TODO_LIST_PORT ?? 3000;

        await app.listen(port, () => {
                logger.log(`Application Started at Port: ${port}`);
        });
}

void bootstrap();
