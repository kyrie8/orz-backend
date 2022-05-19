import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { MenuService, menuStr } from 'src/menu/menu.service';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

interface IAuthMenu {
  auth: unknown[];
  treeMenus: unknown[];
}
@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private roleService: RoleService,
    private menuService: MenuService,
    private jwtService: JwtService,
  ) {}

  createToken(user: Partial<User>) {
    return this.jwtService.sign(user);
  }

  async login(user: Partial<User>) {
    const userInfo = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .addSelect('user.password')
      .where('user.username=:username', { username: user.username })
      .getOne();
    let list = [];
    let authArray = [];
    let menuList = [];
    const { roles, user_id, username } = userInfo;
    const token = this.createToken({ user_id, username });
    if (roles.length) {
      //不能在foreach map filter等有回调的方法中使用await
      const role_length = roles.length;
      for (let index = 0; index < role_length; index++) {
        const userMenu = await this.roleService.getMenu(roles[index].role_id);
        list = [...list, ...userMenu];
      }
      const { auth, treeMenus } = this.filterArrObj(list);
      authArray = auth;
      menuList = treeMenus;
    }
    if (user_id === 1) {
      authArray.push('admin');
    }
    //添加权限缓存
    await this.cacheManager.set('auth', authArray, { ttl: 28800 });
    return { token, user: userInfo, auth: authArray, menu: menuList };
  }

  filterArrObj(data: menuStr[]): IAuthMenu {
    const map = new Map();
    for (const item of data) {
      if (!map.has(item.menu_id)) {
        map.set(item.menu_id, item);
      }
    }
    const menus = [...map.values()].filter((item) => item.type === 1);
    const auth = [...map.values()]
      .filter((item) => item.type === 0)
      .map((item) => {
        return item.component;
      });
    const treeMenus = this.menuService.getTreeList(menus, [], 0);
    return {
      auth,
      treeMenus,
    };
  }
}
