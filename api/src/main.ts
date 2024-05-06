import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { dataSource } from './datasource';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    await dataSource.initialize();

    await app.listen(2000);
}
bootstrap();
