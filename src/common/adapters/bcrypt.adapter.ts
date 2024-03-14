import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { HashAdapter } from "../interfaces/hash-adapter.interface";

@Injectable()
export class BcryptAdapter implements HashAdapter {
    hash(password: string): string {
        const salt = genSaltSync()
        return hashSync(password, salt)
    }
    compare(password: string, prevHash: string): boolean {
        return compareSync(password, prevHash);
    }

}