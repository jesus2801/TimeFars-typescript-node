import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ValueTransformer,
} from 'typeorm';

class BoolBitTransformer implements ValueTransformer {
  // To db from typeorm
  to(value: boolean | null): Buffer | null {
    if (value === null) {
      return null;
    }
    const res = Buffer.alloc(1);
    res[0] = value ? 1 : 0;
    return res;
  }
  // From db to typeorm
  from(value: Buffer): boolean | null {
    if (value === null) {
      return null;
    }
    return value[0] === 1;
  }
}

@Entity()
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  userID: number;

  @Column({ length: 50 })
  userName: string;

  @Column({ length: 50 })
  mail: string;

  @Column({ length: 150 })
  pass: string;

  @Column({
    length: 8,
    default: 'n-1',
  })
  avatar: string;

  @Column({
    default: () => 'CURRENT_TIMESTAMP',
  })
  unionDate: Date;

  @Column({ length: 35 })
  verificationCode: string;

  @Column({
    type: 'bit',
    // default: () => `"'b'1''"`,
    transformer: new BoolBitTransformer(),
  })
  verified: boolean;
}
