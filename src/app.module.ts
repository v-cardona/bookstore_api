import { Module } from '@nestjs/common';
import { Configuration } from './config/config.keys';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './modules/user/user.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { FilesModule } from './modules/files/files.module';
import { ReviewModule } from './modules/review/review.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UserModule, RoleModule, AuthModule, BookModule, FilesModule, ReviewModule],
})
export class AppModule {
  static port: number | string;
  static firebaseStorageBucket: string;
  
  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
    AppModule.firebaseStorageBucket = this._configService.get(Configuration.STORAGE_BUCKET);
  }
}
