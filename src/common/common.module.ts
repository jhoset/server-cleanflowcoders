import { Module } from '@nestjs/common';
import { BcryptAdapter } from './adapters/bcrypt.adapter';

@Module({
    providers: [BcryptAdapter],
    exports: [BcryptAdapter]
})
export class CommonModule { }
