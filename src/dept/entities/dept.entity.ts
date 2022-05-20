import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Dept')
export class Dept {
  @PrimaryGeneratedColumn()
  dept_id: number;

  @Column({ default: 0 }) // 0表示父级
  parent_id: number;

  @Column()
  remark: string;

  @Column()
  name: string;

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

  @OneToMany(() => User, (user) => user.dept)
  users: User[];
}
