import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/role/entities/role.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ length: 100 })
  username: string; // 用户名

  @Exclude()
  @Column({ select: false })
  password: string; // 密码

  @Column({ default: null })
  avatar: string; //头像

  @Column('enum', { enum: [1, 0], default: 1 })
  status: number;

  @Column({ default: null })
  email: string;

  @Column({ default: null })
  desc: string;

  @Column({
    name: 'create_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createTime: Date;

  @Column({
    name: 'update_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updateTime: Date;

  // @ManyToOne((type) => Role, (role) => role.users)
  // role: Role;
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'user_role', // 中间表名
    joinColumns: [{ name: 'user_id' }], // 中间表 主表 字段
    inverseJoinColumns: [{ name: 'role_id' }], // 中间表 副表 字段
  })
  roles: Role[];

  @BeforeInsert()
  async encryptPwd() {
    this.password = await bcrypt.hashSync(this.password);
  }
}
