import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { OrmConfig } from '@database/data-source';
import { AuthModule } from './auth/auth.module';
import { AppLoggerModule } from '@config/logger/app-logger.module';
import { addTransactionalDataSource, getDataSourceByName } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { AppController } from '@module/app.controller';
import { CategoryController } from './category/category.controller';
import { CategoryModule } from './category/category.module';
import { ProductService } from './product/product.service';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { OrderService } from './order/order.service';
import { OrderModule } from './order/order.module';
import { ImageController } from './image/image.controller';
import { ImageModule } from './image/image.module';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';
import { VoucherController } from './voucher/voucher.controller';
import { VoucherModule } from './voucher/voucher.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        const testDataSourceOptionsString = process.env.TEST_DATA_SOURCE_OPTIONS;
        let testDataSourceOptions = {};
        if (testDataSourceOptionsString) {
          testDataSourceOptions = JSON.parse(testDataSourceOptionsString);
        }
        return {
          ...OrmConfig,
          ...testDataSourceOptions,
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        const existingDataSource = getDataSourceByName(options.name || 'default');
        return existingDataSource || addTransactionalDataSource(new DataSource(options));
      },
    }),
    AuthModule,
    UserModule,
    AppLoggerModule,
    CategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    ImageModule,
    PaymentModule,
    VoucherModule,
  ],
  controllers: [AppController, CategoryController, ProductController, ImageController, VoucherController],
  providers: [ProductService, OrderService, PaymentService],
})
export class AppModule {}
