import { PartialType } from '@nestjs/mapped-types';
import { CreatePasswordtokenDto } from './create-passwordtoken.dto';

export class UpdatePasswordtokenDto extends PartialType(CreatePasswordtokenDto) {}
