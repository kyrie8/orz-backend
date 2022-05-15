import { Role } from 'src/role/entities/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Menu')
export class Menu {
  @PrimaryGeneratedColumn()
  menu_id: number;

  @Column({ default: 0 }) // 0表示父级
  parent_id: number;

  @Column()
  menu_name: string;

  @Column()
  path: string;

  @Column()
  component: string;

  @Column()
  icon: string;

  @Column('enum', { enum: [1, 0], default: 1 })
  type: number;

  @Column('enum', { enum: [1, 0], default: 1 })
  is_out_link: number;

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];

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
}
