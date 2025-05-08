import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User)
  async me(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.usersService.findById(id);
  }
}
